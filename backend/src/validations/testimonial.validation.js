import Joi from 'joi';

export const createTestimonialSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required.',
    'any.required': 'Name is required.',
  }),
  role: Joi.string().required().messages({
    'string.empty': 'Business/Role is required.',
    'any.required': 'Business/Role is required.',
  }),
  message: Joi.string().required().messages({
    'string.empty': 'Message is required.',
    'any.required': 'Message is required.',
  }),
  image: Joi.string().uri().allow('', null).optional(),
});

export const updateTestimonialSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').required().messages({
    'any.only': 'Status must be PENDING, APPROVED, or REJECTED.',
    'any.required': 'Status is required.',
  }),
});
