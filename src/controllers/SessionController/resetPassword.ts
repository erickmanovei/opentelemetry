import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../../database/prismaClient';
import { add } from 'services/QueueService';
import { differenceInMinutes, format } from 'date-fns';

const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, recoveryCode, password } = req.body;
    if (!email || !recoveryCode || !password) {
      throw new Error('Necessário enviar email, recoveryCode, password');
    }

    const user = await prisma.user.findFirstOrThrow({
      where: { email, recoveryCode },
    });

    if (!user.recoveryDate || !user.recoveryCode) {
      return res.status(401).json({ error: 'Ocorreu um erro!' });
    }

    const diff = differenceInMinutes(new Date(), new Date(user.recoveryDate));

    if (diff > 5) {
      return res.status(401).json({ error: 'Este código expirou!' });
    }

    const date = format(new Date(), 'dd/MM/yyyy HH:mm');

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: bcrypt.hashSync(password, 8),
      }
    });

    add('SendMail', {
      toUser: user,
      subject: 'Sua Senha foi Alterada',
      message: `Olá ${user.name},
      <br /><br />
      Sua senha foi alterada com sucesso no dia ${date}.
      Caso não tenha sido alterada por você, entre em contato com nossa equipe.
      <br /><br />
      Atenciosamente,
      <br /><br />
      Assinatura`,
    }, {});

    return res.json({
      message: 'Um código de recuperação foi enviado para seu e-mail',
    });
  } catch (error) {
    return res.status(401).json({ error: 'Ocorreu um erro!' });
  }
}

export default resetPassword;
