import express from 'express';
import cors from 'cors';
import { validateToken } from './middleware/auth.js';
import { spellRouter } from './routes/spellRouter.js';
import { requestLogger } from './middleware/requestLogger.js';
import { spellFilterRouter } from './routes/spellFilterRouter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthRouter } from './routes/healthRouter.js';

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

const app = createServer();
export default app;
