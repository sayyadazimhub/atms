import { dashboardDal } from '../../dal/adminDal/dashboardDal.js';

export const dashboardService = {
    async getDashboardData() {
        const [
            [totalTraders, activeTraders, salesAgg, purchasesAgg, salesCount, purchasesCount, totalAdmins, activeAdmins, systemSetting],
            recentTradersRaw,
            { sales, purchases, traders }
        ] = await Promise.all([
            dashboardDal.getStats(),
            dashboardDal.getRecentTraders(5),
            dashboardDal.getChartData(12)
        ]);

        // Process chart data
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = {};

        for (let i = 11; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const mKey = monthNames[d.getMonth()];
            monthlyData[mKey] = { name: mKey, volume: 0, activeTraders: 0, suspendedTraders: 0 };
        }

        sales.forEach(s => {
            const mKey = monthNames[new Date(s.createdAt).getMonth()];
            if (monthlyData[mKey]) monthlyData[mKey].volume += s.totalAmount;
        });
        purchases.forEach(p => {
            const mKey = monthNames[new Date(p.createdAt).getMonth()];
            if (monthlyData[mKey]) monthlyData[mKey].volume += p.totalAmount;
        });
        traders.forEach(t => {
            const mKey = monthNames[new Date(t.createdAt).getMonth()];
            if (monthlyData[mKey]) {
                if (t.is_active !== false) {
                    monthlyData[mKey].activeTraders += 1;
                } else {
                    monthlyData[mKey].suspendedTraders += 1;
                }
            }
        });

        return {
            summary: {
                totalTraders,
                activeTraders,
                totalAdmins,
                activeAdmins,
                maintenanceMode: systemSetting?.maintenanceMode || false,
                totalTransactions: salesCount,
                totalVolume: salesAgg._sum.totalAmount || 0,
                totalProfit: salesAgg._sum.totalProfit || 0,
            },
            chartData: Object.values(monthlyData),
            recentTraders: recentTradersRaw.map(t => ({
                ...t,
                joined: t.createdAt
            }))
        };
    }
};
