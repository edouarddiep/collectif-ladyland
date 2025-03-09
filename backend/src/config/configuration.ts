import * as dotenv from 'dotenv';
import { join } from 'path';
import * as process from 'process';

dotenv.config({
  path: join(__dirname, '../../.env')
});


export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  host: process.env.HOST || 'localhost',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secretKey',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  database: {
    url: process.env.DATABASE_URL
  },
  upload: {
    dest: process.env.UPLOAD_DEST || './uploads',
  },
});
