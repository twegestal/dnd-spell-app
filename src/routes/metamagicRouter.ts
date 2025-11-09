import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import {
  addKnownMetamagic,
  deleteKnownMetamagic,
  listKnownMetamagic,
  listMetamagic,
  useMetamagic,
} from '../service/metamagicService.js';
import { logger } from '../log/index.js';
import { error } from 'console';

type MetamagicParams = { id: string; optionIdx: string };
type MetamagicBody = { times?: number; spellId?: string };

type CharParams = { id: string };
type AddBody = { optionIdx: string };

export const metamagicRouter = () => {
  const router = Router();

  router.get('/metamagic', async (req, res, next) => {
    try {
      const data = await listMetamagic(req.headers.authorization);
      res.json(data);
    } catch (err) {
      next(err as Error);
    }
  });

  router.post<MetamagicParams, any, MetamagicBody>(
    '/characters/:id/metamagic/:optionIdx/use',
    async (req, res, next) => {
      try {
        const characterId = req.params.id;
        const optionIdx = req.params.optionIdx;
        const times = Number(req.body?.times ?? 1);
        const spellId = req.body?.spellId as string | undefined;

        if (!Number.isInteger(times) || times <= 0) {
          res.status(400).json({ error: 'times must be a positive integer' });
          return;
        }

        const result = await useMetamagic(
          req.headers.authorization,
          characterId,
          optionIdx,
          times,
          spellId,
        );

        res.json(result);
      } catch (err) {
        next(err as Error);
      }
    },
  );

  router.get(
    '/characters/:id/metamagic-known',
    async (req: Request<CharParams>, res: Response, next: NextFunction) => {
      try {
        const data = await listKnownMetamagic(
          req.headers.authorization,
          req.params.id,
        );
        res.json(data);
      } catch (e) {
        next(e);
      }
    },
  );

  router.post<CharParams, any, AddBody>(
    '/characters/:id/metamagic-known',
    async (
      req: Request<CharParams, any, AddBody>,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        const optionIdx = req.body?.optionIdx;
        if (!optionIdx) {
          res.status(400).json({ error: 'optionIdx is required' });
          return;
        }

        const row = await addKnownMetamagic(
          req.headers.authorization,
          req.params.id,
          optionIdx,
        );

        res.status(201).json(row);
      } catch (e) {
        logger.error(`Error adding metamagic to character: ${error}`);
        next(e);
      }
    },
  );

  router.delete(
    '/characters/:id/metamagic-known/:optionIdx',
    async (
      req: Request<CharParams & { optionIdx: string }>,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        const { id, optionIdx } = req.params;
        await deleteKnownMetamagic(req.headers.authorization, id, optionIdx);
        res.status(204).send();
      } catch (e) {
        next(e);
      }
    },
  );

  return router;
};
