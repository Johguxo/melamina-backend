import { Router } from 'express';
import { requireAuth } from '../../shared/middlewares/auth';
import { validateBody } from '../../shared/utils/validate';
import { asyncHandler } from '../../shared/utils/async-handler';
import { createClientSchema, updateClientSchema } from './clients.schemas';
import { create, list, detail, update, remove } from './clients.controller';

export const clientsRouter: Router = Router();

clientsRouter.use(requireAuth);

clientsRouter.post('/', validateBody(createClientSchema), asyncHandler(create));
clientsRouter.get('/', asyncHandler(list));
clientsRouter.get('/:id', asyncHandler(detail));
clientsRouter.patch('/:id', validateBody(updateClientSchema), asyncHandler(update));
clientsRouter.delete('/:id', asyncHandler(remove));
