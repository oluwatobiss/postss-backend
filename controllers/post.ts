import type { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

async function getPosts(req: Request, res: Response) {
  // console.log("=== getPosts ===");
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

    // console.log(postsInfoPicked);

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
    const io = req.app.get("io");
    const { post: content, authorId } = req.body;

    await prisma.post.create({ data: { content, authorId } });
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

    // Send the new post created to all connected users (including the sender)
    io.emit("newPost", postsInfoPicked);
    return res.json(postsInfoPicked);
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

    // Send total post likes to all connected users (including the sender)
    io.emit("postLike", totalLikes);

    return res.json(totalLikes);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function deletePost(req: Request, res: Response) {
  try {
    const io = req.app.get("io");
    const id = +req.params.id;
    const post = await prisma.post.delete({ where: { id } });
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

    console.log("=== deletePost ===");
    console.log(postsInfoPicked);
    console.log(post);

    // Send the updated post list to connected users (including the sender)
    io.emit("deletePost", postsInfoPicked);
    return res.json(postsInfoPicked);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

export { getPosts, getAuthorPosts, createPost, updatePost, deletePost };
