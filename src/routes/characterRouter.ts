import { RequestHandler, Router } from 'express';
import {
  createCharacterForUser,
  listCharactersByUser,
} from '../service/characterService.js';
import { CharacterCreationSchema } from '../types/character.js';
import { logger } from '../log/index.js';

export const characterRouter = () => {
  const router = Router();

  const list: RequestHandler = async (req, res, next) => {
    try {
      logger.info(`user id is: ${req.user.id}`);
      const results = await listCharactersByUser(req.user.id);
      res.json({ results });
      return;
    } catch (e) {
      next(e);
    }
  };

  const create: RequestHandler = async (req, res, next) => {
    try {
      logger.info(`user id is: ${req.user.id}`);
      const parsed = CharacterCreationSchema.parse(req.body);
      const created = await createCharacterForUser(req.user.id, parsed);
      res.status(201).json(created);
      return;
    } catch (e: any) {
      if (e?.name === 'ZodError') {
        res.status(400).json({ message: 'Invalid payload', issues: e.errors });
        return;
      }
      if (e?.message?.includes('already exists')) {
        res.status(409).json({ message: e.message });
        return;
      }
      next(e);
    }
  };

  router.get('/', list);
  router.post('/', create);
  return router;
};
