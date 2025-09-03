import { Router } from "express";
import * as controller from "../controllers/post.ts";

const router = Router();

router.get("/", controller.getPosts);
router.get("/authors/:authorId", controller.getAuthorPosts);
router.get("/:postId/comments", controller.getPostComments);
router.post("/", controller.createPost);
router.post("/:postId/comments", controller.createComment);
router.put("/:id", controller.updatePost);
router.put("/:postId/comments/:id", controller.updateComment);
router.delete("/:id", controller.deletePost);
router.delete("/:postId/comments/:id", controller.deleteComment);

export default router;
