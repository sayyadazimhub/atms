import db from './src/config/db.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    try {
        const admin = await db.admin.findUnique({ where: { email: 'azimsayyad90@gmail.com' } });
        console.log('Admin found:', admin ? 'Yes' : 'No');
        if (admin) {
            console.log(admin);
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
check();
