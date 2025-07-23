import type { Request, Response, NextFunction } from "express";

function createUser(req: Request, res: Response, next: NextFunction) {
  const {
    username,
    email,
    password,
    admin,
    adminCode,
  }: {
    username: string;
    email: string;
    password: string;
    admin: boolean;
    adminCode: string;
  } = req.body;

  console.log({ username, email, password, admin, adminCode });
  console.log(res);
  console.log(next);
}

export { createUser };
