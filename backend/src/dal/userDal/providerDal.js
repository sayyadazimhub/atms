import db from '../../config/db.js';

export const providerDal = {
    async findMany(where, skip, take) {
        return await db.provider.findMany({
            where,
            orderBy: { name: 'asc' },
            skip,
            take,
        });
    },

    async count(where) {
        return await db.provider.count({ where });
    },

    async findByIdWithPurchases(id) {
        return await db.provider.findUnique({
            where: { id },
            include: {
                purchases: {
                    include: {
                        items: {
                            include: {
                                product: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
    },

    async create(data) {
        return await db.provider.create({ data });
    },

    async update(id, data) {
        return await db.provider.update({
            where: { id },
            data,
        });
    },

    async delete(id) {
        return await db.provider.delete({ where: { id } });
    }
};
