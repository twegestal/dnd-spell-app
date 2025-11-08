import { Router } from 'express';
import {
  getSorceryPoints,
  spendSorceryPoints,
} from '../service/sorceryPointService.js';
import { logger } from '../log/index.js';

export const sorceryPointsRouter = () => {
  const router = Router();

  router.get('/characters/:id/sorcery-points', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const characterId = req.params.id;
      const result = await getSorceryPoints(authHeader, characterId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post('/characters/:id/sorcery-points/spend', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const characterId = req.params.id;
      const qty = Number(req.body?.qty);

      const result = await spendSorceryPoints(authHeader, characterId, qty);
      res.json(result);
    } catch (err: any) {
      logger.error(`Error updating sorcery points ${err}`);
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
