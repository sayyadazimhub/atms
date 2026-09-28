import { Router } from 'express';
import { verifyAdminToken } from '../../../lib/auth.js';
import { settingsDal } from '../../../dal/settingsDal.js';

const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {
    const token = req.cookies['auth-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyAdminToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    let settings = await settingsDal.find();
    if (!settings) {
      settings = await settingsDal.create({
        maintenanceMode: false,
        traderSelfRegistration: true,
      });
    }
    return res.status(200).json(settings);
  } catch (error) {
    console.error('Settings GET:', error);
    return res.json({ error: 'Internal Server Error' });
  }
}

async function handlePut(req, res) {
  try {
    const token = req.cookies['auth-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyAdminToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const body = req.body;
    const { maintenanceMode, traderSelfRegistration, notifyOnNewTrader } = body;

    const settings = await settingsDal.save({
      maintenanceMode,
      traderSelfRegistration,
      notifyOnNewTrader,
    });

    return res.status(200).json(settings);
  } catch (error) {
    console.error('Settings PUT:', error);
    return res.json({ error: 'Failed to update settings' });
  }
}

router.get('/', handleGet);
router.put('/', handlePut);

export default router;
