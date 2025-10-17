import { Router } from 'express';
import { SpellFilterRequestSchema } from '../schemas/spellFilterRequest';
import { fetchSpellsFiltered } from '../service/spellFilterService';

export const spellFilterRouter = () => {
  const router = Router();

  router.post('/', async (req, res, next) => {
    try {
      const input = SpellFilterRequestSchema.parse(req.body);
      const data = await fetchSpellsFiltered(input);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
