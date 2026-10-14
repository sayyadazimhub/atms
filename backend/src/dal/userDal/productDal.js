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

  async combineBatches(productId, userId, batchAllocations, customBatchNumber) {
    await connectDB();
    return withTransaction(async (session) => {
      const product = await Product.findOne({ _id: productId, userId }).session(session);
      if (!product) throw new Error('Product not found');

      let totalMergedQty = 0;
      let totalMergedCost = 0;

      for (const alloc of batchAllocations) {
        const allocQty = parseFloat(alloc.quantity) || 0;
        if (allocQty <= 0) continue;

        const batch = await StockBatch.findOne({ _id: alloc.batchId, productId, userId }).session(session);
        if (!batch) throw new Error(`Batch ${alloc.batchId} not found`);
        if (batch.quantity < allocQty) {
          throw new Error(`Insufficient stock in batch ${batch.batchNumber || batch._id}. Available: ${batch.quantity}`);
        }

        // Deduct from source batch
        await StockBatch.updateOne(
          { _id: batch._id, userId },
          { $inc: { quantity: -allocQty } },
          { session }
        );

        totalMergedQty += allocQty;
        totalMergedCost += allocQty * (batch.purchasePrice || 0);
      }

      if (totalMergedQty <= 0) {
        throw new Error('Total combined quantity must be greater than 0');
      }

      const weightedAvgPrice = totalMergedCost / totalMergedQty;

      // Determine new batch number
      let batchNumber = customBatchNumber?.trim();
      if (!batchNumber) {
        const totalBatches = await StockBatch.countDocuments({ userId }).session(session);
        batchNumber = `BCH-${1001 + totalBatches}-COMBINED`;
      }

      // Create new combined batch
      const [newBatch] = await StockBatch.create(
        [
          {
            productId,
            userId,
            batchNumber,
            purchasePrice: parseFloat(weightedAvgPrice.toFixed(2)),
            quantity: parseFloat(totalMergedQty.toFixed(2)),
          },
        ],
        { session }
      );

      // Re-calculate weighted average cost for product across all active batches
      const allActiveBatches = await StockBatch.find({ productId, userId, quantity: { $gt: 0 } }).session(session);
      let overallQty = 0;
      let overallCost = 0;
      for (const b of allActiveBatches) {
        overallQty += b.quantity;
        overallCost += b.quantity * b.purchasePrice;
      }
      if (overallQty > 0) {
        const newProductBaseCost = overallCost / overallQty;
        await Product.updateOne(
          { _id: productId, userId },
          { baseCostPrice: parseFloat(newProductBaseCost.toFixed(2)) },
          { session }
        );
      }

      return {
        message: 'Batches combined successfully',
        mergedBatch: newBatch,
        weightedAvgPrice: parseFloat(weightedAvgPrice.toFixed(2)),
        totalMergedQty: parseFloat(totalMergedQty.toFixed(2)),
      };
    });
  },
};
