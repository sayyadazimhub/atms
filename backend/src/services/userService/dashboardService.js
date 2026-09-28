import { dashboardDal } from '../../dal/userDal/dashboardDal.js';

export const dashboardService = {
  async getDashboardData(userId, startDateParam, endDateParam) {
    let dateFilter = {};
    if (startDateParam && endDateParam) {
      dateFilter.createdAt = {
        $gte: new Date(startDateParam),
        $lte: new Date(endDateParam),
      };
    }

    const [
      [salesAgg, salesDue, purchasesAgg, purchasesDue, lowStock],
      [salesRaw, purchasesRaw],
      [recentSales, recentPurchases, topProductsRaw, topCustomersRaw, topProvidersRaw],
    ] = await Promise.all([
      dashboardDal.getBaseStats(userId, dateFilter),
      dashboardDal.getRawTransactions(userId, dateFilter),
      dashboardDal.getSecondaryStats(userId, dateFilter),
    ]);

    // Process chart data
    const chartMap = new Map();
    salesRaw.forEach((s) => {
      const date = new Date(s.createdAt).toLocaleDateString('en-CA');
      if (!chartMap.has(date)) chartMap.set(date, { date, sales: 0, profit: 0, purchases: 0 });
      const entry = chartMap.get(date);
      entry.sales += s.totalAmount;
      entry.profit += s.totalProfit;
    });

    purchasesRaw.forEach((p) => {
      const date = new Date(p.createdAt).toLocaleDateString('en-CA');
      if (!chartMap.has(date)) chartMap.set(date, { date, sales: 0, profit: 0, purchases: 0 });
      const entry = chartMap.get(date);
      entry.purchases += p.totalAmount;
    });

    const chartData = Array.from(chartMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // Fetch details for top lists
    const [topProducts, topCustomers, topProviders] = await Promise.all([
      Promise.all(
        topProductsRaw.map(async (item) => {
          const product = await dashboardDal.getProductDetails(item.productId);
          return {
            productId: item._id,
            name: product?.name || 'Unknown',
            unit: product?.unit || '',
            totalQuantity: item.quantity,
            totalProfit: item.profit,
          };
        }),
      ),
      Promise.all(
        topCustomersRaw.map(async (item) => {
          const customer = await dashboardDal.getCustomerDetails(item.customerId);
          return {
            customerId: item._id,
            name: customer?.name || 'Walk-in',
            totalAmount: item.totalAmount,
          };
        }),
      ),
      Promise.all(
        topProvidersRaw.map(async (item) => {
          const provider = await dashboardDal.getProviderDetails(item.providerId);
          return {
            providerId: item._id,
            name: provider?.name || 'Unknown',
            totalAmount: item.totalAmount,
          };
        }),
      ),
    ]);

    return {
      summary: {
        totalSales: salesAgg.totalAmount,
        totalPurchases: purchasesAgg.totalAmount,
        totalProfit: salesAgg.totalProfit,
        totalDueToProviders: purchasesDue.dueAmount,
        totalDueFromCustomers: salesDue.dueAmount,
      },
      lowStockProducts: lowStock,
      recentTransactions: { sales: recentSales, purchases: recentPurchases },
      topProducts,
      topCustomers,
      topProviders,
      chartData,
    };
  },
};
