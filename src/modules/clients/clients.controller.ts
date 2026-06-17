import type { Request, Response } from 'express';
import { success } from '../../shared/types/api-response';
import { AppError } from '../../shared/utils/app-error';
import {
  createClient,
  listClients,
  getClient,
  updateClient,
  softDeleteClient,
} from './clients.service';

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
  const client = await createClient(tenantId, req.body);
  res.status(201).json(success(client, 'Client created'));
};

export const list = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const clients = await listClients(tenantId);
  res.status(200).json(success(clients, 'Clients'));
};

export const detail = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const client = await getClient(requireId(req), tenantId);
  res.status(200).json(success(client, 'Client'));
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const client = await updateClient(requireId(req), tenantId, req.body);
  res.status(200).json(success(client, 'Client updated'));
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const tenantId = requireTenantId(req);
  const client = await softDeleteClient(requireId(req), tenantId);
  res.status(200).json(success(client, 'Client deleted'));
};
