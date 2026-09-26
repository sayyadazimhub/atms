import db from '../../config/db.js';

export const productDal = {
    async findMany(where, skip, take) {
        return await db.product.findMany({
            where,
            include: {
                batches: {
                    where: { quantity: { gt: 0 } },
                    orderBy: { createdAt: 'asc' }
                },
                purchaseItems: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { unitPrice: true }
                }
            },
            orderBy: { name: 'asc' },
            skip,
            take,
        });
    },

    async count(where) {
        return await db.product.count({ where });
    },

    async findById(id) {
        return await db.product.findUnique({
            where: { id },
        });
    },

    async create(data) {
        return await db.product.create({ data });
    },

    async update(id, data) {
        return await db.product.update({
            where: { id },
            data,
        });
    },

    async delete(id) {
        return await db.product.delete({ where: { id } });
    }
};
