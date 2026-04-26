import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import {
  listInvocations,
  listKnownInvocations,
  addKnownInvocation,
  deleteKnownInvocation,
} from '../service/invocationsService.js';

type CharParams = { id: string };
type AddBody = { optionIdx: string };

export const invocationsRouter = () => {
  const router = Router();

  router.get('/invocations', async (req, res, next) => {
    try {
      const data = await listInvocations(req.headers.authorization);
      res.json(data);
    } catch (err) {
      next(err);
    }
  });

  router.get(
    '/characters/:id/invocations-known',
    async (req: Request<CharParams>, res: Response, next: NextFunction) => {
      try {
        const data = await listKnownInvocations(
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
    '/characters/:id/invocations-known',
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
        const row = await addKnownInvocation(
          req.headers.authorization,
          req.params.id,
          optionIdx,
        );
        res.status(201).json(row);
      } catch (e) {
        next(e);
      }
    },
  );

  router.delete(
    '/characters/:id/invocations-known/:optionIdx',
    async (
      req: Request<CharParams & { optionIdx: string }>,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        const { id, optionIdx } = req.params;
        await deleteKnownInvocation(req.headers.authorization, id, optionIdx);
        res.status(204).send();
      } catch (e) {
        next(e);
      }
    },
  );

  return router;
};
