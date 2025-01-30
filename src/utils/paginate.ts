import prisma from '../database/prismaClient';

interface PropsInterface {
  entity: any;
  page: number;
  perPage: number;
  keywords?: string[];
  search?: string[];
  order?: string;
  prismaOptions?: any;
}

interface ReturnInterface {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: any[],
}

const paginate = async ({
  entity,
  page = 1,
  perPage = 10,
  keywords,
  search,
  order,
  prismaOptions = {}
}: PropsInterface): Promise<ReturnInterface> => {

  const [orderBy, orderByType] = order ? order?.split(':') : [];
  const { where = {}, ...options } = prismaOptions;

  if (keywords?.length && search?.length) {
    Object.assign(where, ...keywords.map(key => ({
      OR: [
        ...search.map(value => ({
          [key]: { contains: value }
        })),
      ]
    })));
  }

  const [totalItems, items] = await prisma.$transaction([
    entity.count({
      where,
    }),
    entity.findMany({
      where,
      ...options,
      skip: (Number(page) - 1) * Number(perPage),
      take: Number(perPage),
      orderBy: orderBy && orderByType ? {
        [orderBy]: orderByType,
      } : undefined,
    }),
  ]);

  return {
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages: Math.ceil(totalItems / Number(perPage)),
    items,
  };
}

export default paginate;
