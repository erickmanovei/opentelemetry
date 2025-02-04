import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import prisma from '../database/prismaClient';
import AppError from '../errors/AppError';
import authConfig from '../config/auth';
import { counterMetric } from 'otel/metrics';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

const ensureAuthenticated = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Acesso negado.', 401);
  }

  const [, token] = authHeader.split(' ');
  try {
    if (!authConfig.jwt.secret) {
      throw new AppError('Acesso negado.', 401);
    }
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: sub,
      },
      include: {
        userProfiles: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!user) {
      throw new AppError('Acesso negado.', 401);
    }
    const profileTags = user.userProfiles.map(e => e.profile.tag);
    request.user = {
      id: user.id,
      name: user.name,
      email: user.email || '',
      profileTags,
      isMaster: profileTags.some(e => e === 'master'),
    };

    return next();
  } catch {
    counterMetric('access_denied').add(1);
    throw new AppError('Acesso negado.', 401);
  }
}

export default ensureAuthenticated;
