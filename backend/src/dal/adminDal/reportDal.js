import db from '../../config/db.js';

export const reportDal = {
    async getOverallStats(where) {
        return await db.sale.aggregate({
            where,
            _sum: { totalAmount: true, totalProfit: true },
            _count: { id: true }
        });
    },

    async getTraderPerformance(where, take = 5) {
        return await db.sale.groupBy({
            by: ['userId'],
            where,
            _sum: { totalAmount: true, totalProfit: true },
            orderBy: { _sum: { totalAmount: 'desc' } },
            take
        });
    },

    async getRecentSalesForTimeline(since) {
        return await db.sale.findMany({
            where: {
                createdAt: { gte: since },
                userId: { not: null }
            },
            select: { createdAt: true, totalAmount: true, totalProfit: true },
            orderBy: { createdAt: 'asc' }
        });
    },

    async getTradersByIds(ids) {
        return await db.user.findMany({
            where: { id: { in: ids } },
            select: { id: true, name: true }
        });
    },

    async getItemStats(where, take = 4) {
        return await db.saleItem.groupBy({
            by: ['productId'],
            where,
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take
        });
    },

    async getProductsByIds(ids) {
        return await db.product.findMany({
            where: { id: { in: ids } },
            select: { id: true, name: true }
        });
    },

    async getTraderCount() {
        return await db.user.count({ where: { role: 'USER' } });
    },

    async getProductCount() {
        return await db.product.count();
    }
};
