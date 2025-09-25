import { PrismaClient } from "../generated/prisma/client.js";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import passport from "passport";

const prisma = new PrismaClient();
const optionsObject = { usernameField: "email" };

passport.use(
  new LocalStrategy(optionsObject, async (email, password, done) => {
    try {
      const userData = await prisma.user.findUnique({ where: { email } });
      await prisma.$disconnect();
      if (!userData)
        return done(null, false, { msg: "Incorrect email", path: "email" });
      const match = await bcrypt.compare(password, userData.password);
      if (!match)
        return done(null, false, {
          msg: "Incorrect password",
          path: "password",
        });
      const lessUserData = { ...userData, password: "***" };
      return done(null, lessUserData);
    } catch (e) {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    }
  })
);
