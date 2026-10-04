import { z } from 'zod';
import { emailSchema, nonEmptyString } from './common.js';

export const createContactMessageSchema = z.object({
  fullName: z.string().trim().min(1, 'Full Name is required').max(100),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address').max(254),
  subject: z.string().trim().min(1, 'Subject is required').max(150),
  message: z.string().trim().min(1, 'Message is required').max(2000),
});
