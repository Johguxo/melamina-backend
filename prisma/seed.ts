import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '../src/shared/utils/hash';
import { env } from '../src/shared/config/env';

const prisma = new PrismaClient();

const SUPER_ADMIN_EMAIL = 'superadmin@melaminapro.com';

const run = async (): Promise<void> => {
  const existing = await prisma.user.findUnique({ where: { email: SUPER_ADMIN_EMAIL } });
  if (existing) {
    console.info(`[seed] SUPER_ADMIN already exists (${SUPER_ADMIN_EMAIL}), skipping.`);
    return;
  }
  const password = await hashPassword(env.superAdminPassword);
  await prisma.user.create({
    data: {
      email: SUPER_ADMIN_EMAIL,
      password,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      tenantId: null,
    },
  });
  console.info(`[seed] Created SUPER_ADMIN (${SUPER_ADMIN_EMAIL}).`);
};

run()
  .catch((err) => {
    console.error('[seed] Failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
