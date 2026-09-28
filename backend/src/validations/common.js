import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Must be a valid ID');

export const idParamsSchema = z.object({ id: objectIdSchema });

const queryInteger = (min, max) =>
  z
    .string()
    .regex(/^\d+$/, 'Must be a whole number')
    .optional()
    .refine(
      (value) => value === undefined || (Number(value) >= min && Number(value) <= max),
      `Must be between ${min} and ${max}`,
    );

export const paginationQuerySchema = z.object({
  page: queryInteger(1, 100000),
  limit: queryInteger(1, 100),
  search: z.string().max(100).optional(),
});

export const pageQuerySchema = z.object({
  page: queryInteger(1, 100000),
});

export const emailSchema = z.string().trim().email().max(254);
export const passwordSchema = z.string().min(8).max(128);
export const otpSchema = z.string().regex(/^\d{6}$/, 'OTP must be 6 digits');

export const nonEmptyString = (max = 200) => z.string().trim().min(1).max(max);

export const nonNegativeNumber = z
  .union([
    z.number(),
    z
      .string()
      .trim()
      .regex(/^\d+(?:\.\d+)?$/),
  ])
  .transform(Number)
  .pipe(z.number().finite().min(0));

export const positiveNumber = z
  .union([
    z.number(),
    z
      .string()
      .trim()
      .regex(/^\d+(?:\.\d+)?$/),
  ])
  .transform(Number)
  .pipe(z.number().finite().gt(0));
