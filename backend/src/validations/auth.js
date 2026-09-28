import { z } from 'zod';
import { emailSchema, nonEmptyString, otpSchema, passwordSchema } from './common.js';

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const userRegistrationSchema = z.object({
  name: nonEmptyString(100),
  email: emailSchema,
  password: passwordSchema,
  phone: nonEmptyString(30),
});

export const adminRegistrationSchema = z.object({
  name: nonEmptyString(100),
  email: emailSchema,
  password: passwordSchema,
  phone: z.string().trim().max(30).optional(),
});

export const emailRequestSchema = z.object({ email: emailSchema });

export const adminResetPasswordSchema = z.object({
  token: nonEmptyString(200),
  password: passwordSchema,
});

export const userResetPasswordSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
  newPassword: passwordSchema,
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const changePasswordSchema = z.object({ newPassword: passwordSchema });
