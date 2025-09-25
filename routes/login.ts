import { Router } from "express";
import passport from "passport";
import * as validate from "../middlewares/validator.ts";
import * as controller from "../controllers/login.ts";

const router = Router();

router.get("/", passport.authenticate("github", { scope: ["profile"] }));
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
