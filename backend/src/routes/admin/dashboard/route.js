import { Router } from 'express';

import { dashboardService } from '../../../services/adminService/dashboardService.js';

const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {
    // Service handles stats, chart data, and recent traders
    const data = await dashboardService.getDashboardData();

    return res.status(200).json(data);
  } catch (error) {
    console.error('Admin dashboard API error:', error);
    return res.json({ error: 'Internal Server Error' });
  }
}

router.get('/', handleGet);

export default router;
