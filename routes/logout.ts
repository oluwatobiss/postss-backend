import { Router } from "express";
import * as controller from "../controllers/logout.ts";

const router = Router();
router.post("/", controller.logout);

export default router;
