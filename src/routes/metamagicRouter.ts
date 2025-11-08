import { Router } from 'express';
import { listMetamagic, useMetamagic } from '../service/metamagicService.js';

type MetamagicParams = { id: string; optionIdx: string };
type MetamagicBody = { times?: number; spellId?: string };

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

  return router;
};
