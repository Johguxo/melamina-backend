import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { requireAuth } from '../../shared/middlewares/auth';
import { requireRole } from '../../shared/middlewares/require-role';
import { validateBody } from '../../shared/utils/validate';
import { asyncHandler } from '../../shared/utils/async-handler';
import { createUserSchema, updateUserSchema } from './users.schemas';
import { create, list, update, remove } from './users.controller';

export const usersRouter: Router = Router();

usersRouter.use(requireAuth, requireRole(UserRole.ADMIN));

usersRouter.post('/', validateBody(createUserSchema), asyncHandler(create));
usersRouter.get('/', asyncHandler(list));
usersRouter.patch('/:id', validateBody(updateUserSchema), asyncHandler(update));
usersRouter.delete('/:id', asyncHandler(remove));
