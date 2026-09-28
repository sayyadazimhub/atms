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

  async findByIdWithPurchases(id, userId) {
    await connectDB();
    return Provider.findOne({ _id: id, userId }).populate({
      path: 'purchases',
      options: { sort: { createdAt: -1 } },
      populate: { path: 'items', populate: { path: 'product' } },
    });
  },

  async create(data) {
    await connectDB();
    return Provider.create(data);
  },

  async update(id, userId, data) {
    await connectDB();
    return Provider.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
      runValidators: true,
    });
  },

  async delete(id, userId) {
    await connectDB();
    return Provider.findOneAndDelete({ _id: id, userId });
  },
};
