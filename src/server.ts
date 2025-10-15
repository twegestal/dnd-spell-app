import express from 'express';
import morgan from 'morgan';
import { exampleMiddleware } from './middleware/exampleMiddleware';
import { exampleRouter } from './routes/exampleRouter';

export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use(morgan('dev'));

  app.use(exampleMiddleware);
  app.use('/example', exampleRouter());

  return app;
};
