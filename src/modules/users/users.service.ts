import { AccountType, UserRole, type User } from '@prisma/client';
import { prisma } from '../../shared/config/prisma';
import { AppError } from '../../shared/utils/app-error';
import { hashPassword } from '../../shared/utils/hash';
import type { CreateUserBody, UpdateUserBody } from './users.schemas';

type PublicUser = Omit<User, 'password'>;

const publicSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  tenantId: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const createEmployee = async (
  tenantId: string,
  accountType: AccountType | null,
  body: CreateUserBody,
): Promise<PublicUser> => {
  if (accountType === AccountType.FREELANCER) {
    throw new AppError('Upgrade your account to add team members', 403);
  }
  const emailTaken = await prisma.user.findUnique({ where: { email: body.email } });
  if (emailTaken) {
    throw new AppError('Email already registered', 409);
  }
  const password = await hashPassword(body.password);
  return prisma.user.create({
    data: {
      email: body.email,
      password,
      firstName: body.firstName,
      lastName: body.lastName,
      role: UserRole.EMPLOYEE,
      tenantId,
    },
    select: publicSelect,
  });
};

export const listEmployees = (tenantId: string): Promise<PublicUser[]> =>
  prisma.user.findMany({
    where: { tenantId, role: UserRole.EMPLOYEE, deletedAt: null },
    select: publicSelect,
    orderBy: { createdAt: 'desc' },
  });

const assertEmployeeInTenant = async (id: string, tenantId: string): Promise<void> => {
  const found = await prisma.user.findFirst({
    where: { id, tenantId, role: UserRole.EMPLOYEE, deletedAt: null },
    select: { id: true },
  });
  if (!found) throw new AppError('Employee not found', 404);
};

export const updateEmployee = async (
  id: string,
  tenantId: string,
  body: UpdateUserBody,
): Promise<PublicUser> => {
  await assertEmployeeInTenant(id, tenantId);
  if (body.email) {
    const taken = await prisma.user.findFirst({
      where: { email: body.email, NOT: { id } },
      select: { id: true },
    });
    if (taken) throw new AppError('Email already registered', 409);
  }
  return prisma.user.update({ where: { id }, data: body, select: publicSelect });
};

export const softDeleteEmployee = async (id: string, tenantId: string): Promise<PublicUser> => {
  await assertEmployeeInTenant(id, tenantId);
  return prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
    select: publicSelect,
  });
};
