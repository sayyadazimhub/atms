import mongoose from 'mongoose';
import { connectDB } from '../../config/db.js';
import { Customer, Product, Provider, Purchase, Sale, SaleItem } from '../../models/index.js';

async function sumFields(Model, filter, fields) {
  const sums = Object.fromEntries(fields.map((field) => [field, { $sum: `$${field}` }]));
  const [result] = await Model.aggregate([{ $match: filter }, { $group: { _id: null, ...sums } }]);
  return Object.fromEntries(fields.map((field) => [field, result?.[field] ?? 0]));
}

async function topGroups(Model, filter, groupField, sumBy, limit) {
  const sums = Object.fromEntries(sumBy.map((field) => [field, { $sum: `$${field}` }]));
  return Model.aggregate([
    { $match: filter },
    { $group: { _id: `$${groupField}`, ...sums } },
    { $sort: { [sumBy[0]]: -1 } },
    { $limit: limit },
  ]);
}

export const dashboardDal = {
  async getBaseStats(userId, dateFilter) {
    await connectDB();
    const ownerId = new mongoose.Types.ObjectId(userId);
    const filter = { ...dateFilter, userId: ownerId };
    return await Promise.all([
      sumFields(Sale, filter, ['totalAmount', 'totalProfit']),
      sumFields(Sale, { userId: ownerId }, ['dueAmount']),
      sumFields(Purchase, filter, ['totalAmount', 'paidAmount', 'dueAmount']),
      sumFields(Purchase, { userId: ownerId }, ['dueAmount']),
      Product.find({ userId, currentStock: { $lte: 10 } })
        .sort({ currentStock: 1 })
        .limit(10),
    ]);
  },

  async getRawTransactions(userId, dateFilter) {
    await connectDB();
    const filter = { ...dateFilter, userId };
    return await Promise.all([
      Sale.find(filter).select('createdAt totalAmount totalProfit').sort({ createdAt: 1 }),
      Purchase.find(filter).select('createdAt totalAmount').sort({ createdAt: 1 }),
    ]);
  },

  async getSecondaryStats(userId, dateFilter) {
    await connectDB();
    const filter = { ...dateFilter, userId: new mongoose.Types.ObjectId(userId) };
    return await Promise.all([
      Sale.find(filter)
        .populate('customer')
        .populate({ path: 'items', populate: { path: 'product' } })
        .sort({ createdAt: -1 })
        .limit(5),
      Purchase.find(filter)
        .populate('provider')
        .populate({ path: 'items', populate: { path: 'product' } })
        .sort({ createdAt: -1 })
        .limit(5),
      topGroups(SaleItem, filter, 'productId', ['quantity', 'profit'], 5),
      topGroups(Sale, filter, 'customerId', ['totalAmount'], 5),
      topGroups(Purchase, filter, 'providerId', ['totalAmount'], 5),
    ]);
  },

  async getProductDetails(id) {
    await connectDB();
    return Product.findById(id).select('name unit');
  },

  async getCustomerDetails(id) {
    await connectDB();
    return Customer.findById(id).select('name');
  },

  async getProviderDetails(id) {
    await connectDB();
    return Provider.findById(id).select('name');
  },
};
