import express from 'express';
import cors from 'cors';
import { validateToken } from './middleware/auth.js';
import { spellRouter } from './routes/spellRouter.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthRouter } from './routes/healthRouter.js';
import { metaRouter } from './routes/metaRouter.js';
import { characterRouter } from './routes/characterRouter.js';
import { slotRouter } from './routes/slotRouter.js';
import { sorceryPointsRouter } from './routes/sorceryPointsRouter.js';
import { metamagicRouter } from './routes/metamagicRouter.js';
import { invocationsRouter } from './routes/invocationsRouter.js';
import { resourcesRouter } from './routes/resourcesRouter.js';

export const createServer = () => {
  const app = express();

  app.use(cors({ origin: '*' }));
  app.use(express.json());
  app.use(requestLogger);

  app.use('/health', healthRouter());

  app.use('/api', validateToken);
  app.use('/api/meta', metaRouter());
  app.use('/api/spells', spellRouter());
  app.use('/api/characters', characterRouter());
  app.use('/api/slots', slotRouter());
  app.use('/api', sorceryPointsRouter());
  app.use('/api', metamagicRouter());
  app.use('/api', invocationsRouter());
  app.use('/api', resourcesRouter());

  app.use(errorHandler);

  return app;
};

const app = createServer();
export default app;
