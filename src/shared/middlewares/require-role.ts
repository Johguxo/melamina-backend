import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserRole } from '@prisma/client';
import { AppError } from '../utils/app-error';

export const requireRole =
  (...roles: UserRole[]): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError('Forbidden', 403);
    }
    next();
  };
