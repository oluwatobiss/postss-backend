// import { PrismaClient } from "../generated/prisma/client.js";
import type { Profile } from "passport-github2";
import { Strategy as GitHubStrategy } from "passport-github2";
import passport from "passport";

// const prisma = new PrismaClient();
const optionsObject = {
  clientID: process.env.GITHUB_CLIENT_ID as string,
  clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  callbackURL: "/login/github",
};

passport.use(
  new GitHubStrategy(
    optionsObject,
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: Express.User | false | null, info?: any) => void
    ) => {
      try {
        console.log("=== GitHubStrategy ===");

        console.log(profile);
        console.log(accessToken);
        console.log(refreshToken);
        console.log(done);

        // await prisma.user.upsert({
        //   where: { email: process.env.DEMO_EMAIL },
        //   update: {}, // Make upsert() behave like Sequelize's findOrCreate() method. In other words, An empty update object means "If the record (user) already exists, do nothing. Otherwise, create it." This type of seeding is called "idempotent seeding." (refs: (1) https://www.prisma.io/docs/orm/prisma-client/queries/crud#update-or-create-records (2) https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findorcreate)
        //   create: {
        //     firstName: "",
        //     lastName: "",
        //     username: "",
        //     bio: "",
        //     email: "",
        //     website: "",
        //     password: "",
        //   },
        // });
        // await prisma.$disconnect();
        // const lessUserData = {
        //   ...userData,
        //   password: "***",
        // };
        return done(null, { profile, accessToken, refreshToken });
      } catch (e) {
        console.error(e);
        // await prisma.$disconnect();
        process.exit(1);
      }
    }
  )
);
