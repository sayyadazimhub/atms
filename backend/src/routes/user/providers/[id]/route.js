import { Router } from 'express';

import { providerService } from '../../../../services/userService/providerService.js';
import { requireUserSession } from '../../../../middleware/requireUserSession.js';
import { validateRequest } from '../../../../middleware/validateRequest.js';
import { idParamsSchema } from '../../../../validations/common.js';
import { providerUpdateSchema } from '../../../../validations/resources.js';

const router = Router({ mergeParams: true });
router.use(requireUserSession, validateRequest(idParamsSchema, 'params'));

async function handleGet(req, res) {
  try {
    const { id } = req.params;
    const provider = await providerService.getProviderById(id, req.auth.id);
    return res.status(200).json(provider);
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
    const provider = await providerService.updateProvider(id, req.auth.id, body);
    return res.status(200).json(provider);
  } catch (err) {
    console.error('Update provider error:', err);
    return res.json({ error: 'Failed to update' });
  }
}

async function handleDelete(req, res) {
  try {
    const { id } = req.params;
    await providerService.deleteProvider(id, req.auth.id);
    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete provider error:', err);
    return res.json({ error: 'Failed to delete' });
  }
}

router.get('/', handleGet);
router.put('/', validateRequest(providerUpdateSchema), handlePut);
router.delete('/', handleDelete);

export default router;
