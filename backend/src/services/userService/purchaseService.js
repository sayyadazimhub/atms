import { purchaseDal } from '../../dal/userDal/purchaseDal.js';
import { getConversionFactor } from '../../utils/unitConverter.js';

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
    const {
      providerId,
      items,
      paidAmount = 0,
      laborCharge = 0,
      vehicleRent = 0,
      otherCharges = 0,
    } = data;
    if (!providerId || !Array.isArray(items) || items.length === 0) {
      throw new Error('Provider and at least one item are required');
    }

    const [provider, products] = await Promise.all([
      purchaseDal.findProviderForUser(providerId, userId),
      purchaseDal.findProductsForUser(
        items.map((item) => item.productId),
        userId,
      ),
    ]);
    if (!provider) throw new Error('Provider not found');
    const productMap = new Map(products.map((product) => [String(product.id || product._id), product]));
    if (items.some((item) => !productMap.has(String(item.productId)))) {
      throw new Error('One or more products were not found');
    }

    let subtotal = 0;
    const lineItems = items.map((it) => {
      const product = productMap.get(String(it.productId));
      const qty = parseFloat(it.quantity) || 0;
      const price = parseFloat(it.unitPrice) || 0;

      const itemUnit = it.unit || product?.unit || 'KG';
      const factor = getConversionFactor(itemUnit, product?.unit);
      const baseQuantity = qty * factor;
      const total = baseQuantity * price;
      subtotal += total;

      return {
        productId: it.productId,
        quantity: qty,
        unit: itemUnit,
        baseQuantity: baseQuantity,
        unitPrice: price,
        totalPrice: total,
        costPerBaseUnit: price,
        userId: userId,
      };
    });

    const parsedLabor = parseFloat(laborCharge) || 0;
    const parsedRent = parseFloat(vehicleRent) || 0;
    const parsedOther = parseFloat(otherCharges) || 0;
    const totalAmount = subtotal + parsedLabor + parsedRent + parsedOther;

    const paid = parseFloat(paidAmount) || 0;
    if (paid > totalAmount) throw new Error('Paid amount cannot exceed total amount');
    const dueAmount = totalAmount - paid;

    return await purchaseDal.createPurchaseWithStock(
      userId,
      providerId,
      subtotal,
      parsedLabor,
      parsedRent,
      parsedOther,
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
    if (paid > purchase.totalAmount) {
      throw new Error('Paid amount cannot exceed total amount');
    }
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
