import dotenv from 'dotenv';
dotenv.config();

import db from './src/config/db.js';
import { hashPassword } from './src/lib/auth.js';

async function seedAdmin() {
    const email = 'admin@example.com';
    const password = 'password123';
    const hashedPassword = await hashPassword(password);
    
    let admin = await db.admin.findUnique({ where: { email } });
    if (admin) {
        admin = await db.admin.update({
            where: { email },
            data: { password: hashedPassword, is_active: true }
        });
        console.log(`Updated admin: ${email} | Password: ${password}`);
    } else {
        admin = await db.admin.create({
            data: {
                name: 'System Admin',
                email,
                password: hashedPassword,
                role: 'ADMIN',
                is_active: true
            }
        });
        console.log(`Created admin: ${email} | Password: ${password}`);
    }
    process.exit();
}
seedAdmin();
