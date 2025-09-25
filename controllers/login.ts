import type { Request, Response, NextFunction } from "express";
import type { DoneOptions, Error, Payload } from "../types.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import "../passport/github.ts";
import "../passport/local.ts";

const redirectGitHub = [
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.POSTSS_APP_URI}/login`,
  }),
  (req: Request, res: Response) => {
    res.redirect(`${process.env.POSTSS_APP_URI}/profile`);
  },
];

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

export { redirectGitHub, loginWithLocal };
