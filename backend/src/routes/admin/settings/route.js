import { verifyUserToken } from '../../../lib/auth.js';
import db from '../../../config/db.js';

export async function GET(req, res) {
    try {
        const token = req.cookies['auth-token'];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const decoded = await verifyUserToken(token);
        if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

        let settings = await db.systemSetting.findFirst();
        if (!settings) {
            settings = await db.systemSetting.create({
                data: {
                    maintenanceMode: false,
                    traderSelfRegistration: true
                }
            });
        }
        return res.status(200).json(settings);
    } catch (error) {
        console.error('Settings GET:', error);
        return res.json({ error: 'Internal Server Error' });
    }
}

export async function PUT(req, res) {
  const params = req.params || {};
    try {
        const token = req.cookies['auth-token'];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const decoded = await verifyUserToken(token);
        if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

        const body = req.body;
        const { maintenanceMode, traderSelfRegistration, notifyOnNewTrader } = body;

        let settings = await db.systemSetting.findFirst();
        if (settings) {
            settings = await db.systemSetting.update({
                where: { id: settings.id },
                data: { maintenanceMode, traderSelfRegistration, notifyOnNewTrader }
            });
        } else {
            settings = await db.systemSetting.create({
                data: { maintenanceMode, traderSelfRegistration, notifyOnNewTrader }
            });
        }

        return res.status(200).json(settings);
    } catch (error) {
        console.error('Settings PUT:', error);
        return res.json({ error: 'Failed to update settings' });
    }
}
