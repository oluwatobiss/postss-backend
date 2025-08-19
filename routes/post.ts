import { Router } from "express";
import * as controller from "../controllers/post.ts";

const router = Router();

router.get("/", controller.getPosts);
router.post("/", controller.createPost);
router.put("/:id", controller.updatePost);

export default router;
