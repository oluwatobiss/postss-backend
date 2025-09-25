import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.ts";

function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const userToken = authHeader && authHeader.split(" ")[1];
  if (!userToken) {
    return res.status(401).json({ message: "No verification token provided" });
  }
  const payload = verifyToken(userToken);
  if (!payload)
    return res.status(403).json({ message: "Invalid verification token" });
  req.user = payload;
  next();
}

export { authenticateUser };
