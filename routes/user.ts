import { Router } from "express";
import * as controller from "../controllers/user.ts";
import * as validate from "../middlewares/validator.ts";

const router = Router();

router.get("/", controller.getUsers);

router.post(
  "/",
  validate.signUpForm,
  validate.getResult,
  controller.createUser
);

router.put(
  "/:id",
  validate.updateUserForm,
  validate.getResult,
  controller.updateUser
);

router.put("/:followId/:id", controller.updateFollowData);

router.delete("/:id", controller.deleteUser);

export default router;
