import { Router } from 'express';

import { providerService } from '../../../../services/userService/providerService.js';

const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {
    const { id } = req.params;
    const provider = await providerService.getProviderById(id);
    return res.status(404).json(provider);
  } catch (err) {
    console.error('Error fetching provider:', err);
    if (err.message === 'Provider not found') {
      return res.json({ error: 'Not found' });
    }
    return res.status(500).json({ error: 'Failed to fetch' });
  }
}

async function handlePut(req, res) {
  try {
    const { id } = req.params;
    const body = req.body;
    const provider = await providerService.updateProvider(id, body);
    return res.status(200).json(provider);
  } catch (err) {
    console.error('Update provider error:', err);
    return res.json({ error: 'Failed to update' });
  }
}

async function handleDelete(req, res) {
  try {
    const { id } = req.params;
    await providerService.deleteProvider(id);
    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete provider error:', err);
    return res.json({ error: 'Failed to delete' });
  }
}

router.get('/', handleGet);
router.put('/', handlePut);
router.delete('/', handleDelete);

export default router;
