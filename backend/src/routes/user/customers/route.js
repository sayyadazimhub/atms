import { Router } from 'express';

import { verifyUserToken } from '../../../lib/auth.js';
import { customerService } from '../../../services/userService/customerService.js';

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

    const data = await customerService.getCustomers(decoded.id, search, page, limit);

    return res.status(200).json(data);
  } catch (err) {
    console.error('Customers GET error:', err);
    return res
      .status(err.message === 'Name is required' ? 400 : 500)
      .json({ error: 'Failed to fetch customers' });
  }
}

async function handlePost(req, res) {
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const body = req.body;
    const customer = await customerService.createCustomer(decoded.id, body);

    return res.status(201).json(customer);
  } catch (err) {
    console.error('Customers POST error:', err);
    return res.json({ error: err.message || 'Failed to create customer' });
  }
}

router.get('/', handleGet);
router.post('/', handlePost);

export default router;
