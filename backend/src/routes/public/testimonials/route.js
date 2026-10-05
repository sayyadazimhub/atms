import { Router } from 'express';
import { validateRequest } from '../../../middleware/validateRequest.js';
import { createTestimonialSchema } from '../../../validations/testimonial.js';
import { testimonialService } from '../../../services/testimonialService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const testimonials = await testimonialService.getApprovedTestimonials();
    return res.status(200).json(testimonials);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.post('/', validateRequest(createTestimonialSchema, 'body'), async (req, res) => {
  try {
    const testimonial = await testimonialService.createTestimonial(req.body);
    return res.status(201).json({ message: 'Testimonial submitted successfully. It will be reviewed by an admin.', data: testimonial });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;
