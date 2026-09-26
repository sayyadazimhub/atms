import { authService } from './src/services/adminService/authService.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        console.log('Testing login...');
        const result = await authService.login('azimsayyad90@gmail.com', 'password123');
        console.log('Login successful!', result);
    } catch (err) {
        console.error('Login failed:', err.message);
    } finally {
        process.exit();
    }
}
test();
