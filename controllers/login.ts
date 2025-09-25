import type { Request, Response, NextFunction } from "express";
import type { DoneOptions, Error, Payload } from "../types.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import "../passport/github.ts";
import "../passport/local.ts";

function loginWithGitHub(req: Request, res: Response) {
  res.redirect(`${process.env.POSTSS_APP_URI}/profile`);
}

// Use passport.authenticate()'s optional callback syntax to enable sending a meaningful failure message
// to the front-end. The alternate router.post("/", validators, passport.authenticate("local"), controller)
// syntax will not invoke the controller on a failure and the front-end will get the default 401 (Unauthorized)
// message. Setting a failureRedirect key will also not work because the front-end fetch() API expects a
// JSON response, not a redirect directive.
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

export { loginWithGitHub, loginWithLocal };
