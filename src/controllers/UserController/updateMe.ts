import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../../database/prismaClient';

const updateMe = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.user;
  const { password } = req.body;
  try {
    const data = password
      ? {
          ...req.body,
          password: bcrypt.hashSync(password, 8),
        }
      : req.body;
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

export default updateMe;
