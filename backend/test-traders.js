import { PrismaClient } from '@prisma/client';
import { traderService } from './src/services/adminService/traderService.js';

const prisma = new PrismaClient();

async function run() {
    try {
        console.log("Fetching traders...");
        const data = await traderService.getTraders('', 1, 10);
        console.log("Success:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

run();
