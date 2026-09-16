import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const token = (await cookies()).get('auth-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyUserToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        let settings = await prisma.systemSetting.findFirst();
        if (!settings) {
            settings = await prisma.systemSetting.create({
                data: {
                    maintenanceMode: false,
                    traderSelfRegistration: true
                }
            });
        }
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings GET:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const token = (await cookies()).get('auth-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyUserToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { maintenanceMode, traderSelfRegistration, notifyOnNewTrader } = body;

        let settings = await prisma.systemSetting.findFirst();
        if (settings) {
            settings = await prisma.systemSetting.update({
                where: { id: settings.id },
                data: { maintenanceMode, traderSelfRegistration, notifyOnNewTrader }
            });
        } else {
            settings = await prisma.systemSetting.create({
                data: { maintenanceMode, traderSelfRegistration, notifyOnNewTrader }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings PUT:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
