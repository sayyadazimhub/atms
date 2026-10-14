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
      await PurchaseItem.create(
        lineItems.map((item) => ({ ...item, purchaseId: purchase._id })),
        { session, ordered: true },
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

        if (existingBatch) {
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
          await StockBatch.create(
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
        const revertQty = item.baseQuantity !== undefined ? item.baseQuantity : item.quantity;
        const revertCost = item.costPerBaseUnit !== undefined ? item.costPerBaseUnit : item.unitPrice;

        await Product.updateOne(
          { _id: item.productId, userId },
          { $inc: { currentStock: -revertQty } },
          { session },
        );

        const batch = await StockBatch.findOne({
          productId: item.productId,
          userId,
          purchasePrice: revertCost,
        }).session(session);

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
