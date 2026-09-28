import { connectDB } from '../../config/db.js';
import { Purchase, Sale } from '../../models/index.js';

export const reportDal = {
  async getSales(where) {
    await connectDB();
    return Sale.find(where)
      .populate('customer')
      .populate({ path: 'items', populate: { path: 'product' } })
      .sort({ createdAt: -1 });
  },

  async getPurchases(where) {
    await connectDB();
    return Purchase.find(where)
      .populate('provider')
      .populate({ path: 'items', populate: { path: 'product' } })
      .sort({ createdAt: -1 });
  },
};
