import type { Request, Response } from 'express';
import { success } from '../../shared/types/api-response';
import { AppError } from '../../shared/utils/app-error';
import {
  createEmployee,
  listEmployees,
  updateEmployee,
  softDeleteEmployee,
} from './users.service';

const requireTenantId = (req: Request): string => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new AppError('Tenant context required', 403);
  return tenantId;
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const user = await createEmployee(tenantId, req.user?.accountType ?? null, req.body);
  res.status(201).json(success(user, 'Employee created'));
};

export const list = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const users = await listEmployees(tenantId);
  res.status(200).json(success(users, 'Employees'));
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const id = req.params['id'];
  if (!id) throw new AppError('id is required', 400);
  const user = await updateEmployee(id, tenantId, req.body);
  res.status(200).json(success(user, 'Employee updated'));
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const id = req.params['id'];
  if (!id) throw new AppError('id is required', 400);
  const user = await softDeleteEmployee(id, tenantId);
  res.status(200).json(success(user, 'Employee deleted'));
};
