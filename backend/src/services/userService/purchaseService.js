import { purchaseDal } from '../../dal/userDal/purchaseDal.js';

export const purchaseService = {
  async getPurchases(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [purchases, total] = await Promise.all([
      purchaseDal.findMany(userId, skip, limit),
      purchaseDal.count(userId),
    ]);

    return {
      purchases,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getPurchaseById(id, userId) {
    const purchase = await purchaseDal.findById(id, userId);
    if (!purchase) throw new Error('Purchase not found');
    return purchase;
  },

  async createPurchase(userId, data) {
    const { providerId, items, paidAmount = 0 } = data;
    if (!providerId || !Array.isArray(items) || items.length === 0) {
      throw new Error('Provider and at least one item are required');
    }

    let totalAmount = 0;
    const lineItems = items.map((it) => {
      const qty = parseFloat(it.quantity) || 0;
      const price = parseFloat(it.unitPrice) || 0;
      const total = qty * price;
      totalAmount += total;
      return {
        productId: it.productId,
        quantity: qty,
        unitPrice: price,
        totalPrice: total,
        userId: userId,
      };
    });

    const paid = parseFloat(paidAmount) || 0;
    const dueAmount = totalAmount - paid;

    return await purchaseDal.createPurchaseWithStock(
      userId,
      providerId,
      totalAmount,
      paid,
      dueAmount,
      lineItems,
    );
  },

  async updatePayment(id, userId, paidAmount) {
    if (paidAmount === undefined) throw new Error('paidAmount is required');

    const purchase = await purchaseDal.findByIdSimple(id, userId);
    if (!purchase) throw new Error('Purchase not found');

    const paid = parseFloat(paidAmount) || 0;
    const dueAmount = purchase.totalAmount - paid;

    return await purchaseDal.update(id, userId, {
      paidAmount: paid,
      dueAmount,
    });
  },

  async deletePurchase(id, userId) {
    return await purchaseDal.deletePurchaseWithRollback(id, userId);
  },
};
