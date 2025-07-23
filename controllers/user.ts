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

export { createUser };
