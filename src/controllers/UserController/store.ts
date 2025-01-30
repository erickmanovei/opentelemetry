import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../../database/prismaClient';

const store = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { profileId, ...rest } = req.body;
    if (!rest.name || !rest.email || !rest.password) {
      throw new Error('Necessário enviar Nome, Email, Senha');
    }
    const user = await prisma.user.create({
      data: {
        ...rest,
        password: bcrypt.hashSync(rest.password, 8),
        registeredByUserId: req.user.id,
      },
    });

    if (profileId) {
      const profile = await prisma.profile.findFirstOrThrow({
        where: {
          id: profileId,
        },
      });
      if (
        !req.user.isMaster &&
        !req.user.profileTags.some(e => e === profile.tag)
      ) {
        throw new Error('Acesso negado!');
      }
      await prisma.userProfile.create({
        data: {
          userId: user.id,
          profileId,
        },
      });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({
      error: 'Erro no servidor',
    });
  }
};

export default store;
