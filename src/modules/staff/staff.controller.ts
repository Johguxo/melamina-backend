import type { Request, Response } from 'express';
import { success } from '../../shared/types/api-response';
import { AppError } from '../../shared/utils/app-error';
import {
  createStaff,
  listStaff,
  getStaff,
  updateStaff,
  softDeleteStaff,
  createStaffRole,
  listStaffRoles,
  updateStaffRole,
  softDeleteStaffRole,
} from './staff.service';

const requireTenantId = (req: Request): string => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new AppError('Tenant context required', 403);
  return tenantId;
};

const requireId = (req: Request): string => {
  const id = req.params['id'];
  if (!id) throw new AppError('id is required', 400);
  return id;
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const staff = await createStaff(tenantId, req.body);
  res.status(201).json(success(staff, 'Staff created'));
};

export const list = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const staff = await listStaff(tenantId);
  res.status(200).json(success(staff, 'Staff'));
};

export const detail = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const staff = await getStaff(requireId(req), tenantId);
  res.status(200).json(success(staff, 'Staff'));
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const staff = await updateStaff(requireId(req), tenantId, req.body);
  res.status(200).json(success(staff, 'Staff updated'));
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const staff = await softDeleteStaff(requireId(req), tenantId);
  res.status(200).json(success(staff, 'Staff deleted'));
};

export const createRole = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const role = await createStaffRole(tenantId, req.body);
  res.status(201).json(success(role, 'Role created'));
};

export const listRoles = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const roles = await listStaffRoles(tenantId);
  res.status(200).json(success(roles, 'Roles'));
};

export const updateRole = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const role = await updateStaffRole(requireId(req), tenantId, req.body);
  res.status(200).json(success(role, 'Role updated'));
};

export const removeRole = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const role = await softDeleteStaffRole(requireId(req), tenantId);
  res.status(200).json(success(role, 'Role deleted'));
};
