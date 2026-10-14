import { Router } from 'express';

import { productService } from '../../../../services/userService/productService.js';
import { requireUserSession } from '../../../../middleware/requireUserSession.js';
import { validateRequest } from '../../../../middleware/validateRequest.js';
import { idParamsSchema } from '../../../../validations/common.js';
import { productUpdateSchema, combineBatchesSchema } from '../../../../validations/resources.js';

const router = Router({ mergeParams: true });
router.use(requireUserSession, validateRequest(idParamsSchema, 'params'));

async function handleGet(req, res) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id, req.auth.id);
    return res.status(200).json(product);
  } catch (err) {
    console.error('Fetch product error:', err);
    if (err.message === 'Product not found') {
      return res.json({ error: 'Not found' });
    }
    return res.status(500).json({ error: 'Failed to fetch' });
  }
}

async function handlePut(req, res) {
  try {
    const { id } = req.params;
    const body = req.body;
    const product = await productService.updateProduct(id, req.auth.id, body);
    return res.status(200).json(product);
  } catch (err) {
    console.error('Update product error:', err);
    const status = err.message.includes('Invalid') ? 400 : 500;
    return res.respond({ error: err.message || 'Failed to update' }, status);
  }
}

async function handleDelete(req, res) {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id, req.auth.id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    return res.json({ error: 'Failed to delete' });
  }
}

async function handleCombineBatches(req, res) {
  try {
    const { id } = req.params;
    const result = await productService.combineBatches(id, req.auth.id, req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Combine batches error:', err);
    return res.status(400).json({ error: err.message || 'Failed to combine batches' });
  }
}

router.get('/', handleGet);
router.put('/', validateRequest(productUpdateSchema), handlePut);
router.delete('/', handleDelete);
router.post('/combine-batches', validateRequest(combineBatchesSchema), handleCombineBatches);

export default router;
