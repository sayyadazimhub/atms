import db from '../../config/db.js';

export const reportDal = {
    async getSales(where) {
        return await db.sale.findMany({
            where,
            include: { customer: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    },

    async getPurchases(where) {
        return await db.purchase.findMany({
            where,
            include: { provider: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
};
