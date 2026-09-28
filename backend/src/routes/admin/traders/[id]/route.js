import { Router } from 'express';

import { traderService } from '../../../../services/adminService/traderService.js';
import { validateRequest } from '../../../../middleware/validateRequest.js';
import { idParamsSchema } from '../../../../validations/common.js';

const router = Router({ mergeParams: true });
router.use(validateRequest(idParamsSchema, 'params'));

async function handleGet(req, res) {
  try {
    const { id } = req.params;

    const data = await traderService.getTraderDetail(id);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Admin trader detail API error:', error);
    if (error.message === 'Trader not found') {
      return res.json({ error: 'Trader not found' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

router.get('/', handleGet);

export default router;
