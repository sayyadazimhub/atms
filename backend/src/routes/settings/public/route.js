import db from '../../../config/db.js';

export const revalidate = 60; // Cache the settings for 60 seconds

export async function GET(req, res) {
    try {
        let settings = await db.systemSetting.findFirst();
        
        if (!settings) {
            settings = {
                maintenanceMode: false,
                traderSelfRegistration: true
            };
        }

        const traderCount = await db.user.count({ where: { role: 'USER', is_active: true } });

        return res.json({
            maintenanceMode: settings.maintenanceMode,
            traderSelfRegistration: settings.traderSelfRegistration,
            notifyOnNewTrader: settings.notifyOnNewTrader,
            traderCount
        });
    } catch (error) {
        console.error('Public Settings GET error:', error);
        // Fallback to safe defaults if DB is down or unreachable
        return res.json({
            maintenanceMode: false,
            traderSelfRegistration: false, // Secure fallback
            notifyOnNewTrader: false
        });
    }
}
