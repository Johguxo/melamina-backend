import type { Request, Response } from 'express';
import { success } from '../../shared/types/api-response';
import { AppError } from '../../shared/utils/app-error';
import { registerUser, loginUser, getCurrentUser } from './auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  const result = await registerUser(req.body);
  res.status(201).json(success(result, 'Registered'));
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const result = await loginUser(req.body);
  res.status(200).json(success(result, 'Logged in'));
};

export const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new AppError('Authentication required', 401);
  const user = await getCurrentUser(req.user.userId);
  res.status(200).json(success(user, 'Current user'));
};
