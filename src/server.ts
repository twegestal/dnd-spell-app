import express from 'express';
import { validateToken } from './middleware/auth';
import { spellRouter } from './routes/spellRouter';
import { requestLogger } from './middleware/requestLogger';

export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);
  app.use('/spells', spellRouter());

  return app;
};
