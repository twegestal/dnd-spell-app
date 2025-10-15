import { type Request, type Response, type NextFunction } from 'express';

export const exampleMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  console.log('Example middleware has been called');
  next();
};
