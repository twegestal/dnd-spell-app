import { RequestHandler, Router } from 'express';
import {
  createCharacterForUser,
  listCharactersByUser,
} from '../service/characterService.js';
import {
  AssignKnownSpellSchema,
  CharacterCreationSchema,
} from '../types/character.js';
import { logger } from '../log/index.js';
import {
  addKnownSpell,
  removeKnownSpell,
} from '../service/characterSpellService.js';

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

  const addKnown: RequestHandler = async (req, res, next) => {
    try {
      const { id: characterId } = req.params;
      const { spellId } = AssignKnownSpellSchema.parse(req.body);

      const created = await addKnownSpell(characterId, spellId);
      res.status(201).json(created);
      return;
    } catch (e: any) {
      if (e?.name === 'ZodError') {
        res.status(400).json({ message: 'Invalid payload', issues: e.errors });
        return;
      }
      next(e);
    }
  };

  const removeKnown: RequestHandler = async (req, res, next) => {
    try {
      const { id: characterId, spellId } = req.params;

      const result = await removeKnownSpell(characterId, spellId);
      res.json(result);
      return;
    } catch (e) {
      next(e);
    }
  };

  router.get('/', list);
  router.post('/', create);
  router.post('/:id/known-spells', addKnown);
  router.delete('/:id/known-spells/:spellId', removeKnown);
  return router;
};
