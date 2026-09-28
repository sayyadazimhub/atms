import { connectDB } from '../../config/db.js';
import { Product, Sale, SaleItem, StockBatch } from '../../models/index.js';
import { withTransaction } from '../transaction.js';

export const saleDal = {
  async findMany(userId, skip, take) {
    await connectDB();
    const query = Sale.find({ userId })
      .populate('customer')
      .populate({ path: 'items', populate: { path: 'product' } })
      .sort({ createdAt: -1 });
    if (skip) query.skip(skip);
    if (take) query.limit(take);
    return query.exec();
  },

  async count(userId) {
    await connectDB();
    return Sale.countDocuments({ userId });
  },

  async findProductForUser(productId, userId) {
    await connectDB();
    return Product.findOne({ _id: productId, userId });
  },

  async findStockBatchForUser(batchId, userId) {
    await connectDB();
    return StockBatch.findOne({ _id: batchId, userId });
  },

  async findById(id, userId) {
    await connectDB();
    return Sale.findOne({ _id: id, userId })
      .populate('customer')
      .populate({ path: 'items', populate: { path: 'product' } });
  },

  async findByIdSimple(id, userId) {
    await connectDB();
    return Sale.findOne({ _id: id, userId });
  },

  async createSaleWithStock(
    userId,
    customerId,
    totalAmount,
    paidAmount,
    dueAmount,
    totalProfit,
    lineItems,
  ) {
    return withTransaction(async (session) => {
      const [sale] = await Sale.create(
        [{ customerId, userId, totalAmount, paidAmount, dueAmount, totalProfit }],
        { session },
      );
      await SaleItem.create(
        lineItems.map((item) => ({ ...item, saleId: sale._id, userId })),
        { session },
      );

      for (const item of lineItems) {
        if (item.batchId) {
          const batchUpdate = await StockBatch.updateOne(
            { _id: item.batchId, userId, quantity: { $gte: item.quantity } },
            { $inc: { quantity: -item.quantity } },
            { session },
          );
          if (!batchUpdate.matchedCount) {
            throw new Error('Insufficient stock in selected batch');
          }
        } else {
          let remainingToDeduct = item.quantity;
          const batches = await StockBatch.find({
            productId: item.productId,
            userId,
            quantity: { $gt: 0 },
          })
            .sort({ createdAt: 1 })
            .session(session);

          for (const batch of batches) {
            if (remainingToDeduct <= 0) break;
            const deductAmount = Math.min(batch.quantity, remainingToDeduct);
            await StockBatch.updateOne(
              { _id: batch._id, userId, quantity: { $gte: deductAmount } },
              { $inc: { quantity: -deductAmount } },
              { session },
            );
            remainingToDeduct -= deductAmount;
          }
          if (remainingToDeduct > 0) throw new Error('Insufficient stock in available batches');
        }

        await StockBatch.deleteMany(
          { productId: item.productId, userId, quantity: { $lte: 0 } },
          { session },
        );

        const productUpdate = await Product.updateOne(
          { _id: item.productId, userId, currentStock: { $gte: item.quantity } },
          { $inc: { currentStock: -item.quantity } },
          { session },
        );
        if (!productUpdate.matchedCount) throw new Error('Insufficient stock');
      }

      return Sale.findById(sale._id)
        .session(session)
        .populate('customer')
        .populate({ path: 'items', populate: { path: 'product' } });
    });
  },

  async update(id, userId, data) {
    await connectDB();
    return Sale.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
      runValidators: true,
    })
      .populate('customer')
      .populate({ path: 'items', populate: { path: 'product' } });
  },

  async deleteSaleWithRollback(id, userId) {
    return withTransaction(async (session) => {
      const sale = await Sale.findOne({ _id: id, userId }).session(session).populate('items');
      if (!sale) throw new Error('Sale not found');

      for (const item of sale.items) {
        await Product.updateOne(
          { _id: item.productId, userId },
          { $inc: { currentStock: item.quantity } },
          { session },
        );

        if (item.batchId) {
          await StockBatch.updateOne(
            { _id: item.batchId, userId },
            { $inc: { quantity: item.quantity } },
            { session },
          );
        }
      }

      await SaleItem.deleteMany({ saleId: sale._id, userId }, { session });
      await Sale.deleteOne({ _id: sale._id, userId }, { session });
    });
  },
};
