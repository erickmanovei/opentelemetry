import { Prisma, PrismaClient } from '@prisma/client'
import { deleted } from './deleted'
import { select } from './select'

export const prismaMiddleware = (
    prisma: PrismaClient<
        Prisma.PrismaClientOptions,
        never,
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
) => {
    prisma.$use(async (params, next) => {
        const { action = '' } = params
        if (action.startsWith('find') || action === 'count') {
            select(params)
        } else if (action.startsWith('delete')) {
            deleted(params)
        } else {
            console.log(params)
        }
        return next(params)
    })
}
