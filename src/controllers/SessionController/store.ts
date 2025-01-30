import { compare } from 'bcryptjs';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import prisma from '../../database/prismaClient';
import authConfig from 'config/auth';

const store = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('Dados inválidos');
    }

    const user = await prisma.user.findFirstOrThrow({
      where: { email },
      include: {
        userProfiles: {
          include: {
            profile: true,
          }
        },
      }
    });
    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      return res.status(401).json({
        error: 'Credenciais inválidas!',
      });
    }

    const { secret, expiresIn } = authConfig.jwt;

    if (!secret || !expiresIn) {
      throw new Error(
        'Necessário configurar a secret e o tempo de expiração',
      );
    }

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profiles: user.userProfiles.map(e => ({
          id: e.profile.id,
          name: e.profile.name,
          tag: e.profile.tag,
        })),
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: 'Credenciais inválidas!', host: req.hostname });
  }
}

export default store;
