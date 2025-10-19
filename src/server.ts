import express from 'express';
import cors from 'cors';
import { validateToken } from './middleware/auth.js';
import { spellRouter } from './routes/spellRouter.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthRouter } from './routes/healthRouter.js';
import { metaRouter } from './routes/metaRouter.js';
import { characterRouter } from './routes/characterRouter.js';

export const createServer = () => {
  const app = express();

  app.use(cors({ origin: '*' }));
  app.use(express.json());
  app.use(requestLogger);
  app.use('/health', healthRouter());
  app.use('/api/meta', validateToken, metaRouter());
  app.use('/api/spells', validateToken, spellRouter());
  app.use('/api/characters', validateToken, characterRouter());
  app.use(errorHandler);

  return app;
};

const app = createServer();
export default app;
