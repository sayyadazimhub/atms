import db from '../../config/db.js';

export const traderDal = {
    async findMany(where, skip, take) {
        return await db.user.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                is_active: true,
                emailVerified: true,
                verificationStatus: true,
                verificationProofUrl: true,
                state: true,
                district: true,
                createdAt: true,
            }
        });
    },

    async count(where) {
        return await db.user.count({ where });
    },

    async findByEmail(email) {
        return await db.user.findUnique({
            where: { email }
        });
    },

    async create(data) {
        return await db.user.create({
            data
        });
    },

    async getTradersSalesStats() {
        return await db.sale.groupBy({
            by: ['userId'],
            _sum: { totalAmount: true, totalProfit: true },
            _count: { id: true }
        });
    },

    async update(id, data) {
        return await db.user.update({
            where: { id },
            data
        });
    },

    async findByIdWithDetails(id) {
        return await db.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                is_active: true,
                verificationStatus: true,
                verificationProofUrl: true,
                state: true,
                district: true,
                createdAt: true,
                role: true,
            }
        });
    },

    async getTraderBusinessStats(id) {
        const [customers, providers, products, salesAggregate] = await Promise.all([
            db.customer.count({ where: { userId: id } }),
            db.provider.count({ where: { userId: id } }),
            db.product.count({ where: { userId: id } }),
            db.sale.aggregate({
                where: { userId: id },
                _sum: { totalAmount: true, totalProfit: true },
                _count: { id: true }
            })
        ]);

        return { customers, providers, products, salesAggregate };
    },

    async getRecentSales(id, limit = 5) {
        return await db.sale.findMany({
            where: { userId: id },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                customer: { select: { name: true } }
            }
        });
    },

    async deleteTraderCascading(id) {
        // Delete related entities first
        await db.saleItem.deleteMany({ where: { userId: id } });
        await db.sale.deleteMany({ where: { userId: id } });
        await db.purchaseItem.deleteMany({ where: { userId: id } });
        await db.purchase.deleteMany({ where: { userId: id } });
        await db.customer.deleteMany({ where: { userId: id } });
        await db.provider.deleteMany({ where: { userId: id } });
        await db.product.deleteMany({ where: { userId: id } });
        // Finally delete user
        return await db.user.delete({ where: { id } });
    }
};
