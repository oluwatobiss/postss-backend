import bcrypt from "bcryptjs";
import { PrismaClient, Status } from "../generated/prisma/client.js";
import type { Request, Response, NextFunction } from "express";
import type { PostUserOption } from "../types.d.ts";

const prisma = new PrismaClient();

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
    const lessUserData = {
      ...userData,
      password: "***",
    };
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

export { createUser, updateUser, deleteUser };
