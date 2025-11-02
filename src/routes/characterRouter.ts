import { RequestHandler, Router } from 'express';
import {
  createCharacterForUser,
  listCharactersByUser,
  updateCharacterLevel,
} from '../service/characterService.js';
import {
  AssignKnownSpellSchema,
  CharacterCreationSchema,
  CharacterLevelUpdateSchema,
} from '../types/character.js';
import {
  addKnownSpell,
  removeKnownSpell,
  listKnownSpells,
  listPreparedSpells,
  addPreparedSpell,
  removePreparedSpell,
} from '../service/characterSpellService.js';

export const characterRouter = () => {
  const router = Router();

  const list: RequestHandler = async (req, res, next) => {
    try {
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

  const listKnown: RequestHandler = async (req, res, next) => {
    try {
      const { id: characterId } = req.params;
      const results = await listKnownSpells(characterId);
      res.json({ results });
      return;
    } catch (e) {
      next(e);
    }
  };

  const listPrepared: RequestHandler = async (req, res, next) => {
    try {
      const { id: characterId } = req.params;
      const results = await listPreparedSpells(characterId);
      res.json({ results });
      return;
    } catch (e) {
      next(e);
    }
  };

  const addPrepared: RequestHandler = async (req, res, next) => {
    try {
      const { id: characterId } = req.params;
      const { spellId } = AssignKnownSpellSchema.parse(req.body);
      const created = await addPreparedSpell(characterId, spellId);
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

  const removePrepared: RequestHandler = async (req, res, next) => {
    try {
      const { id: characterId, spellId } = req.params;
      const result = await removePreparedSpell(characterId, spellId);
      res.json(result);
      return;
    } catch (e) {
      next(e);
    }
  };

  const patchLevel: RequestHandler = async (req, res, next) => {
    try {
      const { id: characterId } = req.params;
      const { level } = CharacterLevelUpdateSchema.parse(req.body);

      const updated = await updateCharacterLevel(
        characterId,
        req.user.id,
        level,
      );
      res.json(updated);
      return;
    } catch (e: any) {
      if (e?.name === 'ZodError') {
        res.status(400).json({ message: 'Invalid payload', issues: e.errors });
        return;
      }
      if (e?.statusCode) {
        res.status(e.statusCode).json({ message: e.message });
        return;
      }
      next(e);
    }
  };

  router.get('/', list);
  router.post('/', create);

  router.get('/:id/known-spells', listKnown);
  router.get('/:id/prepared-spells', listPrepared);

  router.post('/:id/known-spells', addKnown);
  router.delete('/:id/known-spells/:spellId', removeKnown);

  router.post('/:id/prepared-spells', addPrepared);
  router.delete('/:id/prepared-spells/:spellId', removePrepared);

  router.patch('/:id/level', patchLevel);

  return router;
};
