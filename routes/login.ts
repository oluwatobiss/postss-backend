import passport from "passport";
import { Router } from "express";
import * as validate from "../middlewares/validator.ts";
import * as controller from "../controllers/login.ts";
import "../passport/github.ts";

const router = Router();

// passport.authenticate() adds a 'code' query parameter (?code=xxx) to the redirect url
// (https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
// #2-users-are-redirected-back-to-your-site-by-github)
// (https://youtu.be/nK6fkNShhGc?si=1C4Jkrouf5adW8AP)
router.get("/", passport.authenticate("github", { scope: ["profile"] }));
// passport.authenticate() uses the 'code' query parameter from the url to make request
// (within the scope granted) to GitHub on behalf of the user
// (https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
// #3-use-the-access-token-to-access-the-api)
router.get(
  "/github",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.POSTSS_APP_URI}/login`,
  }),
  controller.loginWithGitHub
);
router.get("/user", controller.getUserInfo);
router.post(
  "/",
  validate.loginForm,
  validate.getResult,
  controller.loginWithLocal
);

export default router;
