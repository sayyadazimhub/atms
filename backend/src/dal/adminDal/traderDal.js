import mongoose from 'mongoose';
import { connectDB } from '../../config/db.js';
import {
  Customer,
  Product,
  Provider,
  Purchase,
  PurchaseItem,
  Sale,
  SaleItem,
  StockBatch,
  User,
} from '../../models/index.js';
import { withTransaction } from '../transaction.js';
import { escapeRegex } from '../../lib/search.js';

function buildTraderFilter(search = '') {
  const filter = { role: 'USER' };
  const normalizedSearch = escapeRegex(search.trim());
  if (normalizedSearch) {
    filter.$or = [
      { name: { $regex: normalizedSearch, $options: 'i' } },
      { email: { $regex: normalizedSearch, $options: 'i' } },
    ];
  }
  return filter;
}

export const traderDal = {
  async countActiveTraders() {
    await connectDB();
    return User.countDocuments({ role: 'USER', is_active: true });
  },

  async findMany(search, skip, take) {
    await connectDB();
    return User.find(buildTraderFilter(search))
      .select(
        'name email phone is_active emailVerified verificationStatus verificationProofUrl state district createdAt',
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(take);
  },

  async count(search) {
    await connectDB();
    return User.countDocuments(buildTraderFilter(search));
  },

  async findByEmail(email) {
    await connectDB();
    return User.findOne({ email });
  },

  async create(data) {
    await connectDB();
    return User.create(data);
  },

  async getTradersSalesStats() {
    await connectDB();
    return Sale.aggregate([
      { $match: { userId: { $ne: null } } },
      {
        $group: {
          _id: '$userId',
          totalAmount: { $sum: '$totalAmount' },
          totalProfit: { $sum: '$totalProfit' },
          transactions: { $sum: 1 },
        },
      },
    ]);
  },

  async update(id, data) {
    await connectDB();
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async findByIdWithDetails(id) {
    await connectDB();
    return User.findById(id).select(
      'name email phone is_active verificationStatus verificationProofUrl state district createdAt role',
    );
  },

  async getTraderBusinessStats(id) {
    await connectDB();
    const userId = new mongoose.Types.ObjectId(id);
    const [customers, providers, products, salesResult] = await Promise.all([
      Customer.countDocuments({ userId }),
      Provider.countDocuments({ userId }),
      Product.countDocuments({ userId }),
      Sale.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$totalAmount' },
            totalProfit: { $sum: '$totalProfit' },
            transactions: { $sum: 1 },
          },
        },
      ]),
    ]);

    return {
      customers,
      providers,
      products,
      salesAggregate: salesResult[0] || { totalAmount: 0, totalProfit: 0, transactions: 0 },
    };
  },

  async getRecentSales(id, limit = 5) {
    await connectDB();
    return Sale.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({ path: 'customer', select: 'name' });
  },

  async deleteTraderCascading(id) {
    return withTransaction(async (session) => {
      const userId = new mongoose.Types.ObjectId(id);
      await SaleItem.deleteMany({ userId }, { session });
      await Sale.deleteMany({ userId }, { session });
      await PurchaseItem.deleteMany({ userId }, { session });
      await Purchase.deleteMany({ userId }, { session });
      await StockBatch.deleteMany({ userId }, { session });
      await Customer.deleteMany({ userId }, { session });
      await Provider.deleteMany({ userId }, { session });
      await Product.deleteMany({ userId }, { session });
      return User.findByIdAndDelete(userId, { session });
    });
  },
};
