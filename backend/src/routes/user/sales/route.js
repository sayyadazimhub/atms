

import { verifyUserToken } from '../../../lib/auth.js';
import { saleService } from '../../../services/userService/saleService.js';

export async function GET(req, res) {
  const params = req.params || {};
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const page = Math.max(1, parseInt(req.query.page || '1', 10));

    const data = await saleService.getSales(decoded.id, page);

    return res.status(200).json(data);
  } catch (err) {
    console.error('Sales GET error:', err);
    return res.json({ error: 'Failed to fetch sales' });
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
    const sale = await saleService.createSale(decoded.id, body);

    return res.status(201).json(sale);
  } catch (err) {
    console.error('Sales POST error:', err);
    const status = err.message.includes('required') || err.message.includes('not found') || err.message.includes('Insufficient') ? 400 : 500;
    return res.json({ error: err.message || 'Failed to create sale' }, { status });
  }
}
