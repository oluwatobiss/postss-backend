import { Router } from "express";
import * as controller from "../controllers/user.ts";
import * as validate from "../middlewares/validator.ts";
import * as middleware from "../middlewares/authentication.ts";

const router = Router();

router.get("/", middleware.authenticateUser, controller.getUsers);
router.post(
  "/",
  validate.signUpForm,
  validate.getResult,
  controller.createUser
);
router.put(
  "/:id",
  middleware.authenticateUser,
  validate.updateUserForm,
  validate.getResult,
  controller.updateUser
);
router.put(
  "/:followId/:id",
  middleware.authenticateUser,
  controller.updateFollowData
);
router.delete("/:id", middleware.authenticateUser, controller.deleteUser);

export default router;
