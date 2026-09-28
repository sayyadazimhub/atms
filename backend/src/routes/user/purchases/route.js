import { Router } from 'express';

import { verifyUserToken } from '../../../lib/auth.js';
import { purchaseService } from '../../../services/userService/purchaseService.js';
import { validateRequest } from '../../../middleware/validateRequest.js';
import { pageQuerySchema } from '../../../validations/common.js';
import { purchaseSchema } from '../../../validations/resources.js';

const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const page = Math.max(1, parseInt(req.query.page || '1', 10));

    const data = await purchaseService.getPurchases(decoded.id, page);

    return res.status(200).json(data);
  } catch (err) {
    console.error('Purchases GET error:', err);
    return res.json({ error: 'Failed to fetch purchases' });
  }
}

async function handlePost(req, res) {
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const body = req.body;
    const purchase = await purchaseService.createPurchase(decoded.id, body);

    return res.status(201).json(purchase);
  } catch (err) {
    console.error('Purchases POST error:', err);
    const status =
      err.message.includes('required') ||
      err.message === 'Paid amount cannot exceed total amount' ||
      err.message.endsWith('not found')
        ? 400
        : 500;
    return res.respond({ error: err.message || 'Failed to create purchase' }, status);
  }
}

router.get('/', validateRequest(pageQuerySchema, 'query'), handleGet);
router.post('/', validateRequest(purchaseSchema), handlePost);

export default router;
