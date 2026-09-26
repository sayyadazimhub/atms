import db from '../../config/db.js';

export const dashboardDal = {
    async getBaseStats(userId, dateFilter) {
        const filter = { ...dateFilter, userId };
        return await Promise.all([
            db.sale.aggregate({
                where: filter,
                _sum: { totalAmount: true, totalProfit: true }
            }),
            db.sale.aggregate({ where: { userId }, _sum: { dueAmount: true } }),
            db.purchase.aggregate({
                where: filter,
                _sum: { totalAmount: true, paidAmount: true, dueAmount: true }
            }),
            db.purchase.aggregate({ where: { userId }, _sum: { dueAmount: true } }),
            db.product.findMany({
                where: { userId, currentStock: { lte: 10 } },
                orderBy: { currentStock: 'asc' },
                take: 10,
            })
        ]);
    },

    async getRawTransactions(userId, dateFilter) {
        const filter = { ...dateFilter, userId };
        return await Promise.all([
            db.sale.findMany({
                where: filter,
                select: { createdAt: true, totalAmount: true, totalProfit: true },
                orderBy: { createdAt: 'asc' },
            }),
            db.purchase.findMany({
                where: filter,
                select: { createdAt: true, totalAmount: true },
                orderBy: { createdAt: 'asc' },
            })
        ]);
    },

    async getSecondaryStats(userId, dateFilter) {
        const filter = { ...dateFilter, userId };
        return await Promise.all([
            db.sale.findMany({
                where: filter,
                include: { customer: true, items: { include: { product: true } } },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
            db.purchase.findMany({
                where: filter,
                include: { provider: true, items: { include: { product: true } } },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
            db.saleItem.groupBy({
                by: ['productId'],
                where: filter,
                _sum: { quantity: true, profit: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5,
            }),
            db.sale.groupBy({
                by: ['customerId'],
                where: filter,
                _sum: { totalAmount: true },
                orderBy: { _sum: { totalAmount: 'desc' } },
                take: 5,
            }),
            db.purchase.groupBy({
                by: ['providerId'],
                where: filter,
                _sum: { totalAmount: true },
                orderBy: { _sum: { totalAmount: 'desc' } },
                take: 5,
            }),
        ]);
    },

    async getProductDetails(id) {
        return await db.product.findUnique({
            where: { id },
            select: { name: true, unit: true },
        });
    },

    async getCustomerDetails(id) {
        return await db.customer.findUnique({
            where: { id },
            select: { name: true },
        });
    },

    async getProviderDetails(id) {
        return await db.provider.findUnique({
            where: { id },
            select: { name: true },
        });
    }
};
