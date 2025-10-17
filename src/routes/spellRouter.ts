import { Router } from 'express';
import * as spellService from '../service/spellService';
import { SpellIndexParamSchema } from '../schemas';

export const spellRouter = () => {
  const router = Router();

  router.get('/', async (_req, res, next) => {
    try {
      const data = await spellService.fetchAllSpells();
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:index', async (req, res, next) => {
    try {
      const { index } = SpellIndexParamSchema.parse(req.params);
      const data = await spellService.fetchSpellByIndex(index);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
