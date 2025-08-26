import type { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

async function getPosts(req: Request, res: Response) {
  console.log("=== getPosts ===");
  try {
    const posts = await prisma.post.findMany({
      include: { author: true, comments: true, likes: true },
      orderBy: { createdAt: "desc" },
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

async function getAuthorPosts(req: Request, res: Response) {
  console.log("=== getAuthorPosts ===");
  try {
    const authorId = +req.params.authorId;
    console.log({ authorId });

    const posts = await prisma.post.findMany({
      where: { authorId },
      include: { author: true, comments: true, likes: true },
      orderBy: { createdAt: "desc" },
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
    const io = req.app.get("io");
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
    await prisma.$disconnect();

    console.log("=== updatePost ===");
    console.log(post);

    const totalLikes = { postId: post.id, likes: post.likes.length };
    console.log(totalLikes);

    // Send total post likes to all the users (including the sender)
    io.emit("postLike", totalLikes);

    return res.json(totalLikes);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

export { getPosts, getAuthorPosts, createPost, updatePost };
