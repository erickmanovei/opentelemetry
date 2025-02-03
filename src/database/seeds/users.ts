import prisma from "../prismaClient";
import bcrypt from 'bcryptjs';

const users = async (): Promise<void> => {
  const masterProfile = await prisma.profile.findFirstOrThrow({
    where: {
      tag: 'master',
    },
  })

  await prisma.user.upsert({
    where: {
      email: 'teste@teste.com',
    },
    update: {},
    create: {
      name: 'Master',
      email: 'teste@teste.com',
      cpf: '991.183.310-09',
      password: bcrypt.hashSync('etdsmndr', 8),
      userProfiles: {
        create: {
          profileId: masterProfile.id,
        },
      }
    },
  });
}

export default users;
