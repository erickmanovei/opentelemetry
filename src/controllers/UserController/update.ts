import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../../database/prismaClient';

const update = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { password, profileId, ...rest } = req.body;
  try {
    if (!req.params.isMaster) {
      return res.status(401).json({ error: 'Não permitido' });
    }
    const data = password
      ? {
          ...rest,
          password: bcrypt.hashSync(password, 8),
        }
      : {
          ...rest
        };
    const user = await prisma.user.updateMany({
      where: {
        id,
        deletedAt: null,
      },
      data,
    });

    return res.json(user);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({
      error: 'Erro no servidor',
    });
  }
}

export default update;
