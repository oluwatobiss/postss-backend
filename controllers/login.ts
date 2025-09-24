import type { Request, Response, NextFunction } from "express";
import type { DoneOptions, Error, Payload } from "../types.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import "../passport/local.ts";

function loginWithLocal(req: Request, res: Response, next: NextFunction) {
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

export { loginWithLocal };
