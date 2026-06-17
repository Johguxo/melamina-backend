import jwt, { type SignOptions } from 'jsonwebtoken';
import { AccountType, UserRole } from '@prisma/client';
import { env } from '../config/env';
import { AppError } from './app-error';

export interface JwtPayload {
  userId: string;
  tenantId: string | null;
  role: UserRole;
  accountType: AccountType | null;
}

export const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as SignOptions);

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (typeof decoded === 'string') {
      throw new AppError('Invalid token payload', 401);
    }
    const { userId, tenantId, role, accountType } = decoded as Record<string, unknown>;
    if (typeof userId !== 'string' || typeof role !== 'string') {
      throw new AppError('Invalid token payload', 401);
    }
    return {
      userId,
      tenantId: typeof tenantId === 'string' ? tenantId : null,
      role: role as UserRole,
      accountType: typeof accountType === 'string' ? (accountType as AccountType) : null,
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Invalid or expired token', 401);
  }
};
