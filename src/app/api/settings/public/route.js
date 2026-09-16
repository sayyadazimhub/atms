import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const revalidate = 60; // Cache the settings for 60 seconds

export async function GET() {
    try {
        let settings = await prisma.systemSetting.findFirst();
        
        if (!settings) {
            settings = {
                maintenanceMode: false,
                traderSelfRegistration: true
            };
        }

        return NextResponse.json({
            maintenanceMode: settings.maintenanceMode,
            traderSelfRegistration: settings.traderSelfRegistration,
            notifyOnNewTrader: settings.notifyOnNewTrader
        });
    } catch (error) {
        console.error('Public Settings GET error:', error);
        // Fallback to safe defaults if DB is down or unreachable
        return NextResponse.json({
            maintenanceMode: false,
            traderSelfRegistration: false, // Secure fallback
            notifyOnNewTrader: false
        });
    }
}
