import { z } from 'zod';
import { DocumentType } from '@prisma/client';

const documentTypeSchema = z.nativeEnum(DocumentType);

const emailOrEmpty = z
  .union([z.string().trim().toLowerCase().email(), z.literal('')])
  .optional()
  .transform((v) => (v === '' ? null : v));

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v === '' ? null : v));

const optionalDate = z
  .union([z.string().datetime({ offset: true }), z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal('')])
  .optional()
  .transform((v) => (v === '' || v === undefined ? null : new Date(v)));

const optionalDecimal = z
  .union([z.number(), z.string().regex(/^\d+(\.\d+)?$/), z.literal('')])
  .optional()
  .transform((v) => (v === '' || v === undefined ? null : Number(v)));

export const createStaffSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  documentType: documentTypeSchema,
  documentNumber: z.string().trim().toUpperCase().min(1),
  phone: optionalString,
  email: emailOrEmpty,
  roleId: optionalString,
  hireDate: optionalDate,
  hourlyRate: optionalDecimal,
  active: z.boolean().optional(),
  notes: optionalString,
});

export const updateStaffSchema = z
  .object({
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
    documentType: documentTypeSchema.optional(),
    documentNumber: z.string().trim().toUpperCase().min(1).optional(),
    phone: optionalString,
    email: emailOrEmpty,
    roleId: optionalString,
    hireDate: optionalDate,
    hourlyRate: optionalDecimal,
    active: z.boolean().optional(),
    notes: optionalString,
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'No fields to update' });

export const createStaffRoleSchema = z.object({
  name: z.string().trim().min(1),
  description: optionalString,
});

export const updateStaffRoleSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    description: optionalString,
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'No fields to update' });

export type CreateStaffBody = z.infer<typeof createStaffSchema>;
export type UpdateStaffBody = z.infer<typeof updateStaffSchema>;
export type CreateStaffRoleBody = z.infer<typeof createStaffRoleSchema>;
export type UpdateStaffRoleBody = z.infer<typeof updateStaffRoleSchema>;
