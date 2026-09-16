import { traderDal } from '@/dal/adminDal/traderDal';
import { hashPassword } from '@/lib/auth';

export const traderService = {
    async getTraders(search = '', page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = {
            role: 'USER',
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ]
        };

        const [traders, total, salesStats] = await Promise.all([
            traderDal.findMany(where, skip, limit),
            traderDal.count(where),
            traderDal.getTradersSalesStats()
        ]);

        const processedTraders = traders.map(t => {
            const stats = salesStats.find(s => s.userId === t.id);
            return {
                id: t.id,
                name: t.name,
                email: t.email,
                phone: t.phone || 'N/A',
                is_active: t.is_active,
                emailVerified: t.emailVerified,
                joined: t.createdAt,
                revenue: stats?._sum?.totalAmount || 0,
                profit: stats?._sum?.totalProfit || 0,
                transactions: stats?._count?.id || 0,
            };
        });

        return {
            traders: processedTraders,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        };
    },

    async getTraderDetail(id) {
        const [profile, stats, recentSales] = await Promise.all([
            traderDal.findByIdWithDetails(id),
            traderDal.getTraderBusinessStats(id),
            traderDal.getRecentSales(id, 5)
        ]);

        if (!profile) {
            throw new Error('Trader not found');
        }

        return {
            profile,
            business: {
                totalCustomers: stats.customers,
                totalProviders: stats.providers,
                totalProducts: stats.products,
                totalTransactions: stats.salesAggregate._count.id || 0,
                totalRevenue: stats.salesAggregate._sum.totalAmount || 0,
                totalProfit: stats.salesAggregate._sum.totalProfit || 0
            },
            recentSales: recentSales.map(s => ({
                id: s.id,
                customer: s.customer?.name || 'Walk-in Customer',
                amount: s.totalAmount,
                profit: s.totalProfit,
                date: s.createdAt
            }))
        };
    },

    async createTrader(data) {
        const { name, email, phone, password } = data;

        if (!name || !email || !password) {
            throw new Error('Name, email, and password are required');
        }

        const existing = await traderDal.findByEmail(email);
        if (existing) {
            throw new Error('Trader with this email already exists');
        }

        const hashedPassword = await hashPassword(password);

        return await traderDal.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role: 'USER',
            is_active: true,
            emailVerified: true
        });
    },

    async updateStatus(id, status) {
        return await traderDal.update(id, { is_active: status === 'active' });
    },

    async updateTrader(id, data) {
        if (!id) throw new Error('Trader ID is required');
        const updateData = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.phone !== undefined) updateData.phone = data.phone;
        
        return await traderDal.update(id, updateData);
    },

    async deleteTrader(id) {
        if (!id) throw new Error('Trader ID is required');
        return await traderDal.deleteTraderCascading(id);
    }
};
