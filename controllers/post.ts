import type { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

async function getPosts(req: Request, res: Response) {
  console.log("=== getPosts ===");
  try {
    const posts = await prisma.post.findMany({
      include: { author: true, comments: true, likes: true },
    });
    await prisma.$disconnect();
    const postsInfoPicked = posts.map((post) => ({
      ...post,
      author: post.author.username,
      comments: post.comments.length,
      likes: post.likes.map((like) => like.id),
    }));

    console.log(postsInfoPicked);

    return res.json(postsInfoPicked);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function createPost(req: Request, res: Response) {
  try {
    const { post: content, authorId } = req.body;

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

async function updatePost(req: Request, res: Response) {
  try {
    const id = +req.params.id;
    const { userId, likePost } = req.body;
    const post = await prisma.post.update({
      where: { id },
      data: {
        likes: likePost
          ? { connect: { id: userId } }
          : { disconnect: [{ id: userId }] },
      },
      include: { likes: true },
    });

    console.log("=== updatePost ===");
    console.log(post);

    const totalLikes = { likes: post.likes.length };
    await prisma.$disconnect();
    return res.json(totalLikes);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

export { getPosts, createPost, updatePost };
