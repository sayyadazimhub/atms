import { connectDB } from '../../config/db.js';
import { Customer, Product, Sale, SaleItem, StockBatch } from '../../models/index.js';
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

  async findCustomerForUser(customerId, userId) {
    await connectDB();
    return Customer.findOne({ _id: customerId, userId });
  },

  async findStockBatchForUser(batchId, productId, userId) {
    await connectDB();
    return StockBatch.findOne({ _id: batchId, productId, userId });
  },

  async findActiveBatchesForProduct(productId, userId) {
    await connectDB();
    return StockBatch.find({ productId, userId, quantity: { $gt: 0 } }).sort({ createdAt: 1 });
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
    subtotal,
    laborCharge,
    vehicleRent,
    otherCharges,
    totalAmount,
    paidAmount,
    dueAmount,
    totalProfit,
    lineItems,
  ) {
    return withTransaction(async (session) => {
      const [sale] = await Sale.create(
        [
          {
            customerId,
            userId,
            subtotal,
            laborCharge,
            vehicleRent,
            otherCharges,
            totalAmount,
            paidAmount,
            dueAmount,
            totalProfit,
          },
        ],
        { session },
      );
      await SaleItem.create(
        lineItems.map((item) => ({ ...item, saleId: sale._id, userId })),
        { session, ordered: true },
      );

      for (const item of lineItems) {
        const deductQty = item.baseQuantity !== undefined ? item.baseQuantity : item.quantity;

        if (item.batchAllocations && item.batchAllocations.length > 0) {
          for (const alloc of item.batchAllocations) {
            const allocDeduct = parseFloat(alloc.quantity) || 0;
            const batchUpdate = await StockBatch.updateOne(
              { _id: alloc.batchId, userId, quantity: { $gte: allocDeduct } },
              { $inc: { quantity: -allocDeduct } },
              { session },
            );
            if (!batchUpdate.matchedCount) {
              throw new Error('Insufficient stock in one of the selected batches');
            }
          }
        } else if (item.batchId) {
          const batchUpdate = await StockBatch.updateOne(
            { _id: item.batchId, userId, quantity: { $gte: deductQty } },
            { $inc: { quantity: -deductQty } },
            { session },
          );
          if (!batchUpdate.matchedCount) {
            throw new Error('Insufficient stock in selected batch');
          }
        } else {
          let remainingToDeduct = deductQty;
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

        const productUpdate = await Product.updateOne(
          { _id: item.productId, userId, currentStock: { $gte: deductQty } },
          { $inc: { currentStock: -deductQty } },
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
        const restoreQty = item.baseQuantity !== undefined ? item.baseQuantity : item.quantity;

        await Product.updateOne(
          { _id: item.productId, userId },
          { $inc: { currentStock: restoreQty } },
          { session },
        );

        if (item.batchId) {
          const batchUpdate = await StockBatch.updateOne(
            { _id: item.batchId, userId },
            { $inc: { quantity: restoreQty } },
            { session },
          );
          if (!batchUpdate.matchedCount) {
            await StockBatch.create(
              [
                {
                  _id: item.batchId,
                  productId: item.productId,
                  userId,
                  purchasePrice: item.costPrice,
                  quantity: restoreQty,
                },
              ],
              { session },
            );
          }
        } else {
          const existingBatch = await StockBatch.findOne({
            productId: item.productId,
            userId,
            purchasePrice: item.costPrice,
          }).session(session);

          if (existingBatch) {
            await StockBatch.updateOne(
              { _id: existingBatch._id },
              { $inc: { quantity: restoreQty } },
              { session },
            );
          } else {
            await StockBatch.create(
              [
                {
                  productId: item.productId,
                  userId,
                  purchasePrice: item.costPrice,
                  quantity: restoreQty,
                },
              ],
              { session },
            );
          }
        }
      }

      await SaleItem.deleteMany({ saleId: sale._id, userId }, { session });
      await Sale.deleteOne({ _id: sale._id, userId }, { session });
    });
  },
};
