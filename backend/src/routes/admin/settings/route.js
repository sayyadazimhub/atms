import { Router } from 'express';
import { settingsDal } from '../../../dal/settingsDal.js';
import { validateRequest } from '../../../middleware/validateRequest.js';
import { systemSettingsSchema } from '../../../validations/resources.js';

const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {
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
router.put('/', validateRequest(systemSettingsSchema), handlePut);

export default router;
