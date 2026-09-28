import { Router } from 'express';

import { customerService } from '../../../../services/userService/customerService.js';

const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {
    const { id } = req.params;
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

async function handlePut(req, res) {
  try {
    const { id } = req.params;
    const body = req.body;
    const customer = await customerService.updateCustomer(id, body);
    return res.status(200).json(customer);
  } catch (err) {
    console.error('Update customer error:', err);
    return res.json({ error: 'Failed to update' });
  }
}

async function handleDelete(req, res) {
  try {
    const { id } = req.params;
    await customerService.deleteCustomer(id);
    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete customer error:', err);
    return res.json({ error: 'Failed to delete' });
  }
}

router.get('/', handleGet);
router.put('/', handlePut);
router.delete('/', handleDelete);

export default router;
