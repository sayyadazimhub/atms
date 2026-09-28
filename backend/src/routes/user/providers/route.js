import { Router } from 'express';

import { verifyUserToken } from '../../../lib/auth.js';
import { providerService } from '../../../services/userService/providerService.js';

const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const search = req.query.search || '';

    const data = await providerService.getProviders(decoded.id, search, page, limit);

    return res.status(200).json(data);
  } catch (err) {
    console.error('Providers GET error:', err);
    return res.json({ error: 'Failed to fetch providers' });
  }
}

async function handlePost(req, res) {
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const body = req.body;
    const provider = await providerService.createProvider(decoded.id, body);

    return res.status(201).json(provider);
  } catch (err) {
    console.error('Providers POST error:', err);
    const status = err.message === 'Name is required' ? 400 : 500;
    return res.respond({ error: err.message || 'Failed to create provider' }, status);
  }
}

router.get('/', handleGet);
router.post('/', handlePost);

export default router;
