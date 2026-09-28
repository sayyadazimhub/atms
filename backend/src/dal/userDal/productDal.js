import { connectDB } from '../../config/db.js';
import { Product } from '../../models/index.js';

export const productDal = {
  async findMany(where, skip, take) {
    await connectDB();
    const query = Product.find(where)
      .populate({
        path: 'batches',
        match: { quantity: { $gt: 0 } },
        options: { sort: { createdAt: 1 } },
      })
      .populate({
        path: 'purchaseItems',
        select: 'unitPrice',
        options: { sort: { createdAt: -1 } },
        perDocumentLimit: 1,
      })
      .sort({ name: 1 });
    if (skip) query.skip(skip);
    if (take) query.limit(take);
    return query.exec();
  },

  async count(where) {
    await connectDB();
    return Product.countDocuments(where);
  },

  async findById(id) {
    await connectDB();
    return Product.findById(id);
  },

  async create(data) {
    await connectDB();
    return Product.create(data);
  },

  async update(id, data) {
    await connectDB();
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async delete(id) {
    await connectDB();
    return Product.findByIdAndDelete(id);
  },
};
