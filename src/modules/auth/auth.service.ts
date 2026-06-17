import { UserRole, type AccountType, type User } from '@prisma/client';
import { prisma } from '../../shared/config/prisma';
import { AppError } from '../../shared/utils/app-error';
import { hashPassword, comparePassword } from '../../shared/utils/hash';
import { signToken } from '../../shared/utils/jwt';
import type { RegisterBody, LoginBody } from './auth.schemas';

type PublicUser = Omit<User, 'password'>;

const toPublicUser = (user: User): PublicUser => {
  const { password: _password, ...rest } = user;
  return rest;
};

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 40) || 'tenant';

const uniqueSlug = async (base: string): Promise<string> => {
  const slug = slugify(base);
  const existing = await prisma.tenant.findUnique({ where: { slug } });
  if (!existing) return slug;
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${slug}-${suffix}`;
};

export const registerUser = async (
  body: RegisterBody,
): Promise<{ token: string; user: PublicUser; accountType: AccountType | null }> => {
  const emailTaken = await prisma.user.findUnique({ where: { email: body.email } });
  if (emailTaken) {
    throw new AppError('Email already registered', 409);
  }

  const slug = await uniqueSlug(body.companyName);
  const passwordHash = await hashPassword(body.password);

  const { tenant, user } = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name: body.companyName,
        slug,
        accountType: body.accountType,
      },
    });
    const user = await tx.user.create({
      data: {
        email: body.email,
        password: passwordHash,
        firstName: body.firstName,
        lastName: body.lastName,
        role: UserRole.ADMIN,
        tenantId: tenant.id,
      },
    });
    return { tenant, user };
  });

  const token = signToken({
    userId: user.id,
    tenantId: tenant.id,
    role: user.role,
    accountType: tenant.accountType,
  });

  return { token, user: toPublicUser(user), accountType: tenant.accountType };
};

export const loginUser = async (
  body: LoginBody,
): Promise<{ token: string; user: PublicUser; accountType: AccountType | null }> => {
  const user = await prisma.user.findUnique({
    where: { email: body.email },
    include: { tenant: true },
  });
  if (!user || user.deletedAt) {
    throw new AppError('Invalid credentials', 401);
  }
  const ok = await comparePassword(body.password, user.password);
  if (!ok) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = signToken({
    userId: user.id,
    tenantId: user.tenantId,
    role: user.role,
    accountType: user.tenant?.accountType ?? null,
  });

  return { token, user: toPublicUser(user), accountType: user.tenant?.accountType ?? null };
};

export const getCurrentUser = async (userId: string): Promise<PublicUser> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      tenantId: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user || user.deletedAt) {
    throw new AppError('User not found', 404);
  }
  return user as PublicUser;
};
