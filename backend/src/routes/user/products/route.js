

import { verifyUserToken } from '../../../lib/auth.js';
import { productService } from '../../../services/userService/productService.js';

export async function GET(req, res) {
  const params = req.params || {};
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const search = req.query.search || '';

    const data = await productService.getProducts(decoded.id, search, page, limit);

    return res.status(200).json(data);
  } catch (err) {
    console.error('Products GET error:', err);
    return res.json({ error: 'Failed to fetch products' });
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
    const product = await productService.createProduct(decoded.id, body);

    return res.status(201).json(product);
  } catch (err) {
    console.error('Products POST error:', err);
    const status = err.message.includes('required') || err.message.includes('Invalid') ? 400 : 500;
    return res.json({ error: err.message || 'Failed to create product' }, { status });
  }
}
