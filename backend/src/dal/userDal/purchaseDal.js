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
    return Product.find({ _id: { $in: productIds }, userId });
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

  async createPurchaseWithStock(
    userId,
    providerId,
    subtotal,
    laborCharge,
    vehicleRent,
    otherCharges,
    totalAmount,
    paidAmount,
    dueAmount,
    lineItems,
  ) {
    return withTransaction(async (session) => {
      const [purchase] = await Purchase.create(
        [
          {
            providerId,
            userId,
            subtotal,
            laborCharge,
            vehicleRent,
            otherCharges,
            totalAmount,
            paidAmount,
            dueAmount,
          },
        ],
        { session },
      );
      for (const item of lineItems) {
        const baseQty = item.baseQuantity !== undefined ? item.baseQuantity : item.quantity;
        const baseCost = item.costPerBaseUnit !== undefined ? item.costPerBaseUnit : item.unitPrice;

        const productUpdate = await Product.updateOne(
          { _id: item.productId, userId },
          {
            $inc: { currentStock: baseQty },
            $set: { baseCostPrice: baseCost },
          },
          { session },
        );
        if (!productUpdate.matchedCount) throw new Error('Product not found');

        const existingBatch = await StockBatch.findOne({
          productId: item.productId,
          userId,
          purchasePrice: baseCost,
        }).session(session);

        let linkedBatchId;
        if (existingBatch) {
          linkedBatchId = existingBatch._id;
          const updateFields = { $inc: { quantity: baseQty } };
          if (!existingBatch.batchNumber) {
            const count = await StockBatch.countDocuments({ userId }).session(session);
            updateFields.$set = { batchNumber: `BCH-${1000 + count}` };
          }
          await StockBatch.updateOne(
            { _id: existingBatch._id },
            updateFields,
            { session },
          );
        } else {
          const totalBatches = await StockBatch.countDocuments({ userId }).session(session);
          const nextBatchNumber = `BCH-${1001 + totalBatches}`;
          const [newBatch] = await StockBatch.create(
            [
              {
                productId: item.productId,
                userId,
                batchNumber: item.batchNumber || nextBatchNumber,
                purchasePrice: baseCost,
                quantity: baseQty,
              },
            ],
            { session },
          );
          linkedBatchId = newBatch._id;
        }

        item.batchId = linkedBatchId;
      }

      await PurchaseItem.create(
        lineItems.map((item) => ({ ...item, purchaseId: purchase._id })),
        { session, ordered: true },
      );

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
        .populate({ path: 'items', populate: { path: 'product' } });
      if (!purchase) throw new Error('Purchase not found');

      // Validation pass: Ensure all batches still have sufficient stock and were not combined or consumed
      for (const item of purchase.items) {
        const revertQty = item.baseQuantity !== undefined ? item.baseQuantity : item.quantity;
        const revertCost = item.costPerBaseUnit !== undefined ? item.costPerBaseUnit : item.unitPrice;
        const productName = item.product?.name || 'Product';

        // Check overall product stock first
        const product = await Product.findOne({ _id: item.productId, userId }).session(session);
        if (!product || product.currentStock < revertQty) {
          throw new Error(
            `Cannot delete purchase: ${productName} stock has already been sold or consumed. Current stock (${product?.currentStock || 0}) is less than purchase quantity (${revertQty}).`
          );
        }

        // Check specific batch
        let batch = null;
        if (item.batchId) {
          batch = await StockBatch.findOne({ _id: item.batchId, userId }).session(session);
        }
        if (!batch) {
          batch = await StockBatch.findOne({
            productId: item.productId,
            userId,
            purchasePrice: revertCost,
          }).session(session);
        }

        if (!batch || batch.quantity < revertQty) {
          const availableInBatch = batch ? batch.quantity : 0;
          const batchTag = batch?.batchNumber ? `batch ${batch.batchNumber}` : 'its stock batch';
          throw new Error(
            `Cannot delete purchase: ${productName} in ${batchTag} has already been combined or sold. Available in batch: ${availableInBatch}, required to rollback: ${revertQty}.`
          );
        }
      }

      // Execution pass: Revert stock and batches cleanly
      for (const item of purchase.items) {
        const revertQty = item.baseQuantity !== undefined ? item.baseQuantity : item.quantity;
        const revertCost = item.costPerBaseUnit !== undefined ? item.costPerBaseUnit : item.unitPrice;

        await Product.updateOne(
          { _id: item.productId, userId },
          { $inc: { currentStock: -revertQty } },
          { session },
        );

        let batch = null;
        if (item.batchId) {
          batch = await StockBatch.findOne({ _id: item.batchId, userId }).session(session);
        }
        if (!batch) {
          batch = await StockBatch.findOne({
            productId: item.productId,
            userId,
            purchasePrice: revertCost,
          }).session(session);
        }

        if (batch) {
          await StockBatch.updateOne(
            { _id: batch._id },
            { $inc: { quantity: -revertQty } },
            { session },
          );
        }
      }

      await PurchaseItem.deleteMany({ purchaseId: purchase._id, userId }, { session });
      await Purchase.deleteOne({ _id: purchase._id, userId }, { session });
    });
  },
};
