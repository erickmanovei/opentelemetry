import { Prisma } from '@prisma/client'

export const select = (params: Prisma.MiddlewareParams) => {
    if (params.args?.where?.deletedAt) {
        return
    }

    params.args = {
        ...(params.args ?? {}),
        where: {
            ...(params.args?.where ?? {}),
            deletedAt: null,
        },
    }
}
