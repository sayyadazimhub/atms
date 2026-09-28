import { Router } from 'express';

import { saleService } from '../../../services/userService/saleService.js';
import { validateRequest } from '../../../middleware/validateRequest.js';
import { pageQuerySchema } from '../../../validations/common.js';
import { saleSchema } from '../../../validations/resources.js';

const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));

    const data = await saleService.getSales(req.auth.id, page);

    return res.status(200).json(data);
  } catch (err) {
    console.error('Sales GET error:', err);
    return res.json({ error: 'Failed to fetch sales' });
  }
}

async function handlePost(req, res) {
  try {
    const body = req.body;
    const sale = await saleService.createSale(req.auth.id, body);

    return res.status(201).json(sale);
  } catch (err) {
    console.error('Sales POST error:', err);
    const status =
      err.message.includes('required') ||
      err.message.includes('not found') ||
      err.message === 'Paid amount cannot exceed total amount' ||
      err.message.includes('Insufficient')
        ? 400
        : 500;
    return res.respond({ error: err.message || 'Failed to create sale' }, status);
  }
}

router.get('/', validateRequest(pageQuerySchema, 'query'), handleGet);
router.post('/', validateRequest(saleSchema), handlePost);

export default router;
