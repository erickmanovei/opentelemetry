import AWS_SES, { SES } from '@aws-sdk/client-ses';

interface PropsInterface {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async ({
  email,
  subject,
  message,
}: PropsInterface): Promise<void> => {
  const ses = new SES({
    region: process.env.AWS_REGION ?? '',
    credentials: {
      accessKeyId: process.env.AWS_ID ?? '',
      secretAccessKey: process.env.AWS_KEY ?? '',

    }
  });

  const from = 'Nome Empresa <noreply@nomeempresa.com.br>';

  const params: AWS_SES.SendEmailCommandInput = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: message,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: from,
  };

  await ses.sendEmail(params);
}

export default sendEmail;
