import type { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "../generated/prisma/client.js";
import { uploadMediaToCloudinary } from "../utils/uploadMediaToCloudinary.ts";

const prisma = new PrismaClient();

async function getPosts(req: Request, res: Response) {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true, comments: true, likes: true },
      orderBy: { createdAt: "desc" },
    });
    await prisma.$disconnect();
    const postsInfoPicked = posts.map((post) => ({
      ...post,
      author: post.author.username,
      authorAvatar: post.author.avatar,
      comments: post.comments.length,
      likes: post.likes.map((like) => like.id),
    }));
    return res.json(postsInfoPicked);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function getAuthorPosts(req: Request, res: Response) {
  try {
    const authorId = +req.params.authorId;
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
    return res.json(postsInfoPicked);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function getPostComments(req: Request, res: Response) {
  try {
    const postId = +req.params.postId;
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { author: true, likes: true },
      orderBy: { createdAt: "desc" },
    });
    await prisma.$disconnect();
    const commentsInfoPicked = comments.map((comment) => ({
      ...comment,
      author: comment.author.username,
      authorAvatar: comment.author.avatar,
      likes: comment.likes.map((like) => like.id),
    }));
    return res.json(commentsInfoPicked);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function createPost(req: Request, res: Response) {
  try {
    const io = req.app.get("io");
    const { authorId, content } = req.body;
    let media = { destination: "", name: "", path: "" };
    if (req.file) {
      const { destination, name, path } = await uploadMediaToCloudinary(
        req.file
      );
      media = { destination, name, path };
    }

    await prisma.post.create({
      data: {
        authorId: +authorId,
        content,
        ...(media.name && { media }),
      },
    });
    const posts = await prisma.post.findMany({
      include: { author: true, comments: true, likes: true },
      orderBy: { createdAt: "desc" },
    });
    await prisma.$disconnect();

    const postsInfoPicked = posts.map((post) => ({
      ...post,
      author: post.author.username,
      authorAvatar: post.author.avatar,
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

async function createComment(req: Request, res: Response) {
  try {
    const io = req.app.get("io");
    const postId = +req.params.postId;
    const { content, authorId } = req.body;
    let media = { path: "", name: "" };
    if (req.file) {
      const { path, name } = await uploadMediaToCloudinary(req.file);
      media = { path, name };
    }

    await prisma.comment.create({
      data: {
        authorId: +authorId,
        content,
        postId,
        ...(media.name && { media }),
      },
    });
    const comments = await prisma.comment.findMany({
      include: { author: true, likes: true },
      orderBy: { createdAt: "desc" },
    });
    await prisma.$disconnect();

    const commentsInfoPicked = comments.map((comment) => ({
      ...comment,
      author: comment.author.username,
      authorAvatar: comment.author.avatar,
      likes: comment.likes.map((like) => like.id),
    }));
    // Send the new comment created to all connected users (including the sender)
    io.emit("newComment", commentsInfoPicked);
    return res.json(commentsInfoPicked);
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

    const totalLikes = { postId: post.id, likes: post.likes.length };
    // Send total post likes to all connected users (including the sender)
    io.emit("postLike", totalLikes);
    return res.json(totalLikes);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function updateComment(req: Request, res: Response) {
  try {
    const io = req.app.get("io");
    const id = +req.params.id;
    const { userId, likePost } = req.body;

    const comment = await prisma.comment.update({
      where: { id },
      data: {
        likes: likePost
          ? { connect: { id: userId } }
          : { disconnect: [{ id: userId }] },
      },
      include: { likes: true },
    });
    await prisma.$disconnect();

    const totalLikes = { commentId: comment.id, likes: comment.likes.length };
    // Send total comment likes to all connected users (including the sender)
    io.emit("commentLike", totalLikes);
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

    const deletedPost = await prisma.post.delete({ where: { id } });
    const media = deletedPost?.media as {
      destination: string;
      name: string;
      path: string;
    };
    const posts = await prisma.post.findMany({
      include: { author: true, comments: true, likes: true },
      orderBy: { createdAt: "desc" },
    });
    await prisma.$disconnect();

    if (media.name) {
      const filePath = `${media.destination}/${media.name}`;

      console.log("=== deletePost ===");
      console.log(deletedPost);
      console.log({ filePath });

      cloudinary.uploader.destroy(filePath);
    }

    const postsInfoPicked = posts.map((post) => ({
      ...post,
      author: post.author.username,
      authorAvatar: post.author.avatar,
      comments: post.comments.length,
      likes: post.likes.map((like) => like.id),
    }));
    // Send the updated post list to connected users (including the sender)
    io.emit("deletePost", postsInfoPicked);
    return res.json(postsInfoPicked);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function deleteComment(req: Request, res: Response) {
  try {
    const io = req.app.get("io");
    const id = +req.params.id;

    await prisma.comment.delete({ where: { id } });
    const comments = await prisma.comment.findMany({
      include: { author: true, likes: true },
      orderBy: { createdAt: "desc" },
    });
    await prisma.$disconnect();

    const commentsInfoPicked = comments.map((comment) => ({
      ...comment,
      author: comment.author.username,
      likes: comment.likes.map((like) => like.id),
    }));
    // Send the updated comment list to connected users (including the sender)
    io.emit("deleteComment", commentsInfoPicked);
    return res.json(commentsInfoPicked);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

export {
  getPosts,
  getAuthorPosts,
  getPostComments,
  createPost,
  createComment,
  updatePost,
  updateComment,
  deletePost,
  deleteComment,
};
