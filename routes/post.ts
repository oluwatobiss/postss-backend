import { Router } from "express";
import * as middleware from "../middlewares/authentication.ts";
import * as controller from "../controllers/post.ts";

const router = Router();

router.get("/", middleware.authenticateUser, controller.getPosts);
router.get(
  "/authors/:authorId",
  middleware.authenticateUser,
  controller.getAuthorPosts
);
router.get(
  "/:postId/comments",
  middleware.authenticateUser,
  controller.getPostComments
);
router.post("/", middleware.authenticateUser, controller.createPost);
router.post(
  "/:postId/comments",
  middleware.authenticateUser,
  controller.createComment
);
router.put("/:id", middleware.authenticateUser, controller.updatePost);
router.put(
  "/:postId/comments/:id",
  middleware.authenticateUser,
  controller.updateComment
);
router.delete("/:id", middleware.authenticateUser, controller.deletePost);
router.delete(
  "/:postId/comments/:id",
  middleware.authenticateUser,
  controller.deleteComment
);

export default router;
