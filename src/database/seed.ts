import { PrismaClient } from '@prisma/client';
import profiles from './seeds/profiles';
import users from './seeds/users';

const prisma = new PrismaClient();

const main = async (): Promise<void> => {

  await profiles();
  await users();

};

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
