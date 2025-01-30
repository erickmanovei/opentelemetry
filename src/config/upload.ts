import multer, { FileFilterCallback } from 'multer';
import crypto from 'crypto';
import path from 'path';
import { S3 } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { Request } from 'express';

const MAX_SIZE = 50 * 1024 * 1024; // 50mb

const s3Config = new S3({
  region: 'sa-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ID || '',
    secretAccessKey: process.env.AWS_KEY || '',
  },
});

const storageTypes = (
  bucket = process.env.BUCKET_NAME || 'nomedobucket',
): any => ({
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));

        const fileName = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, fileName);
      });
    },
  }),
  s3: multerS3({
    s3: s3Config,
    bucket,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const fileName = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, fileName);
      });
    },
  }),
});

export default ({
  storage = 's3',
  bucket = process.env.BUCKET_NAME || 'nomedobucket',
}): multer.Options => ({
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: storage === 's3' ? storageTypes(bucket).s3 : storageTypes().local,
  limits: {
    fileSize: MAX_SIZE,
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ): void => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'text/x-vcard',
      'text/vcard',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  },
});
