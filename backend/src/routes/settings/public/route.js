import { Router } from 'express';
import { traderDal } from '../../../dal/adminDal/traderDal.js';
import { settingsDal } from '../../../dal/settingsDal.js';

const router = Router();

router.get('/', async (_req, res) => {
  let settings = await settingsDal.find();

  if (!settings) {
    settings = {
      maintenanceMode: false,
      traderSelfRegistration: true,
    };
  }

  const traderCount = await traderDal.countActiveTraders();

  return res.respond({
    maintenanceMode: settings.maintenanceMode,
    traderSelfRegistration: settings.traderSelfRegistration,
    notifyOnNewTrader: settings.notifyOnNewTrader,
    traderCount,
  });
});

export default router;
