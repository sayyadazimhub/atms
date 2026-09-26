import db from '../../config/db.js';

export const authDal = {
    async findByEmail(email) {
        return await db.admin.findUnique({ where: { email } });
    },

    async findById(id) {
        return await db.admin.findUnique({ where: { id } });
    },

    async create(data) {
        return await db.admin.create({ data });
    },

    async update(id, data) {
        return await db.admin.update({
            where: { id },
            data,
        });
    },

    async findFirstActiveWithResetToken(token) {
        return await db.admin.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
                is_active: true,
            },
        });
    },
};
