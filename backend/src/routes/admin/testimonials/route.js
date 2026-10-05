import { Router } from 'express';
import { validateRequest } from '../../../middleware/validateRequest.js';
import { updateTestimonialSchema, editTestimonialSchema } from '../../../validations/testimonial.js';
import { testimonialService } from '../../../services/testimonialService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const testimonials = await testimonialService.getAllTestimonials();
    return res.status(200).json(testimonials);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.put('/:id', validateRequest(editTestimonialSchema, 'body'), async (req, res) => {
  try {
    const updated = await testimonialService.updateTestimonial(req.params.id, req.body);
    return res.status(200).json({ message: 'Testimonial updated successfully', data: updated });
  } catch (error) {
    return res.status(error.message === 'Testimonial not found' ? 404 : 500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.patch('/:id/status', validateRequest(updateTestimonialSchema, 'body'), async (req, res) => {
  try {
    const updated = await testimonialService.updateTestimonialStatus(req.params.id, req.body.status);
    return res.status(200).json({ message: 'Testimonial status updated successfully', data: updated });
  } catch (error) {
    return res.status(error.message === 'Testimonial not found' ? 404 : 500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await testimonialService.deleteTestimonial(req.params.id);
    return res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    return res.status(error.message === 'Testimonial not found' ? 404 : 500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;
