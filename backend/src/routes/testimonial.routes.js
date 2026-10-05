import express from 'express';
import testimonialService from '../services/testimonial.service.js';
import { createTestimonialSchema, updateTestimonialSchema } from '../validations/testimonial.validation.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public: Get all approved testimonials
router.get('/public', async (req, res) => {
  try {
    const testimonials = await testimonialService.getApprovedTestimonials();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public: Submit a new testimonial
router.post('/', async (req, res) => {
  try {
    const { error, value } = createTestimonialSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const newTestimonial = await testimonialService.createTestimonial(value);
    res.status(201).json({ message: 'Testimonial submitted successfully. It will be reviewed by an admin.', data: newTestimonial });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all testimonials
router.get('/', authenticate, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const testimonials = await testimonialService.getAllTestimonials();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update testimonial status
router.patch('/:id/status', authenticate, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { error, value } = updateTestimonialSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const updated = await testimonialService.updateTestimonialStatus(req.params.id, value.status);
    res.json({ message: 'Testimonial status updated successfully', data: updated });
  } catch (error) {
    res.status(error.message === 'Testimonial not found' ? 404 : 500).json({ message: error.message });
  }
});

// Admin: Delete testimonial
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    await testimonialService.deleteTestimonial(req.params.id);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(error.message === 'Testimonial not found' ? 404 : 500).json({ message: error.message });
  }
});

export default router;
