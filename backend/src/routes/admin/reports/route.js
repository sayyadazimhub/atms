import { Router } from 'express';

import { reportService } from '../../../services/adminService/reportService.js';
import { validateRequest } from '../../../middleware/validateRequest.js';
import { adminReportQuerySchema } from '../../../validations/queries.js';

const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {
    const { range = '30d' } = req.query;

    const data = await reportService.getAdminReports(range);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Admin Reports API Error:', error);
    return res.json({ error: 'Report generation failed' });
  }
}

router.get('/', validateRequest(adminReportQuerySchema, 'query'), handleGet);

export default router;
