import type { RequestHandler } from 'express';
import { supabase } from '../database/index.js';
import { logger } from '../log/index.js';

export const validateToken: RequestHandler = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;

    if (!token) {
      logger.warn('Unauthorized request - Missing token');
      res.status(401).json({ message: 'Unauthorized - Missing token' });
      return;
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      logger.warn('Unauthorized request - Invalid token');
      res.status(401).json({ message: 'Unauthorized - Invalid token' });
      return;
    }

    req.user = data.user;
    logger.info(`Authenticated user: ${data.user.email ?? data.user.id}`);
    next();
  } catch (err) {
    logger.error(`Auth error: ${String(err)}`);
    res.status(500).json({ message: 'Internal authentication error' });
  }
};
