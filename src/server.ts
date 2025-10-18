import express from 'express';
import cors from 'cors';
import { validateToken } from './middleware/auth';
import { spellRouter } from './routes/spellRouter';
import { requestLogger } from './middleware/requestLogger';
import { spellFilterRouter } from './routes/spellFilterRouter';
import { errorHandler } from './middleware/errorHandler';
import { healthRouter } from './routes/healthRouter';

export const createServer = () => {
  const app = express();

  app.use(cors({ origin: '*' }));
  app.use(express.json());
  app.use(requestLogger);
  app.use('/health', healthRouter());
  app.use('/spells', validateToken, spellRouter());
  app.use('/spells/filter', validateToken, spellFilterRouter());
  app.use(errorHandler);

  return app;
};
