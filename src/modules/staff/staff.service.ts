import type { Staff, StaffRole } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { prisma } from '../../shared/config/prisma';
import { AppError } from '../../shared/utils/app-error';
import type {
  CreateStaffBody,
  UpdateStaffBody,
  CreateStaffRoleBody,
  UpdateStaffRoleBody,
} from './staff.schemas';

const handleStaffUniqueViolation = (e: unknown): never => {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
    throw new AppError('A staff member with that document number already exists', 409);
  }
  throw e as Error;
};

const handleRoleUniqueViolation = (e: unknown): never => {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
    throw new AppError('A role with that name already exists', 409);
  }
  throw e as Error;
};

const assertRoleInTenant = async (roleId: string, tenantId: string): Promise<void> => {
  const role = await prisma.staffRole.findFirst({
    where: { id: roleId, tenantId, deletedAt: null },
    select: { id: true },
  });
  if (!role) throw new AppError('Role not found', 404);
};

export const createStaff = async (
  tenantId: string,
  body: CreateStaffBody,
): Promise<Staff> => {
  if (body.roleId) await assertRoleInTenant(body.roleId, tenantId);
  try {
    return await prisma.staff.create({ data: { ...body, tenantId } });
  } catch (e) {
    return handleStaffUniqueViolation(e);
  }
};

export const listStaff = (tenantId: string): Promise<Staff[]> =>
  prisma.staff.findMany({
    where: { tenantId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: { role: true },
  });

const assertStaffInTenant = async (id: string, tenantId: string): Promise<void> => {
  const found = await prisma.staff.findFirst({
    where: { id, tenantId, deletedAt: null },
    select: { id: true },
  });
  if (!found) throw new AppError('Staff not found', 404);
};

export const getStaff = async (id: string, tenantId: string): Promise<Staff> => {
  const staff = await prisma.staff.findFirst({
    where: { id, tenantId, deletedAt: null },
    include: { role: true },
  });
  if (!staff) throw new AppError('Staff not found', 404);
  return staff;
};

export const updateStaff = async (
  id: string,
  tenantId: string,
  body: UpdateStaffBody,
): Promise<Staff> => {
  await assertStaffInTenant(id, tenantId);
  if (body.roleId) await assertRoleInTenant(body.roleId, tenantId);
  try {
    return await prisma.staff.update({ where: { id }, data: body });
  } catch (e) {
    return handleStaffUniqueViolation(e);
  }
};

export const softDeleteStaff = async (id: string, tenantId: string): Promise<Staff> => {
  await assertStaffInTenant(id, tenantId);
  return prisma.staff.update({ where: { id }, data: { deletedAt: new Date() } });
};

export const createStaffRole = async (
  tenantId: string,
  body: CreateStaffRoleBody,
): Promise<StaffRole> => {
  try {
    return await prisma.staffRole.create({ data: { ...body, tenantId } });
  } catch (e) {
    return handleRoleUniqueViolation(e);
  }
};

export const listStaffRoles = (tenantId: string): Promise<StaffRole[]> =>
  prisma.staffRole.findMany({
    where: { tenantId, deletedAt: null },
    orderBy: { name: 'asc' },
  });

const assertRoleExists = async (id: string, tenantId: string): Promise<void> => {
  const found = await prisma.staffRole.findFirst({
    where: { id, tenantId, deletedAt: null },
    select: { id: true },
  });
  if (!found) throw new AppError('Role not found', 404);
};

export const updateStaffRole = async (
  id: string,
  tenantId: string,
  body: UpdateStaffRoleBody,
): Promise<StaffRole> => {
  await assertRoleExists(id, tenantId);
  try {
    return await prisma.staffRole.update({ where: { id }, data: body });
  } catch (e) {
    return handleRoleUniqueViolation(e);
  }
};

export const softDeleteStaffRole = async (
  id: string,
  tenantId: string,
): Promise<StaffRole> => {
  await assertRoleExists(id, tenantId);
  const inUse = await prisma.staff.count({
    where: { roleId: id, tenantId, deletedAt: null },
  });
  if (inUse > 0) {
    throw new AppError('Role is assigned to staff members and cannot be deleted', 409);
  }
  return prisma.staffRole.update({ where: { id }, data: { deletedAt: new Date() } });
};
