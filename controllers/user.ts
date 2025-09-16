import bcrypt from "bcryptjs";
import { PrismaClient, Status } from "../generated/prisma/client.js";
import type { Request, Response, NextFunction } from "express";
import type { PostUserOption } from "../types.d.ts";

const prisma = new PrismaClient();

async function getUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany();
    await prisma.$disconnect();
    const usersInfoPicked = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      bio: user.bio,
      followers: user.followers,
    }));
    return res.json(usersInfoPicked);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function createUser(req: Request, res: Response, next: NextFunction) {
  const { username, email, password, admin, adminCode }: PostUserOption =
    req.body;
  let status: Status = "BASIC";
  if (admin) {
    if (adminCode === process.env.ADMIN_CODE) {
      status = "ADMIN";
    } else {
      return next(
        Error("Incorrect admin code provided", {
          cause: { msg: "Incorrect code", path: "adminCode" },
        })
      );
    }
  }
  bcrypt.hash(password, 10, async (err, hashedPassword = "") => {
    if (err) return next(err);
    try {
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          status,
        },
      });
      await prisma.$disconnect();
      return res.json({ id: user.id, username });
    } catch (e) {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    }
  });
}

async function updateUser(req: Request, res: Response, next: NextFunction) {
  const {
    firstName,
    lastName,
    username,
    bio,
    email,
    website,
    admin,
    adminCode,
  } = req.body;
  let status: Status = "BASIC";
  if (admin) {
    if (adminCode === process.env.ADMIN_CODE) {
      status = "ADMIN";
    } else {
      return next(
        Error("Incorrect admin code provided", {
          cause: { msg: "Incorrect code", path: "adminCode" },
        })
      );
    }
  }
  try {
    const id = +req.params.id;
    const userData = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, username, bio, email, website, status },
    });
    await prisma.$disconnect();
    const lessUserData = { ...userData, password: "***" };
    return res.json(lessUserData);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function updateFollowData(req: Request, res: Response) {
  try {
    const id = +req.params.id;
    const followId = +req.params.followId;
    const followUser = req.query.follow === "true";
    // Follow or unfollow user (followId) by either pushing or filtering away ids from user models
    const result = followUser
      ? await prisma.$transaction([
          prisma.user.update({
            where: { id: followId },
            data: { followers: { push: id } },
          }),
          prisma.user.update({
            where: { id },
            data: { following: { push: followId } },
          }),
        ])
      : await prisma.$transaction(async (tx) => {
          const userToUnfollow = await tx.user.findUnique({
            where: { id: followId },
          });
          const userData = await tx.user.findUnique({
            where: { id },
          });
          const updatedUserToUnfollow = userToUnfollow?.followers.filter(
            (f) => f !== id
          ); // Remove id

          console.log("=== updatedUserToUnfollow ===");
          console.log(updatedUserToUnfollow);

          const updatedUserData = userData?.following.filter(
            (f) => f !== followId
          ); // Remove followId

          console.log("=== updatedUserData ===");
          console.log(updatedUserData);

          const step1 = await tx.user.update({
            where: { id: followId },
            data: { followers: updatedUserToUnfollow },
          });
          const step2 = await tx.user.update({
            where: { id },
            data: { following: updatedUserData },
          });
          return [step1, step2];
        });
    await prisma.$disconnect();

    console.log("=== updateFollowData ===");
    console.log({ followUser });
    console.log(result);

    const lessUserData = { ...result[1], password: "***" };
    return res.json(lessUserData);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function deleteUser(req: Request, res: Response) {
  try {
    const id = +req.params.id;
    const user = await prisma.user.delete({ where: { id } });
    await prisma.$disconnect();
    return res.json(user);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

export { getUsers, createUser, updateUser, updateFollowData, deleteUser };
