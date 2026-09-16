import prisma from '@/lib/prisma';

export const dashboardDal = {
    async getStats() {
        return await Promise.all([
            prisma.user.count({ where: { role: 'USER' } }),
            prisma.user.count({ where: { role: 'USER', is_active: true } }),
            prisma.sale.aggregate({
                where: { userId: { not: null } },
                _sum: { totalAmount: true, totalProfit: true }
            }),
            prisma.purchase.aggregate({
                where: { userId: { not: null } },
                _sum: { totalAmount: true }
            }),
            prisma.sale.count({ where: { userId: { not: null } } }),
            prisma.purchase.count({ where: { userId: { not: null } } }),
            prisma.admin.count(),
            prisma.admin.count({ where: { is_active: true } }),
            prisma.systemSetting.findFirst()
        ]);
    },

    async getRecentTraders(limit = 5) {
        return await prisma.user.findMany({
            where: { role: 'USER' },
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });
    },

    async getChartData(months = 6) {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        const [sales, purchases, traders] = await Promise.all([
            prisma.sale.findMany({
                where: {
                    userId: { not: null },
                    createdAt: { gte: startDate }
                },
                select: { createdAt: true, totalAmount: true }
            }),
            prisma.purchase.findMany({
                where: {
                    userId: { not: null },
                    createdAt: { gte: startDate }
                },
                select: { createdAt: true, totalAmount: true }
            }),
            prisma.user.findMany({
                where: {
                    role: 'USER',
                    createdAt: { gte: startDate }
                },
                select: { createdAt: true, is_active: true }
            })
        ]);

        return { sales, purchases, traders };
    }
};
