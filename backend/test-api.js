import { generateToken } from './src/lib/auth.js';

const run = async () => {
    try {
        const token = await generateToken({
            id: '69a57176152fd94dfaadf122', 
            email: 'azimsayyad90@gmail.com', 
            role: 'ADMIN' 
        });

        const res = await fetch('http://localhost:5000/api/admin/traders', {
            headers: { 'Cookie': `auth-token=${token}` }
        });
        console.log("Traders Status:", res.status);
        const data = await res.text();
        console.log("Traders Response:", data);
    } catch (e) {
        console.error(e);
    }
};
run();
