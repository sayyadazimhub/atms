import { Router } from 'express';

import { providerService } from '../../../services/userService/providerService.js';
import { validateRequest } from '../../../middleware/validateRequest.js';
import { paginationQuerySchema } from '../../../validations/common.js';
import { providerSchema } from '../../../validations/resources.js';

const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const search = req.query.search || '';

    const data = await providerService.getProviders(req.auth.id, search, page, limit);

    return res.status(200).json(data);
  } catch (err) {
    console.error('Providers GET error:', err);
    return res.json({ error: 'Failed to fetch providers' });
  }
}

async function handlePost(req, res) {
  try {
    const body = req.body;
    const provider = await providerService.createProvider(req.auth.id, body);

    return res.status(201).json(provider);
  } catch (err) {
    console.error('Providers POST error:', err);
    const status = err.message === 'Name is required' ? 400 : 500;
    return res.respond({ error: err.message || 'Failed to create provider' }, status);
  }
}

router.get('/', validateRequest(paginationQuerySchema, 'query'), handleGet);
router.post('/', validateRequest(providerSchema), handlePost);

export default router;
