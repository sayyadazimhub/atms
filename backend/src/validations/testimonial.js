import { z } from 'zod';

export const createTestimonialSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  role: z.string().trim().min(1, 'Business/Role is required').max(100),
  message: z.string().trim().min(1, 'Message is required').max(2000),
  image: z.string().optional().or(z.literal('')),
});

export const editTestimonialSchema = createTestimonialSchema;

export const updateTestimonialSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED'], {
    errorMap: () => ({ message: 'Status must be PENDING, APPROVED, or REJECTED.' })
  }),
});
