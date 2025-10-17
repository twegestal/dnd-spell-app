import { Request, Response, NextFunction } from 'express';
import { logger } from '../log';
import { ErrorResponse } from '../types';

interface ErrorProps extends Error {
  status?: number;
}

export const errorHandler = (
  err: ErrorProps,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(`[${err.status || 500}] ${err.message}`);

  const response: ErrorResponse = {
    message: err.message || 'Internal server Error',
  };

  res.status(err.status || 500);

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.json(response);
};
