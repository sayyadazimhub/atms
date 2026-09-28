import { z } from 'zod';
import { objectIdSchema, paginationQuerySchema } from './common.js';

export const adminSearchQuerySchema = z.object({ search: z.string().max(100).optional() });

export const adminTraderQuerySchema = paginationQuerySchema.extend({
  limit: z
    .string()
    .regex(/^\d+$/)
    .optional()
    .refine((value) => value === undefined || Number(value) <= 100, 'Must be at most 100'),
});

export const idQuerySchema = z.object({ id: objectIdSchema });

export const adminReportQuerySchema = z.object({
  range: z.enum(['7d', '30d', '90d', 'all']).optional(),
});

const dateString = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Must be a valid date');

export const dashboardQuerySchema = z
  .object({
    startDate: dateString.optional(),
    endDate: dateString.optional(),
  })
  .refine((data) => Boolean(data.startDate) === Boolean(data.endDate), {
    message: 'startDate and endDate must be supplied together',
  });

export const userReportQuerySchema = z
  .object({
    type: z.enum(['today', 'weekly', 'monthly', 'yearly', 'custom']).optional(),
    start: dateString.optional(),
    end: dateString.optional(),
  })
  .refine((data) => Boolean(data.start) === Boolean(data.end), {
    message: 'start and end must be supplied together',
  });
