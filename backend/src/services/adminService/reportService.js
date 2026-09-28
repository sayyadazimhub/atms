import { reportDal } from '../../dal/adminDal/reportDal.js';

export const reportService = {
  async getAdminReports(range = '30d') {
    const now = new Date();
    let startDate = null;
    if (range === '7d') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (range === '30d') {
      startDate = new Date(now.setDate(now.getDate() - 30));
    } else if (range === '90d') {
      startDate = new Date(now.setDate(now.getDate() - 90));
    }
    if (startDate) startDate.setHours(0, 0, 0, 0);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const whereClause = startDate
      ? {
          createdAt: { $gte: startDate },
          userId: { $ne: null },
        }
      : { userId: { $ne: null } };

    const [overallStats, tradersBaseStats, recentSales, traderCount, productCount] =
      await Promise.all([
        reportDal.getOverallStats(whereClause),
        reportDal.getTraderPerformance(whereClause),
        reportDal.getRecentSalesForTimeline(sixMonthsAgo),
        reportDal.getTraderCount(),
        reportDal.getProductCount(),
      ]);

    // Process Timeline Data
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthlyAggregation = {};
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mKey = `${monthNames[d.getMonth()]}`;
      monthlyAggregation[mKey] = { month: mKey, revenue: 0, profit: 0, order: 6 - i };
    }

    recentSales.forEach((sale) => {
      const mKey = monthNames[new Date(sale.createdAt).getMonth()];
      if (monthlyAggregation[mKey]) {
        monthlyAggregation[mKey].revenue += sale.totalAmount;
        monthlyAggregation[mKey].profit += sale.totalProfit;
      }
    });
    const revenueData = Object.values(monthlyAggregation).sort((a, b) => a.order - b.order);

    // Process Trader Performance
    const userIds = tradersBaseStats.map((stat) => stat._id).filter(Boolean);
    const tradersList = await reportDal.getTradersByIds(userIds);
    const traderPerformance = tradersBaseStats
      .map((stat) => {
        const trader = tradersList.find((user) => user.id === String(stat._id));
        if (!trader) return null;
        return {
          name: trader.name,
          volume: stat.totalAmount || 0,
          profit: stat.totalProfit || 0,
        };
      })
      .filter(Boolean);

    // Process Category Share
    const itemFilter = { userId: { $ne: null } };
    if (startDate) itemFilter.createdAt = { $gte: startDate };
    const itemStats = await reportDal.getItemStats(itemFilter);
    const products = await reportDal.getProductsByIds(itemStats.map((s) => s.productId));
    const categoryShare = itemStats.map((stat) => ({
      name: products.find((product) => product.id === String(stat._id))?.name || 'Commodity',
      value: stat.quantity || 0,
    }));

    return {
      revenueData,
      traderPerformance:
        traderPerformance.length > 0
          ? traderPerformance
          : [{ name: 'No Data Yet', volume: 0, profit: 0 }],
      categoryShare: categoryShare.length > 0 ? categoryShare : [{ name: 'No Sales', value: 100 }],
      metrics: {
        totalRevenue: overallStats.totalAmount || 0,
        totalProfit: overallStats.totalProfit || 0,
        traderCount,
        transactionCount: overallStats.transactionCount,
      },
    };
  },
};
