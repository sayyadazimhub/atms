import { connectDB } from '../../config/db.js';
import { Admin, Purchase, Sale, SystemSetting, User } from '../../models/index.js';

async function sumFields(Model, filter, fields) {
  const sums = Object.fromEntries(fields.map((field) => [field, { $sum: `$${field}` }]));
  const [result] = await Model.aggregate([{ $match: filter }, { $group: { _id: null, ...sums } }]);
  return Object.fromEntries(fields.map((field) => [field, result?.[field] ?? 0]));
}

export const dashboardDal = {
  async getStats() {
    await connectDB();
    return await Promise.all([
      User.countDocuments({ role: 'USER' }),
      User.countDocuments({ role: 'USER', is_active: true }),
      sumFields(Sale, { userId: { $ne: null } }, ['totalAmount', 'totalProfit']),
      sumFields(Purchase, { userId: { $ne: null } }, ['totalAmount']),
      Sale.countDocuments({ userId: { $ne: null } }),
      Purchase.countDocuments({ userId: { $ne: null } }),
      Admin.countDocuments(),
      Admin.countDocuments({ is_active: true }),
      SystemSetting.findOne(),
    ]);
  },

  async getRecentTraders(limit = 5) {
    await connectDB();
    return User.find({ role: 'USER' })
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .limit(limit);
  },

  async getChartData(months = 6) {
    await connectDB();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const [sales, purchases, traders] = await Promise.all([
      Sale.find({ userId: { $ne: null }, createdAt: { $gte: startDate } })
        .select('createdAt totalAmount')
        .lean(),
      Purchase.find({ userId: { $ne: null }, createdAt: { $gte: startDate } })
        .select('createdAt totalAmount')
        .lean(),
      User.find({ role: 'USER', createdAt: { $gte: startDate } })
        .select('createdAt is_active')
        .lean(),
    ]);

    return { sales, purchases, traders };
  },
};
