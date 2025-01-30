import { Request, Response } from 'express';
import prisma from '../../database/prismaClient';

const destroy = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    await prisma.user.deleteMany({
      where: {
        id,
      },
    });

    return res.json();
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({
      error: 'Erro no servidor',
    });
  }
}

export default destroy;
