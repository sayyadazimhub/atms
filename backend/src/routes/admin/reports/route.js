import { Router } from 'express';

import { verifyAdminToken } from '../../../lib/auth.js';
import { reportService } from '../../../services/adminService/reportService.js';

const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {
    const token = req.cookies['auth-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyAdminToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const { range = '30d' } = req.query;

    const data = await reportService.getAdminReports(range);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Admin Reports API Error:', error);
    return res.json({ error: 'Report generation failed' });
  }
}

router.get('/', handleGet);

export default router;
