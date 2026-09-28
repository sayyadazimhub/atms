import { connectDB } from '../../config/db.js';
import { Provider } from '../../models/index.js';

export const providerDal = {
  async findMany(where, skip, take) {
    await connectDB();
    const query = Provider.find(where).sort({ name: 1 });
    if (skip) query.skip(skip);
    if (take) query.limit(take);
    return query.exec();
  },

  async count(where) {
    await connectDB();
    return Provider.countDocuments(where);
  },

  async findByIdWithPurchases(id) {
    await connectDB();
    return Provider.findById(id).populate({
      path: 'purchases',
      options: { sort: { createdAt: -1 } },
      populate: { path: 'items', populate: { path: 'product' } },
    });
  },

  async create(data) {
    await connectDB();
    return Provider.create(data);
  },

  async update(id, data) {
    await connectDB();
    return Provider.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async delete(id) {
    await connectDB();
    return Provider.findByIdAndDelete(id);
  },
};
