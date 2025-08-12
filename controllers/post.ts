import type { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

async function createPost(req: Request, res: Response) {
  try {
    const { post: content, authorId } = req.body;

    const io = req.app.get("io");
    console.log("=== IO in createPost ===");
    console.log(io);

    console.log("=== createPost ===");
    console.log({ content, authorId });

    const post = await prisma.post.create({ data: { content, authorId } });
    await prisma.$disconnect();

    console.log(post);

    return res.json(post);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

export { createPost };
