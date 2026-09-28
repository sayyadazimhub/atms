import { z } from 'zod';
import {
  emailSchema,
  nonEmptyString,
  nonNegativeNumber,
  objectIdSchema,
  positiveNumber,
} from './common.js';

export const productCreateSchema = z.object({
  name: nonEmptyString(100),
  unit: nonEmptyString(30),
  baseCostPrice: nonNegativeNumber,
});

export const productUpdateSchema = z
  .object({
    name: nonEmptyString(100).optional(),
    unit: nonEmptyString(30).optional(),
    baseCostPrice: nonNegativeNumber.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, 'At least one field is required');

export const customerSchema = z.object({
  name: nonEmptyString(100),
  phone: z.string().trim().max(30).optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
});

export const customerUpdateSchema = customerSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'At least one field is required');

export const providerSchema = z.object({
  name: nonEmptyString(100),
  phone: z.string().trim().max(30).optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
});

export const providerUpdateSchema = providerSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'At least one field is required');

const purchaseItemSchema = z.object({
  productId: objectIdSchema,
  quantity: positiveNumber,
  unitPrice: nonNegativeNumber,
});

export const purchaseSchema = z.object({
  providerId: objectIdSchema,
  items: z.array(purchaseItemSchema).min(1).max(100),
  paidAmount: nonNegativeNumber.optional(),
});

const saleItemSchema = z.object({
  productId: objectIdSchema,
  batchId: objectIdSchema.optional(),
  quantity: positiveNumber,
  costPrice: nonNegativeNumber.optional(),
  salePrice: nonNegativeNumber,
});

export const saleSchema = z.object({
  customerId: objectIdSchema,
  items: z.array(saleItemSchema).min(1).max(100),
  paidAmount: nonNegativeNumber.optional(),
});

export const paymentSchema = z.object({ paidAmount: nonNegativeNumber });

export const userProfileSchema = z.object({
  name: nonEmptyString(100),
  phone: z.string().trim().max(30).optional().nullable(),
});

export const adminProfileSchema = z
  .object({
    name: nonEmptyString(100).optional(),
    phone: z.string().trim().max(30).optional().nullable(),
    email: emailSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, 'At least one field is required');

export const adminCreateSchema = z.object({
  name: nonEmptyString(100),
  email: emailSchema,
  password: z.string().min(1).max(128),
  phone: z.string().trim().max(30).optional().nullable(),
});

export const adminUpdateSchema = z
  .object({
    id: objectIdSchema,
    name: nonEmptyString(100).optional(),
    phone: z.string().trim().max(30).optional().nullable(),
    is_active: z.boolean().optional(),
  })
  .refine(
    ({ id, ...data }) => Object.keys(data).length > 0,
    'At least one admin field must be updated',
  );

export const traderUpdateSchema = z.union([
  z.object({ id: objectIdSchema, status: z.enum(['active', 'suspended']) }),
  z
    .object({
      id: objectIdSchema,
      name: nonEmptyString(100).optional(),
      phone: z.string().trim().max(30).optional().nullable(),
    })
    .refine((data) => data.name !== undefined || data.phone !== undefined),
]);

export const traderVerificationSchema = z
  .object({
    id: objectIdSchema,
    status: z.enum(['APPROVED', 'REJECTED']),
    reason: z.string().trim().max(1000).optional(),
  })
  .refine((data) => data.status !== 'REJECTED' || Boolean(data.reason), {
    path: ['reason'],
    message: 'Rejection reason is required',
  });

export const traderRegistrationFieldsSchema = z.object({
  name: nonEmptyString(100),
  email: emailSchema,
  password: z.string().min(1).max(128),
  phone: z.string().trim().max(30).optional(),
  state: nonEmptyString(100),
  district: nonEmptyString(100),
});

export const verificationUploadFieldsSchema = z.object({
  state: nonEmptyString(100),
  district: nonEmptyString(100),
});

export const systemSettingsSchema = z
  .object({
    maintenanceMode: z.boolean(),
    traderSelfRegistration: z.boolean(),
    notifyOnNewTrader: z.boolean(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'At least one setting is required');

export const userSettingsSchema = z
  .object({
    theme: z.enum(['light', 'dark']).optional(),
    notifications: z
      .object({
        email: z.boolean().optional(),
        lowStock: z.boolean().optional(),
        newSale: z.boolean().optional(),
        newPurchase: z.boolean().optional(),
      })
      .optional(),
    preferences: z
      .object({
        currency: nonEmptyString(10).optional(),
        dateFormat: nonEmptyString(30).optional(),
        lowStockThreshold: z.number().int().min(0).max(100000).optional(),
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, 'At least one setting is required');
