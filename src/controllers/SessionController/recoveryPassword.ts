import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../../database/prismaClient';
import { add } from 'services/QueueService';

const recoveryPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error('Necessário enviar o e-mail');
    }

    const user = await prisma.user.findFirstOrThrow({
      where: { email },
    });

    const recoveryCode = crypto.randomBytes(3).toString('hex');

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        recoveryCode,
        recoveryDate: new Date(),
      }
    });

    add('SendMail', {
      toUser: user,
      subject: 'Recuperação de Senha',
      message: `Olá ${user.name},
      <br /><br />
      Seu código de recuperação é o: ${recoveryCode}
      <br /><br />
      Atenciosamente,
      <br /><br />
      Assinatura`,
    }, {});

    return res.json({
      message: 'Um código de recuperação foi enviado para seu e-mail',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Ocorreu um erro!' });
  }
}

export default recoveryPassword;
