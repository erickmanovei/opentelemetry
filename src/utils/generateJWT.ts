import crypto from 'crypto';

const toBase64 = (obj: object): string => {
  // converte o objeto em string
  const str = JSON.stringify(obj);
  // retorna string convertida em base64
  return Buffer.from(str).toString('base64');
};

const replaceSpecialChars = (b64string: string): string => {
  // cria um regex para substituir os characteres =, + e /
  return b64string.replace(/[=+/]/g, charToBeReplaced => {
    switch (charToBeReplaced) {
      case '=':
        return '';
      case '+':
        return '-';
      case '/':
        return '_';
      default:
        return charToBeReplaced;
    }
  });
};

const generateJWT = ({
  privateKey,
  publicKey,
  minutesToExpire = 2,
}: {
  privateKey: string;
  publicKey: string;
  minutesToExpire?: number;
}): string => {
  const headerObj = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const header = replaceSpecialChars(toBase64(headerObj));

  const payloadObj = {
    sub: publicKey,
    iat: Number(String(new Date().getTime()).slice(0, 10)),
    exp: Number(
      String(
        new Date().setMinutes(new Date().getMinutes() + minutesToExpire),
      ).slice(0, 10),
    ),
  };

  const payload = replaceSpecialChars(toBase64(payloadObj));

  let signature = crypto
    .createHmac('sha256', privateKey)
    .update(`${header}.${payload}`)
    .digest('base64');

  signature = replaceSpecialChars(signature);

  const token = `${header}.${payload}.${signature}`;

  return token;
};

export default generateJWT;
