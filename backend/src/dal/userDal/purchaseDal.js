import { connectDB } from '../../config/db.js';
import { Product, Provider, Purchase, PurchaseItem, StockBatch } from '../../models/index.js';
import { withTransaction } from '../transaction.js';

export const purchaseDal = {
  async findMany(userId, skip, take) {
    await connectDB();
    const query = Purchase.find({ userId })
      .populate('provider')
      .populate({ path: 'items', populate: { path: 'product' } })
      .sort({ createdAt: -1 });
    if (skip) query.skip(skip);
    if (take) query.limit(take);
    return query.exec();
  },

  async count(userId) {
    await connectDB();
    return Purchase.countDocuments({ userId });
  },

  async findProviderForUser(providerId, userId) {
    await connectDB();
    return Provider.findOne({ _id: providerId, userId });
  },

  async findProductsForUser(productIds, userId) {
    await connectDB();
    return Product.find({ _id: { $in: productIds }, userId }).select('_id');
  },

  async findById(id, userId) {
    await connectDB();
    return Purchase.findOne({ _id: id, userId })
      .populate('provider')
      .populate({ path: 'items', populate: { path: 'product' } });
  },

  async findByIdSimple(id, userId) {
    await connectDB();
    return Purchase.findOne({ _id: id, userId });
  },

  async createPurchaseWithStock(userId, providerId, totalAmount, paidAmount, dueAmount, lineItems) {
    return withTransaction(async (session) => {
      const [purchase] = await Purchase.create(
        [{ providerId, userId, totalAmount, paidAmount, dueAmount }],
        { session },
      );
      await PurchaseItem.create(
        lineItems.map((item) => ({ ...item, purchaseId: purchase._id })),
        { session },
      );

      for (const item of lineItems) {
        const productUpdate = await Product.updateOne(
          { _id: item.productId, userId },
          {
            $inc: { currentStock: item.quantity },
            $set: { baseCostPrice: item.unitPrice },
          },
          { session },
        );
        if (!productUpdate.matchedCount) throw new Error('Product not found');

        const existingBatch = await StockBatch.findOne({
          productId: item.productId,
          userId,
          purchasePrice: item.unitPrice,
        }).session(session);

        if (existingBatch) {
          await StockBatch.updateOne(
            { _id: existingBatch._id },
            { $inc: { quantity: item.quantity } },
            { session },
          );
        } else {
          await StockBatch.create(
            [
              {
                productId: item.productId,
                userId,
                purchasePrice: item.unitPrice,
                quantity: item.quantity,
              },
            ],
            { session },
          );
        }
      }

      return Purchase.findById(purchase._id)
        .session(session)
        .populate('provider')
        .populate({ path: 'items', populate: { path: 'product' } });
    });
  },

  async update(id, userId, data) {
    await connectDB();
    return Purchase.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
      runValidators: true,
    })
      .populate('provider')
      .populate({ path: 'items', populate: { path: 'product' } });
  },

  async deletePurchaseWithRollback(id, userId) {
    return withTransaction(async (session) => {
      const purchase = await Purchase.findOne({ _id: id, userId })
        .session(session)
        .populate('items');
      if (!purchase) throw new Error('Purchase not found');

      for (const item of purchase.items) {
        await Product.updateOne(
          { _id: item.productId, userId },
          { $inc: { currentStock: -item.quantity } },
          { session },
        );

        const batch = await StockBatch.findOne({
          productId: item.productId,
          userId,
          purchasePrice: item.unitPrice,
        }).session(session);

        if (batch) {
          await StockBatch.updateOne(
            { _id: batch._id },
            { $inc: { quantity: -item.quantity } },
            { session },
          );
        }
      }

      await StockBatch.deleteMany(
        {
          userId,
          productId: { $in: purchase.items.map((item) => item.productId) },
          quantity: { $lte: 0 },
        },
        { session },
      );
      await PurchaseItem.deleteMany({ purchaseId: purchase._id, userId }, { session });
      await Purchase.deleteOne({ _id: purchase._id, userId }, { session });
    });
  },
};
