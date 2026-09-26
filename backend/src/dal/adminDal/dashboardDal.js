import db from '../../config/db.js';

export const dashboardDal = {
    async getStats() {
        return await Promise.all([
            db.user.count({ where: { role: 'USER' } }),
            db.user.count({ where: { role: 'USER', is_active: true } }),
            db.sale.aggregate({
                where: { userId: { not: null } },
                _sum: { totalAmount: true, totalProfit: true }
            }),
            db.purchase.aggregate({
                where: { userId: { not: null } },
                _sum: { totalAmount: true }
            }),
            db.sale.count({ where: { userId: { not: null } } }),
            db.purchase.count({ where: { userId: { not: null } } }),
            db.admin.count(),
            db.admin.count({ where: { is_active: true } }),
            db.systemSetting.findFirst()
        ]);
    },

    async getRecentTraders(limit = 5) {
        return await db.user.findMany({
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
            db.sale.findMany({
                where: {
                    userId: { not: null },
                    createdAt: { gte: startDate }
                },
                select: { createdAt: true, totalAmount: true }
            }),
            db.purchase.findMany({
                where: {
                    userId: { not: null },
                    createdAt: { gte: startDate }
                },
                select: { createdAt: true, totalAmount: true }
            }),
            db.user.findMany({
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
