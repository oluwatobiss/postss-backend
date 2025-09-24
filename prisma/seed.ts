import { faker } from "@faker-js/faker";
import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  bcrypt.hash(process.env.DEMO_PASSWORD!, 10, async (err, hashedPassword) => {
    if (err) throw err;
    try {
      const { url, username } = faker.internet;
      const { bio, firstName, lastName } = faker.person;
      const first = firstName();
      const last = lastName();
      await prisma.user.upsert({
        where: { email: process.env.DEMO_EMAIL },
        update: {}, // Make upsert() behave like Sequelize's findOrCreate() method. In other words, An empty update object means "If the record (user) already exists, do nothing. Otherwise, create it." This type of seeding is called "idempotent seeding." (refs: (1) https://www.prisma.io/docs/orm/prisma-client/queries/crud#update-or-create-records (2) https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findorcreate)
        create: {
          firstName: first,
          lastName: last,
          username: username({
            firstName: first,
            lastName: last,
          }).toLowerCase(),
          bio: bio(),
          email: process.env.DEMO_EMAIL!,
          website: url(),
          password: hashedPassword!,
        },
      });
      await prisma.$disconnect();
    } catch (e) {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    }
  });
}

main();
