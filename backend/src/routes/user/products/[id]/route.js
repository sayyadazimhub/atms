
import { productService } from '../../../../services/userService/productService.js';

export async function GET(req, res) {
  const params = req.params || {};
  try {
    const { id } = await params;
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

export async function PUT(req, res) {
  const params = req.params || {};
  try {
    const { id } = await params;
    const body = req.body;
    const product = await productService.updateProduct(id, body);
    return res.status(200).json(product);
  } catch (err) {
    console.error('Update product error:', err);
    const status = err.message.includes('Invalid') ? 400 : 500;
    return res.json({ error: err.message || 'Failed to update' }, { status });
  }
}

export async function DELETE(req, res) {
  const params = req.params || {};
  try {
    const { id } = await params;
    await productService.deleteProduct(id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    return res.json({ error: 'Failed to delete' });
  }
}
