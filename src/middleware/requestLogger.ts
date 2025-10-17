import { Request, Response, NextFunction } from 'express';
import { logger } from '../log';

export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  logger.info(`[${req.method}] ${req.url} - ${JSON.stringify(req.body)}`);
  next();
};
