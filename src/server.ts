import express from 'express';
import { validateToken } from './middleware/auth';
import { exampleRouter } from './routes/exampleRouter';
import { requestLogger } from './middleware/requestLogger';

export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);
  app.use('/example', validateToken, exampleRouter());

  return app;
};
