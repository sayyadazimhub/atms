import db from '../../config/db.js';

export const customerDal = {
    async findMany(where, skip, take) {
        return await db.customer.findMany({
            where,
            orderBy: { name: 'asc' },
            skip,
            take,
        });
    },

    async count(where) {
        return await db.customer.count({ where });
    },

    async findByIdWithSales(id) {
        return await db.customer.findUnique({
            where: { id },
            include: {
                sales: {
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
        return await db.customer.create({ data });
    },

    async update(id, data) {
        return await db.customer.update({
            where: { id },
            data,
        });
    },

    async delete(id) {
        return await db.customer.delete({ where: { id } });
    }
};
