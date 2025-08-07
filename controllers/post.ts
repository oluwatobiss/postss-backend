import type { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

async function createPost(req: Request, res: Response) {
  try {
    const { post, authorId } = req.body;

    console.log("=== createPost ===");
    console.log({ post, authorId });

    // console.log({ content, authorId });

    // const post = await prisma.post.create({
    //   data: { authorId, title, body, published, publishedDate },
    // });
    // await prisma.$disconnect();
    // return res.json(post);
  } catch (e) {
    console.error(e);
    // await prisma.$disconnect();
    process.exit(1);
  }
}

export { createPost };
