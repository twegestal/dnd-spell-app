import { Router } from 'express';
import { fetchClasses, fetchRaces } from '../service/metaService.js';

export const metaRouter = () => {
  const router = Router();

  router.get('/races', async (req, res, next) => {
    try {
      const data = await fetchRaces();
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  });

  router.get('/classes', async (req, res, next) => {
    try {
      const data = await fetchClasses();
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  });

  return router;
};
