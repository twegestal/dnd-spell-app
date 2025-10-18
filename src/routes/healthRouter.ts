import { Router } from 'express';

export const healthRouter = () => {
  const router = Router();

  router.get('/', async (req, res, next) => {
    res.status(200).json('Hello, World!');
  });

  return router;
};
