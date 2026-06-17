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

export const createClientSchema = z.object({
  name: z.string().trim().min(1),
  documentType: documentTypeSchema,
  documentNumber: z.string().trim().toUpperCase().min(1),
  phone: optionalString,
  email: emailOrEmpty,
  address: optionalString,
  notes: optionalString,
});

export const updateClientSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    documentType: documentTypeSchema.optional(),
    documentNumber: z.string().trim().toUpperCase().min(1).optional(),
    phone: optionalString,
    email: emailOrEmpty,
    address: optionalString,
    notes: optionalString,
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'No fields to update' });

export type CreateClientBody = z.infer<typeof createClientSchema>;
export type UpdateClientBody = z.infer<typeof updateClientSchema>;
