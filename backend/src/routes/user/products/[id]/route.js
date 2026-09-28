import { Router } from 'express';

import { productService } from '../../../../services/userService/productService.js';
import { validateRequest } from '../../../../middleware/validateRequest.js';
import { idParamsSchema } from '../../../../validations/common.js';
import { productUpdateSchema } from '../../../../validations/resources.js';

const router = Router({ mergeParams: true });
router.use(validateRequest(idParamsSchema, 'params'));

async function handleGet(req, res) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    return res.status(404).json(product);
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
    const product = await productService.updateProduct(id, body);
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
    await productService.deleteProduct(id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    return res.json({ error: 'Failed to delete' });
  }
}

router.get('/', handleGet);
router.put('/', validateRequest(productUpdateSchema), handlePut);
router.delete('/', handleDelete);

export default router;
