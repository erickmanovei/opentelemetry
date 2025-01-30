import { Request, Response } from 'express';
import prisma from '../../database/prismaClient';

 const emailExists = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      return res.json({
        exists: true,
      });
    }

    return res.json({
      exists: false,
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

export default emailExists;
