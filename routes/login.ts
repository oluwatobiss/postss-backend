import { Router } from "express";
import * as validate from "../middlewares/validator.ts";
import * as controller from "../controllers/login.ts";

const router = Router();

router.post(
  "/",
  validate.loginForm,
  validate.getResult,
  controller.loginWithLocal
);

export default router;
