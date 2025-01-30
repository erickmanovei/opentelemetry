import 'reflect-metadata';
import 'dotenv/config';
import prisma from './database/prismaClient';
import { processQueues } from './services/QueueService';
import { prismaMiddleware } from 'middlewares/prisma';

prismaMiddleware(prisma);

processQueues();
console.log('Queue em execução');
