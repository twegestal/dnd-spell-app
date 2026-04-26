import { Router } from 'express';
import {
  fetchClasses,
  fetchRaces,
  fetchSchools,
  fetchDamageTypes,
  fetchSpellClasses,
} from '../service/metaService.js';

export const metaRouter = () => {
  const router = Router();

  router.get('/races', async (_req, res, next) => {
    try {
      const data = await fetchRaces();
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  });

  router.get('/classes', async (_req, res, next) => {
    try {
      const data = await fetchClasses();
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  });

  router.get('/schools', async (_req, res, next) => {
    try {
      const data = await fetchSchools();
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  });

  router.get('/damage-types', async (_req, res, next) => {
    try {
      const data = await fetchDamageTypes();
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  });

  router.get('/spell-classes', async (_req, res, next) => {
    try {
      const data = await fetchSpellClasses();
      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  });

  return router;
};
