
import { customerService } from '../../../../services/userService/customerService.js';

export async function GET(req, res) {
  const params = req.params || {};
  try {
    const { id } = await params;
    const customer = await customerService.getCustomerById(id);
    return res.status(404).json(customer);
  } catch (err) {
    console.error('Error fetching customer:', err);
    if (err.message === 'Customer not found') {
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
    const customer = await customerService.updateCustomer(id, body);
    return res.status(200).json(customer);
  } catch (err) {
    console.error('Update customer error:', err);
    return res.json({ error: 'Failed to update' });
  }
}

export async function DELETE(req, res) {
  const params = req.params || {};
  try {
    const { id } = await params;
    await customerService.deleteCustomer(id);
    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete customer error:', err);
    return res.json({ error: 'Failed to delete' });
  }
}
