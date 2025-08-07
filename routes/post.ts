import { Router } from "express";
import * as controller from "../controllers/post.ts";

const router = Router();

router.post("/", controller.createPost);

export default router;
