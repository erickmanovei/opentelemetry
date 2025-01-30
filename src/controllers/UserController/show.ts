import { Request, Response } from 'express';
import prisma from '../../database/prismaClient';

const show = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        userProfiles: {
          include: {
            profile: true,
          }
        },
      }
    });

    return res.json({
      ...user,
      password: undefined,
    });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({
      error: 'Erro no servidor',
    });
  }
}

export default show;
