import { saleDal } from '../../dal/userDal/saleDal.js';
import { getConversionFactor } from '../../utils/unitConverter.js';

export const saleService = {
  async getSales(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [sales, total] = await Promise.all([
      saleDal.findMany(userId, skip, limit),
      saleDal.count(userId),
    ]);

    return {
      sales,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getSaleById(id, userId) {
    const sale = await saleDal.findById(id, userId);
    if (!sale) throw new Error('Sale not found');
    return sale;
  },

  async createSale(userId, data) {
    const {
      customerId,
      items,
      paidAmount = 0,
      laborCharge = 0,
      vehicleRent = 0,
      otherCharges = 0,
    } = data;
    if (!customerId || !Array.isArray(items) || items.length === 0) {
      throw new Error('Customer and at least one item are required');
    }
    const customer = await saleDal.findCustomerForUser(customerId, userId);
    if (!customer) throw new Error('Customer not found');

    let subtotal = 0;
    let totalProfit = 0;
    const lineItems = [];

    for (const it of items) {
      const product = await saleDal.findProductForUser(it.productId, userId);
      if (!product) throw new Error(`Product ${it.productId} not found`);

      const qty = parseFloat(it.quantity) || 0;
      const itemUnit = it.unit || product.unit || 'KG';
      const factor = getConversionFactor(itemUnit, product.unit);
      const baseQty = qty * factor;

      let costPrice = parseFloat(it.costPrice) || 0;

      if (it.batchAllocations && it.batchAllocations.length > 0) {
        let totalAllocBaseQty = 0;
        let totalAllocCost = 0;
        for (const alloc of it.batchAllocations) {
          const batch = await saleDal.findStockBatchForUser(alloc.batchId, it.productId, userId);
          if (!batch) throw new Error(`Selected batch ${alloc.batchId} not found`);
          const allocQty = parseFloat(alloc.quantity) || 0;
          if (batch.quantity < allocQty) {
            throw new Error(`Insufficient stock in batch ${batch.batchNumber || batch._id}. Available: ${batch.quantity} ${product.unit}`);
          }
          totalAllocBaseQty += allocQty;
          totalAllocCost += allocQty * (batch.purchasePrice ?? product.baseCostPrice ?? 0);
        }
        costPrice = totalAllocBaseQty > 0 ? totalAllocCost / totalAllocBaseQty : (product.baseCostPrice || 0);
      } else if (it.batchId && it.batchId !== 'FIFO' && it.batchId !== 'COMBINED') {
        const batch = await saleDal.findStockBatchForUser(it.batchId, it.productId, userId);
        if (!batch) throw new Error(`Batch ${it.batchId} not found`);
        if (batch.quantity < baseQty) {
          throw new Error(`Insufficient stock in selected batch. Available: ${batch.quantity} ${product.unit}`);
        }
        costPrice = batch.purchasePrice;
      } else {
        if (product.currentStock < baseQty) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.currentStock} ${product.unit}`,
          );
        }
        const activeBatches = await saleDal.findActiveBatchesForProduct(it.productId, userId);
        let remaining = baseQty;
        let totalCost = 0;
        let consumed = 0;

        for (const b of activeBatches) {
          if (remaining <= 0) break;
          const take = Math.min(b.quantity, remaining);
          totalCost += take * (b.purchasePrice ?? product.baseCostPrice ?? 0);
          consumed += take;
          remaining -= take;
        }

        if (remaining > 0) {
          totalCost += remaining * (product.baseCostPrice || 0);
          consumed += remaining;
        }

        costPrice = consumed > 0 ? totalCost / consumed : product.baseCostPrice || 0;
      }

      const salePrice = parseFloat(it.salePrice) || 0;
      const lineRevenue = baseQty * salePrice;
      const lineCost = costPrice * baseQty;
      const profit = lineRevenue - lineCost;

      subtotal += lineRevenue;
      totalProfit += profit;

      lineItems.push({
        productId: it.productId,
        batchId: it.batchId && it.batchId !== 'FIFO' && it.batchId !== 'COMBINED' ? it.batchId : null,
        batchAllocations: it.batchAllocations && it.batchAllocations.length > 0 ? it.batchAllocations : undefined,
        quantity: qty,
        unit: itemUnit,
        baseQuantity: baseQty,
        costPrice,
        salePrice,
        profit,
      });
    }

    const parsedLabor = parseFloat(laborCharge) || 0;
    const parsedRent = parseFloat(vehicleRent) || 0;
    const parsedOther = parseFloat(otherCharges) || 0;
    const totalAmount = Math.max(0, subtotal - parsedLabor - parsedRent - parsedOther);

    const paid = parseFloat(paidAmount) || 0;
    if (paid > totalAmount) throw new Error('Paid amount cannot exceed total amount');
    const dueAmount = totalAmount - paid;

    return await saleDal.createSaleWithStock(
      userId,
      customerId,
      subtotal,
      parsedLabor,
      parsedRent,
      parsedOther,
      totalAmount,
      paid,
      dueAmount,
      totalProfit,
      lineItems,
    );
  },

  async updatePayment(id, userId, paidAmount) {
    if (paidAmount === undefined) throw new Error('paidAmount is required');

    const sale = await saleDal.findByIdSimple(id, userId);
    if (!sale) throw new Error('Sale not found');

    const paid = parseFloat(paidAmount) || 0;
    if (paid > sale.totalAmount) throw new Error('Paid amount cannot exceed total amount');
    const dueAmount = sale.totalAmount - paid;

    return await saleDal.update(id, userId, {
      paidAmount: paid,
      dueAmount,
    });
  },

  async deleteSale(id, userId) {
    return await saleDal.deleteSaleWithRollback(id, userId);
  },
};
