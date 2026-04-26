import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import {
  listResources,
  setResource,
  spendResource,
  restoreResource,
} from '../service/resourcesService.js';

type CharParams = { id: string };

export const resourcesRouter = () => {
  const router = Router();

  router.get(
    '/characters/:id/resources',
    async (req: Request<CharParams>, res: Response, next: NextFunction) => {
      try {
        const data = await listResources(
          req.headers.authorization,
          req.params.id,
        );
        res.json(data);
      } catch (e) {
        next(e);
      }
    },
  );

  router.put(
    '/characters/:id/resources/:key',
    async (
      req: Request<CharParams & { key: string }>,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        const { id, key } = req.params;
        const { maximum, resets_on } = req.body;

        if (typeof maximum !== 'number') {
          res
            .status(400)
            .json({ error: 'maximum is required and must be a number' });
          return;
        }

        const data = await setResource(
          req.headers.authorization,
          id,
          key,
          maximum,
          resets_on ?? 'long',
        );
        res.json(data);
      } catch (e) {
        next(e);
      }
    },
  );

  router.post(
    '/characters/:id/resources/:key/spend',
    async (
      req: Request<CharParams & { key: string }>,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        const { id, key } = req.params;
        const qty = Number(req.body?.qty ?? 1);

        if (!Number.isInteger(qty) || qty <= 0) {
          res.status(400).json({ error: 'qty must be a positive integer' });
          return;
        }

        const data = await spendResource(
          req.headers.authorization,
          id,
          key,
          qty,
        );
        res.json(data);
      } catch (e) {
        next(e);
      }
    },
  );

  router.post(
    '/characters/:id/resources/:key/restore',
    async (
      req: Request<CharParams & { key: string }>,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        const { id, key } = req.params;
        const qty = req.body?.qty != null ? Number(req.body.qty) : undefined;

        const data = await restoreResource(
          req.headers.authorization,
          id,
          key,
          qty,
        );
        res.json(data);
      } catch (e) {
        next(e);
      }
    },
  );

  return router;
};
