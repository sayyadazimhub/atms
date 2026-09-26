import db from './src/config/db.js';
import dotenv from 'dotenv';
dotenv.config();
async function check() {
    const admins = await db.admin.findMany({ where: { email: 'azimsayyad90@gmail.com' }});
    console.log(`Found ${admins.length} admins.`);
    admins.forEach(a => console.log(a.id, a.email, a.password));
    process.exit();
}
check();
