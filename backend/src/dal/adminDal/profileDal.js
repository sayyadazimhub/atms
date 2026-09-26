import db from '../../config/db.js';

export const profileDal = {
    async findById(id) {
        return await db.admin.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                is_active: true,
                createdAt: true,
            },
        });
    },

    async update(id, data) {
        return await db.admin.update({
            where: { id },
            data,
        });
    },
};
