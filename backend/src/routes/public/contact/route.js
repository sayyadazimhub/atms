import { Router } from 'express';
import { validateRequest } from '../../../middleware/validateRequest.js';
import { createContactMessageSchema } from '../../../validations/contactMessage.js';
import { contactMessageService } from '../../../services/contactMessageService.js';

const router = Router();

router.post('/', validateRequest(createContactMessageSchema, 'body'), async (req, res) => {
  try {
    const message = await contactMessageService.createMessage(req.body);
    return res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;
