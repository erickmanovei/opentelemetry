import { Prisma } from '@prisma/client';
import prisma from '../../database/prismaClient';
import { Request, Response } from 'express';
import paginate from 'utils/paginate';
import { counterMetric } from 'otel/metrics';

const index = async (req: Request, res: Response): Promise<Response> => {
  try {
    counterMetric('list_users').add(1, { route: req.path });

    console.log('Métrica incrementada');

    const { page = 1, perPage = 10, keywords, search, order } = req.query;

    const prismaOptions: Prisma.UserFindManyArgs = {
      where: {

      },
      include: {
        userProfiles: {
          include: {
            profile: true,
          }
        }
      }
    }

    const data = await paginate({
      entity: prisma.user,
      page: Number(page),
      perPage: Number(perPage),
      keywords: keywords ? (keywords as Array<string>) : [],
      search: search ? (search as Array<string>) : [],
      prismaOptions,
      order: order as string,
    })

    data.items = data.items.map(e => ({
      ...e,
      password: undefined,
    }));

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
