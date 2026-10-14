import { connectDB } from '../../config/db.js';
import { Product, StockBatch } from '../../models/index.js';
import { withTransaction } from '../transaction.js';

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

  async findById(id, userId) {
    await connectDB();
    return Product.findOne({ _id: id, userId });
  },

  async create(data) {
    await connectDB();
    return Product.create(data);
  },

  async createWithStock(productData, openingStock = 0, costPrice = 0) {
    await connectDB();
    const qty = parseFloat(openingStock) || 0;
    if (qty <= 0) {
      return Product.create(productData);
    }
    return withTransaction(async (session) => {
      const [product] = await Product.create([{ ...productData, currentStock: qty }], { session });
      const totalBatches = await StockBatch.countDocuments({ userId: productData.userId }).session(session);
      const batchNumber = `BCH-${1001 + totalBatches}`;
      await StockBatch.create(
        [
          {
            productId: product._id,
            userId: productData.userId,
            batchNumber,
            purchasePrice: costPrice,
            quantity: qty,
          },
        ],
        { session },
      );
      return product;
    });
  },

  async update(id, userId, data) {
    await connectDB();
    return Product.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
      runValidators: true,
    });
  },

  async delete(id, userId) {
    await connectDB();
    return Product.findOneAndDelete({ _id: id, userId });
  },
};
