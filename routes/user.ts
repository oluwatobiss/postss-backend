import { Router } from "express";
import * as controller from "../controllers/user.ts";
import * as validate from "../middlewares/validator.ts";

const router = Router();

router.post(
  "/",
  validate.signUpForm,
  validate.getResult,
  controller.createUser
);

export default router;
