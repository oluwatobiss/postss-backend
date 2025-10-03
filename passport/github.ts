import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { PrismaClient } from "../generated/prisma/client.js";
import type { GithubProfile } from "../types.js";

const prisma = new PrismaClient();
const optionsObject = {
  clientID: process.env.GITHUB_CLIENT_ID as string,
  clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  callbackURL: `${process.env.BACKEND_URI}/login/github`,
};

passport.use(
  new GitHubStrategy(
    optionsObject,
    async (
      accessToken: string,
      refreshToken: string,
      profile: GithubProfile,
      done: (error: any, user?: Express.User | false | null, info?: any) => void
    ) => {
      try {
        const { username } = profile;
        const { avatar_url, bio, blog, email } = profile._json;
        const name = profile.displayName.split(" ");
        const userData = await prisma.user.upsert({
          where: { email },
          update: {
            firstName: name[0] ?? "",
            lastName: name[1] ?? "",
            username: username ?? "",
            bio: bio ?? "",
            email: email ?? "",
            website: blog ?? "",
            avatar: avatar_url.replace(/\?.*/g, "") ?? "",
          },
          create: {
            firstName: name[0] ?? "",
            lastName: name[1] ?? "",
            username: username ?? "",
            bio: bio ?? "",
            email: email ?? "",
            website: blog ?? "",
            password: "",
            avatar: avatar_url.replace(/\?.*/g, "") ?? "",
          },
        });
        await prisma.$disconnect();
        const lessUserData = { ...userData, password: "***" };
        // Complete this callback's task and attach user's data to req.user for subsequent use the app
        return done(null, lessUserData);
      } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      }
    }
  )
);
