import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/app-error';

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401);
  }
  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    throw new AppError('Authentication required', 401);
  }
  req.user = verifyToken(token);
  next();
};
