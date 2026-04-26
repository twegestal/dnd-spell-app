import { Router } from 'express';
import {
  fetchAllSpells,
  fetchHomebrewSpells,
  createHomebrewSpell,
  updateHomebrewSpell,
  togglePublishSpell,
  deleteHomebrewSpell,
} from '../service/spellService.js';
import { CreateSpellSchema, UpdateSpellSchema } from '../types/spells.js';

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

  router.get('/homebrew', async (req, res, next) => {
    try {
      const data = await fetchHomebrewSpells(req.headers.authorization!);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  router.post('/homebrew', async (req, res, next) => {
    try {
      const userId = req.user.id;
      const input = CreateSpellSchema.parse(req.body);
      const data = await createHomebrewSpell(
        req.headers.authorization!,
        userId,
        input,
      );
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  });

  router.patch('/homebrew/:id', async (req, res, next) => {
    try {
      const input = UpdateSpellSchema.parse(req.body);
      const data = await updateHomebrewSpell(
        req.headers.authorization!,
        req.params.id,
        input,
      );
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  router.patch('/homebrew/:id/publish', async (req, res, next) => {
    try {
      const data = await togglePublishSpell(
        req.headers.authorization!,
        req.params.id,
      );
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  router.delete('/homebrew/:id', async (req, res, next) => {
    try {
      await deleteHomebrewSpell(req.headers.authorization!, req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
};
