import jwt from "jsonwebtoken";
import type { User } from "../types.js";

function generateToken(user: User) {
  return jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "7d" });
}

function verifyToken(token: string) {
  try {
    return jwt.verify(token, `${process.env.JWT_SECRET}`) as User;
  } catch {
    return null;
  }
}

export { generateToken, verifyToken };
