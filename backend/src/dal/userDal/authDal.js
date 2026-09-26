import db from '../../config/db.js';

export const authDal = {
    async findByEmail(email) {
        return await db.user.findUnique({ where: { email } });
    },

    async findById(id) {
        return await db.user.findUnique({ where: { id } });
    },

    async create(data) {
        return await db.user.create({ data });
    },

    async update(id, data) {
        return await db.user.update({
            where: { id },
            data,
        });
    },

    async findByEmailAndOtp(email, otp) {
        return await db.user.findFirst({
            where: {
                email,
                otp,
                otpExpiresAt: { gt: new Date() },
            },
        });
    },
};
