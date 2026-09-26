

import { verifyUserToken } from '../../../lib/auth.js';
import { purchaseService } from '../../../services/userService/purchaseService.js';

export async function GET(req, res) {
  const params = req.params || {};
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

export async function POST(req, res) {
  const params = req.params || {};
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
    const status = err.message.includes('required') ? 400 : 500;
    return res.json({ error: err.message || 'Failed to create purchase' }, { status });
  }
}
