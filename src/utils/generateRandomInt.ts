import crypto from 'crypto';

const generateRandomInt = () => {
  const randomBytes = crypto.randomBytes(5);
  const randomInt = parseInt(randomBytes.toString('hex'), 16) % 9000000000 + 1000000000;
  return randomInt;
}

export default generateRandomInt;
