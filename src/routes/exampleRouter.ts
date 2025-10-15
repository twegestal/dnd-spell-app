import { Router } from 'express';
import { sayHello } from '../controllers/exampleController';

export const exampleRouter = () => {
  const router = Router();

  router.get('/', (_req, res, _next) => {
    const response = sayHello();
    res.status(200).json({ response: response });
  });

  return router;
};
