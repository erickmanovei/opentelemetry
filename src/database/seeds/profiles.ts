import prisma from "../prismaClient";

const profiles = async (): Promise<void> => {
  const profiles = [
    {
      tag: 'master',
      name: 'Usuário Master',
    },
    {
      tag: 'admin',
      name: 'Administrador',
    },
    {
      tag: 'seller',
      name: 'Vendedor',
    },
    {
      tag: 'customer',
      name: 'Cliente',
    },
  ]
  await Promise.all(
    profiles.map(profile =>
      prisma.profile.upsert({
        where: {
          tag: profile.tag,
        },
        update: {},
        create: profile,
      }),
    ),
  );
}

export default profiles;
