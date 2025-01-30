import 'reflect-metadata';
import 'dotenv/config';

import express, { NextFunction, Request, Response } from 'express';
import prisma from './database/prismaClient';
import cors from 'cors';
import 'express-async-errors';

import routes from './routes';
import AppError from './errors/AppError';
import { prismaMiddleware } from 'middlewares/prisma';
import schedules from 'jobs/schedules';

prismaMiddleware(prisma);

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.error,
    });
  }
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({
    error: 'Erro interno de servidor',
  });
});

schedules();

export default app;
