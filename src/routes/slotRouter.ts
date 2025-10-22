import { Router, RequestHandler } from 'express';
import {
  getRemainingSlots,
  longRest,
  shortRest,
  toggleSlot,
} from '../service/slotService.js';

export const slotRouter = () => {
  const router = Router();

  const toggle: RequestHandler = async (req, res, next) => {
    try {
      const { id: characterId } = req.params;
      const { slotLevel, slotIndex, spellId, note } = req.body ?? {};
      if (!slotLevel || !slotIndex) {
        res
          .status(400)
          .json({ message: 'slotLevel and slotIndex are required' });
        return;
      }

      const result = await toggleSlot(req.headers.authorization, {
        characterId,
        slotLevel: Number(slotLevel),
        slotIndex: Number(slotIndex),
        spellId: spellId ?? null,
        note: note ?? null,
      });

      res.json(result);
    } catch (e) {
      next(e);
    }
  };

  router.post('/:id/slots/toggle', toggle);

  router.get('/:id/slots', async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await getRemainingSlots(req.headers.authorization, id);
      res.json(data);
    } catch (e) {
      next(e);
    }
  });

  router.post('/:id/rest/long', async (req, res, next) => {
    try {
      const { id } = req.params;
      await longRest(req.headers.authorization, id);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  router.post('/:id/rest/short', async (req, res, next) => {
    try {
      const { id } = req.params;
      await shortRest(req.headers.authorization, id);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  });

  return router;
};
