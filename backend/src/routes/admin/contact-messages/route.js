import { Router } from 'express';
import { contactMessageService } from '../../../services/contactMessageService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const messages = await contactMessageService.getMessages();
    return res.status(200).json({ data: messages });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await contactMessageService.deleteMessage(req.params.id);
    return res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { isRead } = req.body;
    const msg = await contactMessageService.updateStatus(req.params.id, isRead);
    return res.status(200).json({ message: 'Message status updated', data: msg });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;
