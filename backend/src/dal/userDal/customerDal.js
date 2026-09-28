import { connectDB } from '../../config/db.js';
import { Customer } from '../../models/index.js';

export const customerDal = {
  async findMany(where, skip, take) {
    await connectDB();
    const query = Customer.find(where).sort({ name: 1 });
    if (skip) query.skip(skip);
    if (take) query.limit(take);
    return query.exec();
  },

  async count(where) {
    await connectDB();
    return Customer.countDocuments(where);
  },

  async findByIdWithSales(id, userId) {
    await connectDB();
    return Customer.findOne({ _id: id, userId }).populate({
      path: 'sales',
      options: { sort: { createdAt: -1 } },
      populate: { path: 'items', populate: { path: 'product' } },
    });
  },

  async create(data) {
    await connectDB();
    return Customer.create(data);
  },

  async update(id, userId, data) {
    await connectDB();
    return Customer.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
      runValidators: true,
    });
  },

  async delete(id, userId) {
    await connectDB();
    return Customer.findOneAndDelete({ _id: id, userId });
  },
};
