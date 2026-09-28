import { Router } from 'express';

import { verifyAdminToken } from '../../../../lib/auth.js';
import { traderService } from '../../../../services/adminService/traderService.js';

const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {
    const token = req.cookies['auth-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyAdminToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

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
