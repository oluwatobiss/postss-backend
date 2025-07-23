import type { Request, Response, NextFunction } from "express";
import type { PostUserOption } from "../types.d.ts";

function createUser(req: Request, res: Response, next: NextFunction) {
  const { username, email, password, admin, adminCode }: PostUserOption =
    req.body;

  console.log({ username, email, password, admin, adminCode });
  console.log(res);
  console.log(next);
}

export { createUser };
