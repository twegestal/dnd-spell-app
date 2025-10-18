import winston from 'winston';
import fs from 'fs';
import path from 'path';

const isVercel = !!process.env.VERCEL;
const isProd = process.env.NODE_ENV === 'production' || isVercel;

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

const transports: winston.transport[] = [
  new winston.transports.Console({ level: isProd ? 'info' : 'debug' }),
];

if (!isProd) {
  const logDir = path.resolve(process.cwd(), 'logs');
  fs.mkdirSync(logDir, { recursive: true });

  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
  );
}

export const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  format: logFormat,
  transports,
});
