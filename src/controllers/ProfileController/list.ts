import prisma from '../../database/prismaClient';
import { Request, Response } from 'express';
import paginate from 'utils/paginate';

const index = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { page = 1, perPage = 10, keywords, search, order } = req.query;

    const data = await paginate({
      entity: prisma.profile,
      page: Number(page),
      perPage: Number(perPage),
      keywords: keywords ? (keywords as Array<string>) : [],
      search: search ? (search as Array<string>) : [],
      order: order as string
    })

    return res.json(data);

  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({
      error: 'Erro no servidor',
    });
  }
}

export default index;
