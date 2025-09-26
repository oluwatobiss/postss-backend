import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma/client.js";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();

const alphaErr = "can contain only letters";
const emptyErr = "must not be blank";
const lengthErr = (min: number, max: number) =>
  `must be between ${min} and ${max} characters`;

const updateUserForm = [
  body(["firstName", "lastName"])
    .trim()
    .notEmpty()
    .withMessage(`Name ${emptyErr}.`)
    .escape()
    .isAlpha()
    .withMessage(`Name ${alphaErr}.`)
    .isLength({ min: 2, max: 64 })
    .withMessage(`Name ${lengthErr(2, 64)}.`)
    .optional({ values: "falsy" }),
  body("bio")
    .trim()
    .notEmpty()
    .withMessage(`Bio ${emptyErr}.`)
    .isLength({ min: 7, max: 300 })
    .withMessage(`Bio ${lengthErr(7, 300)}.`)
    .escape(),
  body("avatar")
    .trim()
    .isURL()
    .withMessage("Enter a valid URL.")
    .custom((url) => {
      const nonGitHubUrl = /^https:\/\/avatars.githubusercontent.com\/u\//.test(
        url
      );
      if (!nonGitHubUrl) throw new Error("Enter a valid GitHub avatar URL.");
      return nonGitHubUrl;
    })
    .optional({ values: "falsy" }),
  body("email").trim().isEmail().withMessage("Enter a valid email."),
  body("website")
    .trim()
    .isURL()
    .withMessage("Enter a valid URL.")
    .optional({ values: "falsy" }),
  body("adminCode")
    .trim()
    .notEmpty()
    .withMessage(`Passcode ${emptyErr}.`)
    .escape()
    .optional({ values: "falsy" }),
];

const signUpForm = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Username ${emptyErr}.`)
    .escape()
    .isLength({ min: 2, max: 8 })
    .withMessage(`Username ${lengthErr(2, 8)}.`),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter a valid email.")
    .custom(async (email) => {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      await prisma.$disconnect();
      if (existingUser) {
        throw new Error("E-mail already in use.");
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password ${emptyErr}.`)
    .isLength({ min: 3, max: 70 })
    .withMessage(`Password ${lengthErr(3, 70)}.`)
    .escape(),
];

const loginForm = [
  body("email").trim().isEmail().withMessage("Enter a valid email."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password ${emptyErr}.`)
    .isLength({ min: 3, max: 70 })
    .withMessage(`Password ${lengthErr(3, 70)}.`)
    .escape(),
];

async function getResult(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  next();
}

export { signUpForm, updateUserForm, loginForm, getResult };
