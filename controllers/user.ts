import type { Request, Response, NextFunction } from "express";
import type { PostUserOption } from "../types.d.ts";

async function createUser(req: Request, res: Response, next: NextFunction) {
  const { username, email, password, admin, adminCode }: PostUserOption =
    req.body;
  console.log({ username, email, password, admin, adminCode });
  let status = "BASIC";
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
  return res.json({ id: status, username });
}

export { createUser };
