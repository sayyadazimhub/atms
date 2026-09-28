import { Router } from 'express';

import { verifyUserToken } from '../../../../lib/auth.js';
import { saleService } from '../../../../services/userService/saleService.js';
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

    const sale = await saleService.getSaleById(req.params.id, decoded.id);
    return res.respond(sale);
  } catch (err) {
    console.error('Sale GET error:', err);
    if (err.message === 'Sale not found') {
      return res.respondError('Sale not found', 404);
    }
    return res.respondError('Failed to fetch sale', 500);
  }
}

async function handlePut(req, res) {
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.respondError('Unauthorized', 401);

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.respondError('Unauthorized', 401);

    const body = req.body;
    const { paidAmount } = body;

    const updated = await saleService.updatePayment(req.params.id, decoded.id, paidAmount);

    return res.respond(updated);
  } catch (err) {
    console.error('Sale PUT error:', err);
    const status =
      err.message === 'paidAmount is required' ||
      err.message === 'Paid amount cannot exceed total amount'
        ? 400
        : err.message === 'Sale not found'
          ? 404
          : 500;
    return res.respondError(err.message || 'Failed to update sale', status);
  }
}

async function handleDelete(req, res) {
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.respondError('Unauthorized', 401);

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.respondError('Unauthorized', 401);

    await saleService.deleteSale(req.params.id, decoded.id);

    return res.respond({ message: 'Sale deleted successfully' });
  } catch (err) {
    console.error('Sale DELETE error:', err);
    const status = err.message === 'Sale not found' ? 404 : 500;
    return res.respondError(err.message || 'Failed to delete sale', status);
  }
}

router.get('/', handleGet);
router.put('/', validateRequest(paymentSchema), handlePut);
router.delete('/', handleDelete);

export default router;
