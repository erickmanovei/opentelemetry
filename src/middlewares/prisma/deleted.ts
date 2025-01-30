import { Prisma } from '@prisma/client';

export const deleted = (params: Prisma.MiddlewareParams) => {
  params.action = params.action === 'deleteMany' ? 'updateMany' : 'update';
  const { where = {}, data = {}, ...others } = params.args ?? {};
  if (!where.deletedAt) {
    where.deletedAt = null;
  }

  if (!data.deletedAt) {
    data.deletedAt = new Date();
  }
  params.args = {
    ...others,
    where,
    data,
  };
};
