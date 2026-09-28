import { Router } from 'express';

import { verifyUserToken } from '../../../../lib/auth.js';
import { purchaseService } from '../../../../services/userService/purchaseService.js';
import { validateRequest } from '../../../../middleware/validateRequest.js';
import { idParamsSchema } from '../../../../validations/common.js';
import { paymentSchema } from '../../../../validations/resources.js';

const router = Router({ mergeParams: true });
router.use(validateRequest(idParamsSchema, 'params'));

async function handleGet(req, res) {
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.respondError('Unauthorized', 401);

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.respondError('Unauthorized', 401);

    const { id } = req.params;
    const purchase = await purchaseService.getPurchaseById(id, decoded.id);
    return res.respond(purchase);
  } catch (err) {
    console.error('Purchase GET error:', err);
    if (err.message === 'Purchase not found') {
      return res.respondError('Purchase not found', 404);
    }
    return res.respondError('Failed to fetch purchase', 500);
  }
}

async function handlePut(req, res) {
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.respondError('Unauthorized', 401);

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.respondError('Unauthorized', 401);

    const { id } = req.params;
    const body = req.body;
    const { paidAmount } = body;

    const updated = await purchaseService.updatePayment(id, decoded.id, paidAmount);

    return res.respond(updated);
  } catch (err) {
    console.error('Purchase PUT error:', err);
    const status =
      err.message === 'paidAmount is required'
        ? 400
        : err.message === 'Purchase not found'
          ? 404
          : 500;
    return res.respond({ error: err.message || 'Failed to update purchase' }, status);
  }
}

async function handleDelete(req, res) {
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.respondError('Unauthorized', 401);

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.respondError('Unauthorized', 401);

    const { id } = req.params;

    await purchaseService.deletePurchase(id, decoded.id);

    return res.respond({ message: 'Purchase deleted successfully' });
  } catch (err) {
    console.error('Purchase DELETE error:', err);
    const status = err.message === 'Purchase not found' ? 404 : 500;
    return res.respondError(err.message || 'Failed to delete purchase', status);
  }
}

router.get('/', handleGet);
router.put('/', validateRequest(paymentSchema), handlePut);
router.delete('/', handleDelete);

export default router;
