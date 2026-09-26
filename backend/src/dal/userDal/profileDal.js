import db from '../../config/db.js';

export const profileDal = {
    async findById(id) {
        return await db.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                emailVerified: true,
                is_active: true,
                verificationStatus: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },

    async update(id, data) {
        return await db.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                emailVerified: true,
                is_active: true,
                verificationStatus: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },
};
