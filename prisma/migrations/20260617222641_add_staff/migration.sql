-- CreateTable
CREATE TABLE "StaffRole" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "roleId" TEXT,
    "hireDate" TIMESTAMP(3),
    "hourlyRate" DECIMAL(10,2),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StaffRole_tenantId_deletedAt_idx" ON "StaffRole"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "StaffRole_tenantId_name_key" ON "StaffRole"("tenantId", "name");

-- CreateIndex
CREATE INDEX "Staff_tenantId_deletedAt_idx" ON "Staff"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_tenantId_documentNumber_key" ON "Staff"("tenantId", "documentNumber");

-- AddForeignKey
ALTER TABLE "StaffRole" ADD CONSTRAINT "StaffRole_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "StaffRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
