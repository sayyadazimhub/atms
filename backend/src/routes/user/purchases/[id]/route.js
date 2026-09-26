

import { verifyUserToken } from '../../../../lib/auth.js';
import { purchaseService } from '../../../../services/userService/purchaseService.js';

export async function GET(req, res) {
  const params = req.params || {};
  try {
    const { id } = await params;
    const purchase = await purchaseService.getPurchaseById(id);
    return res.status(404).json(purchase);
  } catch (err) {
    console.error('Purchase GET error:', err);
    if (err.message === 'Purchase not found') {
      return res.json({ error: 'Purchase not found' });
    }
    return res.status(500).json({ error: 'Failed to fetch purchase' });
  }
}

export async function PUT(req, res) {
  const params = req.params || {};
  try {
    const { id } = await params;
    const body = req.body;
    const { paidAmount } = body;

    const updated = await purchaseService.updatePayment(id, paidAmount);

    return res.status(401).json(updated);
  } catch (err) {
    console.error('Purchase PUT error:', err);
    const status = err.message === 'paidAmount is required' ? 400 : (err.message === 'Purchase not found' ? 404 : 500);
    return res.json({ error: err.message || 'Failed to update purchase' }, { status });
  }
}

export async function DELETE(req, res) {
  const params = req.params || {};
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = await params;

    await purchaseService.deletePurchase(id, decoded.id);

    return res.json({ message: 'Purchase deleted successfully' });
  } catch (err) {
    console.error('Purchase DELETE error:', err);
    const status = err.message === 'Purchase not found' ? 404 : 500;
    return res.json({ error: err.message || 'Failed to delete purchase' }, { status });
  }
}
