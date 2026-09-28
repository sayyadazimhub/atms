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

  async findByIdWithSales(id) {
    await connectDB();
    return Customer.findById(id).populate({
      path: 'sales',
      options: { sort: { createdAt: -1 } },
      populate: { path: 'items', populate: { path: 'product' } },
    });
  },

  async create(data) {
    await connectDB();
    return Customer.create(data);
  },

  async update(id, data) {
    await connectDB();
    return Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async delete(id) {
    await connectDB();
    return Customer.findByIdAndDelete(id);
  },
};
