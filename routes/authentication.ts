import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { PrismaClient } from "../generated/prisma/client.js";
import { Strategy as LocalStrategy } from "passport-local";
import type { DoneOptions, Error, Payload } from "../types.d.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import * as validate from "../middlewares/validator.ts";

const router = Router();
const prisma = new PrismaClient();
const optionsObject = { usernameField: "email" };

passport.use(
  new LocalStrategy(optionsObject, async (email, password, done) => {
    try {
      const userData = await prisma.user.findUnique({ where: { email } });
      await prisma.$disconnect();
      if (!userData)
        return done(null, false, { msg: "Incorrect email", path: "email" });
      const match = await bcrypt.compare(password, userData.password);
      if (!match)
        return done(null, false, {
          msg: "Incorrect password",
          path: "password",
        });
      const lessUserData = {
        ...userData,
        password: "***",
      };
      return done(null, lessUserData);
    } catch (e) {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    }
  })
);

function authenticateUser(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    "local",
    async (err: Error, payload: Payload, info: DoneOptions) => {
      try {
        if (err || !payload) {
          const error = Error("Authentication error", { cause: info });
          return next(error);
        }
        const user = { id: payload.id };
        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);
          const token = jwt.sign(payload, process.env.JWT_SECRET!);
          return res.json({ token, payload });
        });
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
}

router.post("/", validate.loginForm, validate.getResult, authenticateUser);

export default router;
