import passport from "passport";
import type { Request, Response, NextFunction } from "express";
import type { DoneOptions, Error, User } from "../types.js";
import { generateToken, verifyToken } from "../utils/jwt.ts";
import "../passport/local.ts";

function getUserInfo(req: Request, res: Response) {
  const token = req.cookies.jwt; // get the token res.cookie stored as jwt
  console.log({ token });
  if (!token)
    return res.status(401).json({ error: "No verification token found" });
  const payload = verifyToken(token);
  if (!payload)
    return res.status(401).json({ error: "Invalid verification token" });

  res.json({ token, payload });
}

function loginWithGitHub(req: Request, res: Response) {
  const token = generateToken(req.user as User);
  // Set JWT in httpOnly cookie while sending a response to front-end.
  // This is safer than exposing the JWT in the URL as a query parameter (/profile?token=...)
  // It protects against XSS attack.
  // Exposing JWT in a URL will make it readable by frontend JS and leaked in browser history.

  console.log("=== loginWithGitHub ===");
  console.log({ token });

  res.cookie("jwt", token, {
    httpOnly: true, // make the cookie inaccessible to front-end JavaScript
    secure: process.env.NODE_ENV === "production", // ensure cookie is sent via only https in production
    sameSite: "none", // allow sending cookie in all context (https://web.dev/articles/samesite-cookies-explained)
    // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 5 * 60 * 1000, // 5 mins
  });
  res.redirect(`${process.env.POSTSS_APP_URI}/github`);
}

// Use passport.authenticate()'s optional callback syntax to enable sending a meaningful failure message
// to the front-end. The alternate router.post("/", validators, passport.authenticate("local"), controller)
// syntax will not invoke the controller on a failure and the front-end will get the default 401 (Unauthorized)
// message. Setting a failureRedirect key will also not work because the front-end fetch() API expects a
// JSON response, not a redirect directive.
function loginWithLocal(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    "local",
    async (err: Error, payload: User, info: DoneOptions) => {
      try {
        if (err || !payload) {
          const error = Error("Authentication error", { cause: info });
          return next(error);
        }
        const user = { id: payload.id };
        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);
          const token = generateToken(payload);
          return res.json({ token, payload });
        });
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
}

export { getUserInfo, loginWithGitHub, loginWithLocal };
