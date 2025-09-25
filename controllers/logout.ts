import type { Request, Response } from "express";

function logout(req: Request, res: Response) {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "Logged out" });
}

export { logout };
