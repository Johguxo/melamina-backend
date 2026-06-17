import type { Client } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { prisma } from '../../shared/config/prisma';
import { AppError } from '../../shared/utils/app-error';
import type { CreateClientBody, UpdateClientBody } from './clients.schemas';

const handleUniqueViolation = (e: unknown): never => {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
    throw new AppError('A client with that document number already exists', 409);
  }
  throw e as Error;
};

export const createClient = async (
  tenantId: string,
  body: CreateClientBody,
): Promise<Client> => {
  try {
    return await prisma.client.create({ data: { ...body, tenantId } });
  } catch (e) {
    return handleUniqueViolation(e);
  }
};

export const listClients = (tenantId: string): Promise<Client[]> =>
  prisma.client.findMany({
    where: { tenantId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });

const assertClientInTenant = async (id: string, tenantId: string): Promise<void> => {
  const found = await prisma.client.findFirst({
    where: { id, tenantId, deletedAt: null },
    select: { id: true },
  });
  if (!found) throw new AppError('Client not found', 404);
};

export const getClient = async (id: string, tenantId: string): Promise<Client> => {
  const client = await prisma.client.findFirst({
    where: { id, tenantId, deletedAt: null },
  });
  if (!client) throw new AppError('Client not found', 404);
  return client;
};

export const updateClient = async (
  id: string,
  tenantId: string,
  body: UpdateClientBody,
): Promise<Client> => {
  await assertClientInTenant(id, tenantId);
  try {
    return await prisma.client.update({ where: { id }, data: body });
  } catch (e) {
    return handleUniqueViolation(e);
  }
};

export const softDeleteClient = async (id: string, tenantId: string): Promise<Client> => {
  await assertClientInTenant(id, tenantId);
  return prisma.client.update({ where: { id }, data: { deletedAt: new Date() } });
};
