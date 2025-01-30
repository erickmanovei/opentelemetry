import { User } from '@prisma/client';
import AWS_SES, { SES } from '@aws-sdk/client-ses';
import sendEmail from 'services/sendEmail';

interface GenericUserInterface {
  email: string;
  name?: string;
}

interface SendMailParamsInterface {
  toUser: User | GenericUserInterface;
  subject: string;
  message: string;
}
export default {
  key: 'SendMail',
  handle: async ({
    toUser,
    subject,
    message,
  }: SendMailParamsInterface): Promise<void> => {
    try {
      if (!toUser.email) {
        throw new Error('Usuário sem e-mail cadastrado');
      }
      await sendEmail({
        email: toUser.email,
        subject,
        message,
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log('erro SendMail', err.message);
      }
      console.log('erro SendMail');
    }
  },
};
