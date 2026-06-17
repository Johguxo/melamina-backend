import { Router } from 'express';
import { requireAuth } from '../../shared/middlewares/auth';
import { validateBody } from '../../shared/utils/validate';
import { asyncHandler } from '../../shared/utils/async-handler';
import {
  createStaffSchema,
  updateStaffSchema,
  createStaffRoleSchema,
  updateStaffRoleSchema,
} from './staff.schemas';
import {
  create,
  list,
  detail,
  update,
  remove,
  createRole,
  listRoles,
  updateRole,
  removeRole,
} from './staff.controller';

export const staffRouter: Router = Router();

staffRouter.use(requireAuth);

staffRouter.get('/roles', asyncHandler(listRoles));
staffRouter.post('/roles', validateBody(createStaffRoleSchema), asyncHandler(createRole));
staffRouter.patch('/roles/:id', validateBody(updateStaffRoleSchema), asyncHandler(updateRole));
staffRouter.delete('/roles/:id', asyncHandler(removeRole));

staffRouter.post('/', validateBody(createStaffSchema), asyncHandler(create));
staffRouter.get('/', asyncHandler(list));
staffRouter.get('/:id', asyncHandler(detail));
staffRouter.patch('/:id', validateBody(updateStaffSchema), asyncHandler(update));
staffRouter.delete('/:id', asyncHandler(remove));
