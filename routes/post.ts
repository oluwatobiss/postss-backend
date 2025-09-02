import { Router } from "express";
import * as controller from "../controllers/post.ts";

const router = Router();

router.get("/", controller.getPosts);
router.get("/authors/:authorId", controller.getAuthorPosts);
router.post("/", controller.createPost);
router.post("/:postId/comments", controller.createComment);
router.put("/:id", controller.updatePost);
router.delete("/:id", controller.deletePost);

export default router;
