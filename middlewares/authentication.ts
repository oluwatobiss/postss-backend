import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const userToken = authHeader && authHeader.split(" ")[1];
  if (!userToken) {
    return res.status(401).json({ message: "No verification token provided" });
  }
  jwt.verify(userToken, `${process.env.JWT_SECRET}`, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid verification token" });
    }
    req.user = decoded;
    next();
  });
}

export { authenticateUser };
