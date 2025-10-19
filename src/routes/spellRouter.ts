import { Router } from 'express';
import { fetchAllSpells } from '../service/spellService.js';

export const spellRouter = () => {
  const router = Router();

  router.get('/', async (_req, res, next) => {
    try {
      const data = await fetchAllSpells();
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
