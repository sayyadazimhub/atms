import { connectDB } from '../../config/db.js';
import { Product, Sale, SaleItem, User } from '../../models/index.js';

export const reportDal = {
  async getOverallStats(where) {
    await connectDB();
    const [result] = await Sale.aggregate([
      { $match: where },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalAmount' },
          totalProfit: { $sum: '$totalProfit' },
          transactionCount: { $sum: 1 },
        },
      },
    ]);
    return result ?? { totalAmount: 0, totalProfit: 0, transactionCount: 0 };
  },

  async getTraderPerformance(where, take = 5) {
    await connectDB();
    return Sale.aggregate([
      { $match: where },
      {
        $group: {
          _id: '$userId',
          totalAmount: { $sum: '$totalAmount' },
          totalProfit: { $sum: '$totalProfit' },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: take },
    ]);
  },

  async getRecentSalesForTimeline(since) {
    await connectDB();
    return Sale.find({ createdAt: { $gte: since }, userId: { $ne: null } })
      .select('createdAt totalAmount totalProfit')
      .sort({ createdAt: 1 });
  },

  async getTradersByIds(ids) {
    await connectDB();
    return User.find({ _id: { $in: ids } }).select('name');
  },

  async getItemStats(where, take = 4) {
    await connectDB();
    return SaleItem.aggregate([
      { $match: where },
      { $group: { _id: '$productId', quantity: { $sum: '$quantity' } } },
      { $sort: { quantity: -1 } },
      { $limit: take },
    ]);
  },

  async getProductsByIds(ids) {
    await connectDB();
    return Product.find({ _id: { $in: ids } }).select('name');
  },

  async getTraderCount() {
    await connectDB();
    return User.countDocuments({ role: 'USER' });
  },

  async getProductCount() {
    await connectDB();
    return Product.countDocuments();
  },
};
