import passport from "passport";
import { Router } from "express";
import * as validate from "../middlewares/validator.ts";
import * as controller from "../controllers/login.ts";
import "../passport/github.ts";

const router = Router();

router.get("/", passport.authenticate("github", { scope: ["profile"] }));
router.get("/user", controller.getUserInfo);
router.get(
  "/github",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.POSTSS_APP_URI}/login`,
  }),
  controller.loginWithGitHub
);
router.post(
  "/",
  validate.loginForm,
  validate.getResult,
  controller.loginWithLocal
);

export default router;
