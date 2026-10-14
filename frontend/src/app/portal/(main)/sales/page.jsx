'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    X,
    Plus,
    Trash2,
    Printer,
    BadgeDollarSign,
    Clock,
    AlertCircle,
    TrendingUp,
    Filter,
    CheckCircle2,
    Wallet,
    Eye,
    Pencil,
    ArrowUpRight,
    Truck,
    Users,
    Receipt,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Scissors,
    Layers,
    Check,
    Table,
    Boxes
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { ConfirmModal } from '@/components/portal/ConfirmModal';
import { PageHeader } from '@/components/portal/PageHeader';
import { CustomSelect } from '@/components/ui/custom-select';
import { getCompatibleUnits, getConversionFactor } from '@/lib/units';

function SalesPageContent() {
    const searchParams = useSearchParams();
    const [sales, setSales] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [selectedSale, setSelectedSale] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeBatchPickerRow, setActiveBatchPickerRow] = useState(null);
    const [cachedCombineRow, setCachedCombineRow] = useState(null);
    const [multiBatchQtys, setMultiBatchQtys] = useState({});

    // Form state
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [customerError, setCustomerError] = useState(false);
    const [formData, setFormData] = useState({
        customerId: '',
        paidAmount: '',
        laborCharge: '',
        vehicleRent: '',
        otherCharges: '',
        items: [{ _key: 'init-0', productId: '', batchId: '', quantity: '', salePrice: '', costPrice: '' }],
    });
    const [editFormData, setEditFormData] = useState({
        id: '',
        paidAmount: 0,
        totalAmount: 0,
    });
    const [submitting, setSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchSales();
    }, [pagination.page]);

    useEffect(() => {
        if (showCreateModal) {
            fetchCustomersAndProducts();
        }
    }, [showCreateModal]);

    const fetchSales = () => {
        setLoading(true);
        fetch(`/api/user/sales?page=${pagination.page}`, { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => {
                setSales(data.sales || []);
                setPagination(data.pagination || { page: 1, pages: 1 });
            })
            .catch((err) => console.error('Failed to load sales:', err))
            .finally(() => setLoading(false));
    };

    const fetchCustomersAndProducts = async () => {
        try {
            const [customersRes, productsRes] = await Promise.all([
                fetch(`/api/user/customers?limit=100`, { credentials: 'include' }),
                fetch(`/api/user/products?limit=100`, { credentials: 'include' }),
            ]);
            const customersData = await customersRes.json();
            const productsData = await productsRes.json();
            const loadedProducts = productsData.products || [];
            setCustomers(customersData.customers || []);
            setProducts(loadedProducts);
            return loadedProducts;
        } catch (err) {
            console.error('Failed to load customers/products:', err);
            return [];
        }
    };

    // Handle deep links from stock table (e.g. /portal/sales?product=123&batch=456&create=true)
    useEffect(() => {
        const prodParam = searchParams.get('product');
        const batchParam = searchParams.get('batch');
        const createParam = searchParams.get('create');

        if (prodParam || createParam === 'true') {
            setShowCreateModal(true);
            fetchCustomersAndProducts().then((loadedProducts) => {
                if (prodParam && loadedProducts.length > 0) {
                    const prod = loadedProducts.find(p => String(p.id || p._id) === String(prodParam));
                    if (prod) {
                        const availableBatches = prod.batches?.filter(b => Number(b.quantity || 0) > 0) || [];
                        const firstBatch = availableBatches[0];
                        const batchVal = batchParam || (firstBatch ? String(firstBatch.id || firstBatch._id) : '');
                        let cost = Number(prod.baseCostPrice || 0);
                        if (batchVal) {
                            const b = prod.batches?.find(batch => String(batch.id || batch._id) === String(batchVal));
                            if (b) cost = Number(b.purchasePrice ?? prod.baseCostPrice ?? 0);
                        }
                        setFormData(prev => ({
                            ...prev,
                            items: [{
                                productId: prodParam,
                                batchId: batchVal,
                                quantity: '',
                                unit: prod.unit || 'KG',
                                salePrice: prod.baseSalePrice || '',
                                costPrice: cost,
                            }]
                        }));
                    }
                }
            });
        }
    }, [searchParams]);

    useEffect(() => {
        if (activeBatchPickerRow !== null) {
            setCachedCombineRow(activeBatchPickerRow);
            const item = formData.items[activeBatchPickerRow];
            if (item && item.batchId === 'COMBINED' && item.batchAllocations?.length > 0) {
                const initialQtys = {};
                item.batchAllocations.forEach(a => {
                    initialQtys[String(a.batchId)] = String(a.quantity);
                });
                setMultiBatchQtys(initialQtys);
            } else {
                setMultiBatchQtys({});
            }
        }
    }, [activeBatchPickerRow]);

    const effectiveCombineRow = activeBatchPickerRow !== null ? activeBatchPickerRow : cachedCombineRow;
    const activeCombineItem = effectiveCombineRow !== null && formData.items ? formData.items[effectiveCombineRow] : null;
    const activeCombineProduct = activeCombineItem ? products.find(p => String(p.id || p._id) === String(activeCombineItem.productId)) : null;
    const activeCombineBatches = (activeCombineProduct?.batches || []).filter(b => Number(b.quantity || 0) > 0);

    let combineTotalQty = 0;
    let combineTotalVal = 0;
    let combineSelectedCount = 0;
    let combineHasExceeded = false;

    activeCombineBatches.forEach(b => {
        const bId = String(b.id || b._id);
        const q = parseFloat(multiBatchQtys[bId]) || 0;
        const avail = Number(b.quantity || 0);
        if (q > avail) combineHasExceeded = true;
        if (q > 0) {
            combineSelectedCount += 1;
            const rate = Number(b.purchasePrice ?? (activeCombineProduct?.baseCostPrice || 0));
            combineTotalQty += q;
            combineTotalVal += q * rate;
        }
    });

    const combineBlendedAvgCost = combineTotalQty > 0 ? (combineTotalVal / combineTotalQty) : 0;

    const handleCombineIntoSingleSaleItem = () => {
        const targetRow = activeBatchPickerRow !== null ? activeBatchPickerRow : cachedCombineRow;
        if (targetRow === null) return;
        const baseItem = formData.items[targetRow];
        const product = products.find(p => String(p.id || p._id) === String(baseItem?.productId));
        if (!product) return;

        const chosenBatches = Object.entries(multiBatchQtys)
            .filter(([_, qty]) => parseFloat(qty) > 0)
            .map(([batchId, qty]) => {
                const b = product.batches?.find(batch => String(batch.id || batch._id) === String(batchId));
                return {
                    batchId,
                    batchNumber: b?.batchNumber || `Batch`,
                    quantity: parseFloat(qty),
                    purchasePrice: Number(b?.purchasePrice ?? (product.baseCostPrice || 0)),
                };
            });

        if (chosenBatches.length === 0) {
            toast.error('Please enter quantity for at least one batch');
            return;
        }

        for (const alloc of chosenBatches) {
            const b = product.batches?.find(batch => String(batch.id || batch._id) === String(alloc.batchId));
            const avail = Number(b?.quantity || 0);
            if (alloc.quantity > avail) {
                toast.error(`Quantity for lot ${alloc.batchNumber} cannot exceed available stock (${avail} ${product.unit || 'KG'})`);
                return;
            }
        }

        const totalQty = chosenBatches.reduce((sum, b) => sum + b.quantity, 0);
        const totalCostVal = chosenBatches.reduce((sum, b) => sum + (b.quantity * b.purchasePrice), 0);
        const blendedCost = totalQty > 0 ? (totalCostVal / totalQty) : (product.baseCostPrice || 0);

        const newItems = [...formData.items];
        newItems[targetRow] = {
            productId: baseItem.productId,
            batchId: 'COMBINED',
            batchAllocations: chosenBatches,
            quantity: String(parseFloat(totalQty.toFixed(2))),
            unit: baseItem.unit || product.unit || 'KG',
            salePrice: baseItem.salePrice || product.baseSalePrice || '',
            costPrice: parseFloat(blendedCost.toFixed(2)),
            combinedDescription: chosenBatches.map(b => `${b.batchNumber}: ${b.quantity} ${product.unit || 'KG'}`).join(' + '),
        };

        setFormData({ ...formData, items: newItems });
        setActiveBatchPickerRow(null);
        setMultiBatchQtys({});
        toast.success(`Combined ${chosenBatches.length} lots into 1 sale item! Weighted average cost: ₹${blendedCost.toFixed(2)}/${product.unit || 'KG'}`);
    };

    const handleViewBill = async (saleId) => {
        try {
            const res = await fetch(`/api/user/sales/${saleId}`, { credentials: 'include' });
            const data = await res.json();
            setSelectedSale(data);
            setShowViewModal(true);
        } catch (err) {
            console.error('Failed to load sale details:', err);
            toast.error('Failed to load sale details');
        }
    };

    const handleEditClick = (sale) => {
        setEditFormData({
            id: sale.id,
            paidAmount: sale.paidAmount || 0,
            totalAmount: sale.totalAmount,
        });
        setShowEditModal(true);
    };

    const handleUpdateSale = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`/api/user/sales/${editFormData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paidAmount: parseFloat(editFormData.paidAmount),
                }),
            });

            if (res.ok) {
                toast.success('Sale updated successfully');
                setShowEditModal(false);
                fetchSales();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to update sale');
            }
        } catch (err) {
            console.error('Failed to update sale:', err);
            toast.error('Failed to update sale');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSale = async () => {
        if (!deleteId) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/user/sales/${deleteId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                toast.success('Sale deleted successfully');
                setDeleteId(null);
                fetchSales();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to delete sale');
            }
        } catch (err) {
            console.error('Failed to delete sale:', err);
            toast.error('Failed to delete sale');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePrintBill = () => {
        if (!selectedSale) return;

        // Create a hidden iframe for printing
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sale Invoice - ${selectedSale.id.slice(-8).toUpperCase()}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
          @media print {
            @page { margin: 20mm; }
            body { -webkit-print-color-adjust: exact; }
          }
          body { 
            font-family: 'Inter', sans-serif; 
            color: #0f172a;
            line-height: 1.5;
            padding: 0;
            margin: 0;
          }
          .report-header { 
            border-bottom: 4px solid #0f172a; 
            padding-bottom: 24px; 
            margin-bottom: 40px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .brand h1 { 
            font-size: 42px; 
            font-weight: 900; 
            margin: 0; 
            letter-spacing: -2px; 
            text-transform: uppercase;
          }
          .brand p { 
            margin: 4px 0 0 0; 
            font-weight: 700; 
            color: #64748b; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            font-size: 12px;
          }
          .meta-info { text-align: right; }
          .meta-label { 
            font-size: 10px; 
            font-weight: 900; 
            color: #94a3b8; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            margin-bottom: 2px;
          }
          .meta-value { font-size: 18px; font-weight: 900; font-style: italic; }

          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
          .section-title { 
            font-size: 10px; 
            font-weight: 900; 
            color: #94a3b8; 
            text-transform: uppercase; 
            letter-spacing: 2px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .info-box p { margin: 4px 0; font-size: 14px; }
          .info-box p strong { color: #475569; }

          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          th { 
            text-align: left; 
            font-size: 10px; 
            font-weight: 900; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            padding: 12px;
            background: #f8fafc;
            border-bottom: 2px solid #0f172a;
          }
          td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .text-right { text-align: right; }
          .font-bold { font-weight: 700; }
          
          .totals-container { display: flex; justify-content: flex-end; }
          .totals-box { 
            width: 300px; 
            background: #0f172a; 
            color: white; 
            padding: 24px; 
            border-radius: 16px;
          }
          .total-item { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 8px;
            font-size: 12px;
            color: #94a3b8;
            font-weight: 700;
            text-transform: uppercase;
          }
          .total-main { 
            display: flex; 
            justify-content: space-between; 
            margin-top: 16px; 
            padding-top: 16px;
            border-top: 1px solid #334155;
            font-size: 24px;
            font-weight: 900;
            color: white;
          }
          .footer { 
            margin-top: 60px; 
            text-align: center; 
            font-size: 10px; 
            color: #94a3b8;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="brand">
            <h1>Sale Invoice</h1>
            <p>Agriculture Trading Management System</p>
          </div>
          <div class="meta-info">
            <div class="meta-label">Invoice Reference</div>
            <div class="meta-value">#${selectedSale.id.slice(-8).toUpperCase()}</div>
            <div class="meta-label" style="margin-top: 8px;">Transaction Date</div>
            <div class="meta-value">${new Date(selectedSale.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
        </div>

        <div class="grid">
          <div class="info-box">
            <div class="section-title">Client Information</div>
            <p><strong>Name:</strong> ${selectedSale.customer?.name || 'Walk-in'}</p>
            ${selectedSale.customer?.phone ? `<p><strong>Phone:</strong> ${selectedSale.customer.phone}</p>` : ''}
            ${selectedSale.customer?.address ? `<p><strong>Address:</strong> ${selectedSale.customer.address}</p>` : ''}
          </div>
          <div class="info-box">
            <div class="section-title">Business Entity</div>
            <p><strong>Merchant:</strong> Sayyad Traders</p>
            <p><strong>Payment Status:</strong> ${(selectedSale.dueAmount || 0) > 0 ? 'Balance Pending' : 'Fully Settled'}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 45%">Commodity / Product</th>
              <th style="width: 15%" class="text-right">Quantity</th>
              <th style="width: 20%" class="text-right">Unit Price</th>
              <th style="width: 20%" class="text-right">Net Amount</th>
            </tr>
          </thead>
          <tbody>
            ${selectedSale.items?.map(item => `
              <tr>
                <td>
                  <div class="font-bold text-slate-900">${item.product?.name || 'Unknown Item'}</div>
                  <div style="font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Unit: ${item.product?.unit || 'N/A'}</div>
                </td>
                <td class="text-right font-bold">${item.quantity}</td>
                <td class="text-right text-slate-500">₹${item.salePrice.toLocaleString('en-IN')}</td>
                <td class="text-right font-bold text-slate-900">₹${(item.salePrice * item.quantity).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals-container">
          <div class="totals-box">
            <div class="total-item">
              <span>Items Subtotal</span>
              <span style="color: white">₹${Number(selectedSale.subtotal || selectedSale.items?.reduce((s, it) => s + (it.salePrice * it.quantity || 0), 0) || 0).toLocaleString('en-IN')}</span>
            </div>
            ${(Number(selectedSale.laborCharge) > 0) ? `
            <div class="total-item">
              <span>Labour Charge</span>
              <span style="color: white">+ ₹${Number(selectedSale.laborCharge).toLocaleString('en-IN')}</span>
            </div>` : ''}
            ${(Number(selectedSale.vehicleRent) > 0) ? `
            <div class="total-item">
              <span>Vehicle Rent</span>
              <span style="color: white">+ ₹${Number(selectedSale.vehicleRent).toLocaleString('en-IN')}</span>
            </div>` : ''}
            ${(Number(selectedSale.otherCharges) > 0) ? `
            <div class="total-item">
              <span>Other Charges</span>
              <span style="color: white">+ ₹${Number(selectedSale.otherCharges).toLocaleString('en-IN')}</span>
            </div>` : ''}
            <div class="total-item" style="border-top: 1px dashed #334155; padding-top: 6px; margin-top: 6px;">
              <span style="color: #cbd5e1">Gross Total</span>
              <span style="color: white; font-weight: 900;">₹${Number(selectedSale.totalAmount).toLocaleString('en-IN')}</span>
            </div>
            <div class="total-item">
              <span>Amount Received</span>
              <span style="color: #10b981">₹${Number(selectedSale.paidAmount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div class="total-main">
              <span style="font-size: 12px; color: #94a3b8; display: flex; align-items: center;">BALANCE DUE</span>
              <span>₹${Number(selectedSale.dueAmount || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Computer Generated Statement • Sayyad Traders • No Signature Required</p>
        </div>
      </body>
      </html>
    `;

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(htmlContent);
        doc.close();

        // Print and cleanup
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setTimeout(() => {
                if (iframe?.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                }
            }, 1000);
        }, 500);
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { _key: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, productId: '', batchId: '', quantity: '', unit: '', salePrice: '', costPrice: '' }],
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        // Auto-fill cost price and unit when product is selected
        if (field === 'productId') {
            const product = products.find(p => String(p.id || p._id) === String(value));
            if (product) {
                newItems[index].unit = product.unit || 'KG';
                const stock = Number(product.currentStock || 0);
                if (stock <= 0) {
                    newItems[index].quantity = '';
                    newItems[index].salePrice = '';
                    newItems[index].costPrice = '';
                    newItems[index].batchId = '';
                    delete newItems[index].batchAllocations;
                    delete newItems[index].combinedDescription;
                } else {
                    const availableBatches = product.batches?.filter(b => Number(b.quantity || 0) > 0) || [];
                    newItems[index].salePrice = product.baseSalePrice || '';
                    const firstBatch = availableBatches[0];
                    if (firstBatch) {
                        // Default to the oldest batch (FIFO)
                        newItems[index].batchId = String(firstBatch.id || firstBatch._id);
                        newItems[index].costPrice = Number(firstBatch.purchasePrice ?? product.baseCostPrice ?? 0);
                    } else {
                        newItems[index].batchId = '';
                        newItems[index].costPrice = Number(product.baseCostPrice || 0);
                    }
                    delete newItems[index].batchAllocations;
                    delete newItems[index].combinedDescription;
                }
            } else {
                newItems[index].unit = '';
                newItems[index].costPrice = '';
                newItems[index].salePrice = '';
                newItems[index].batchId = '';
                delete newItems[index].batchAllocations;
                delete newItems[index].combinedDescription;
            }
        }

        // Update cost price and check stock when batch is selected
        if (field === 'batchId') {
            if (value !== 'COMBINED') {
                delete newItems[index].batchAllocations;
                delete newItems[index].combinedDescription;
            }
            const product = products.find(p => String(p.id || p._id) === String(newItems[index].productId));
            const batch = product?.batches?.find(b => String(b.id || b._id) === String(value));
            if (batch) {
                newItems[index].costPrice = Number(batch.purchasePrice ?? product?.baseCostPrice ?? 0);
            } else if (product) {
                newItems[index].costPrice = Number(product.baseCostPrice || 0);
            }
        }

        setFormData({ ...formData, items: newItems });
    };

    const getStockError = (item) => {
        if (!item.productId) return null;
        const product = products.find(p => String(p.id || p._id) === String(item.productId));
        if (!product) return null;

        const currentStock = Number(product.currentStock || 0);
        if (currentStock <= 0) {
            return `Out of Stock! (0 ${product.unit} available in inventory)`;
        }

        if (!item.quantity) return null;
        const qty = parseFloat(item.quantity);
        if (qty <= 0) {
            return `Quantity must be greater than 0`;
        }

        const selectedUnit = item.unit || product.unit || 'KG';
        const factor = getConversionFactor(selectedUnit, product.unit);
        const baseQty = qty * factor;

        // Combined batch check
        if (item.batchId === 'COMBINED' && item.batchAllocations?.length > 0) {
            for (const alloc of item.batchAllocations) {
                const batch = product.batches?.find(b => String(b.id || b._id) === String(alloc.batchId));
                const batchStock = Number(batch?.quantity || 0);
                if (alloc.quantity > batchStock) {
                    return `Lot ${batch?.batchNumber || 'Batch'} stock exceeded! (Need: ${alloc.quantity} ${product.unit}, Available: ${batchStock} ${product.unit})`;
                }
            }
        } else if (item.batchId && item.batchId !== 'FIFO') {
            const batch = product.batches?.find(b => String(b.id || b._id) === String(item.batchId));
            const batchStock = Number(batch?.quantity || 0);

            let totalBatchDemand = 0;
            formData.items.forEach((it) => {
                if (String(it.productId) === String(item.productId) && String(it.batchId) === String(item.batchId)) {
                    const itFactor = getConversionFactor(it.unit || product.unit, product.unit);
                    totalBatchDemand += (parseFloat(it.quantity) || 0) * itFactor;
                }
            });

            if (baseQty > batchStock) {
                return `Exceeds Lot ${batch?.batchNumber || ''} stock! (Need: ${baseQty} ${product.unit}, Available: ${batchStock} ${product.unit})`;
            }
            if (totalBatchDemand > batchStock) {
                return `Combined rows exceed Lot ${batch?.batchNumber || ''} stock! (Total Need: ${totalBatchDemand} ${product.unit}, Available: ${batchStock} ${product.unit})`;
            }
        }

        // Global product stock check across all rows for this product
        let totalProductDemand = 0;
        formData.items.forEach((it) => {
            if (String(it.productId) === String(item.productId)) {
                const itFactor = getConversionFactor(it.unit || product.unit, product.unit);
                totalProductDemand += (parseFloat(it.quantity) || 0) * itFactor;
            }
        });

        if (baseQty > currentStock) {
            return `Exceeds total stock! (Need: ${baseQty} ${product.unit}, Max: ${currentStock} ${product.unit})`;
        }
        if (totalProductDemand > currentStock) {
            return `Combined rows exceed total stock! (Total Need: ${totalProductDemand} ${product.unit}, Max: ${currentStock} ${product.unit})`;
        }

        return null;
    };

    const isFormValid = () => {
        if (!formData.customerId) return false;
        if (!formData.items || formData.items.length === 0) return false;

        return formData.items.every(item => {
            if (!item.productId) return false;
            const qty = parseFloat(item.quantity);
            if (!item.quantity || isNaN(qty) || qty <= 0) return false;
            const price = parseFloat(item.salePrice);
            if (item.salePrice === '' || isNaN(price) || price < 0) return false;
            return !getStockError(item);
        });
    };

    const calculateSubtotal = () => {
        return formData.items.reduce((sum, item) => {
            const product = products.find(p => String(p.id || p._id) === String(item.productId));
            const qty = parseFloat(item.quantity) || 0;
            const factor = getConversionFactor(item.unit || product?.unit, product?.unit);
            const baseQty = qty * factor;
            const price = parseFloat(item.salePrice) || 0;
            return sum + baseQty * price;
        }, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const labor = parseFloat(formData.laborCharge) || 0;
        const rent = parseFloat(formData.vehicleRent) || 0;
        const other = parseFloat(formData.otherCharges) || 0;
        return subtotal + labor + rent + other;
    };

    const calculateProfit = () => {
        return formData.items.reduce((sum, item) => {
            const product = products.find(p => String(p.id || p._id) === String(item.productId));
            const qty = parseFloat(item.quantity) || 0;
            const factor = getConversionFactor(item.unit || product?.unit, product?.unit);
            const baseQty = qty * factor;
            const salePrice = parseFloat(item.salePrice) || 0;

            let costPrice = 0;
            if (item.batchId === 'COMBINED' && item.costPrice) {
                costPrice = parseFloat(item.costPrice);
            } else if (item.batchId) {
                const b = product?.batches?.find(batch => String(batch.id || batch._id) === String(item.batchId));
                costPrice = Number(b?.purchasePrice ?? product?.baseCostPrice ?? 0);
            } else {
                costPrice = Number(product?.baseCostPrice || 0);
            }

            return sum + baseQty * (salePrice - costPrice);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Customer validation
        if (!formData.customerId) {
            setCustomerError(true);
            toast.error('Please select a customer before submitting');
            const customerEl = document.getElementById('customer');
            if (customerEl) {
                customerEl.focus();
                customerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        setCustomerError(false);

        // 2. Items presence validation
        if (!formData.items || formData.items.length === 0) {
            toast.error('Please add at least one item to the sale invoice');
            return;
        }

        // 3. Item-by-item row validation
        for (let i = 0; i < formData.items.length; i++) {
            const it = formData.items[i];
            const rowNum = i + 1;
            const prod = products.find(p => String(p.id || p._id) === String(it.productId));
            const prodName = prod ? prod.name : `Item #${rowNum}`;

            if (!it.productId) {
                toast.error(`Item #${rowNum}: Please select a product/commodity`);
                return;
            }

            const qty = parseFloat(it.quantity);
            if (!it.quantity || isNaN(qty) || qty <= 0) {
                toast.error(`Item #${rowNum} (${prodName}): Please enter a valid quantity greater than 0`);
                return;
            }

            const price = parseFloat(it.salePrice);
            if (it.salePrice === '' || isNaN(price) || price < 0) {
                toast.error(`Item #${rowNum} (${prodName}): Please enter a valid selling rate`);
                return;
            }

            // Check actual stock errors for this item
            const stockErr = getStockError(it);
            if (stockErr) {
                toast.error(`Item #${rowNum} (${prodName}): ${stockErr}`);
                return;
            }
        }

        // 4. Logistics & delivery charges validation
        const labor = parseFloat(formData.laborCharge) || 0;
        const rent = parseFloat(formData.vehicleRent) || 0;
        const other = parseFloat(formData.otherCharges) || 0;
        if (labor < 0 || rent < 0 || other < 0) {
            toast.error('Logistics and delivery charges cannot be negative numbers');
            return;
        }

        // 5. Payment amount validation
        const paid = parseFloat(formData.paidAmount) || 0;
        if (paid < 0) {
            toast.error('Payment received cannot be negative');
            return;
        }
        if (paid > totalAmount) {
            toast.error('Payment received cannot exceed total sale amount');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`/api/user/sales`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: formData.customerId,
                    paidAmount: parseFloat(formData.paidAmount) || 0,
                    laborCharge: parseFloat(formData.laborCharge) || 0,
                    vehicleRent: parseFloat(formData.vehicleRent) || 0,
                    otherCharges: parseFloat(formData.otherCharges) || 0,
                    items: formData.items.map(it => {
                        const prod = products.find(p => String(p.id || p._id) === String(it.productId));
                        const factor = getConversionFactor(it.unit || prod?.unit, prod?.unit);
                        const isCombined = it.batchId === 'COMBINED' && it.batchAllocations?.length > 0;
                        const selectedBatch = isCombined ? null : prod?.batches?.find(b => String(b.id || b._id) === String(it.batchId));
                        const effectiveCost = isCombined
                            ? (parseFloat(it.costPrice) || 0)
                            : (selectedBatch?.purchasePrice ?? (Number(prod?.baseCostPrice) || 0));

                        return {
                            productId: it.productId,
                            batchId: isCombined ? null : (it.batchId || null),
                            batchAllocations: isCombined ? it.batchAllocations.map(a => ({
                                batchId: a.batchId,
                                quantity: parseFloat(a.quantity) || 0,
                            })) : undefined,
                            quantity: parseFloat(it.quantity) || 0,
                            unit: it.unit || prod?.unit || 'KG',
                            salePrice: parseFloat(it.salePrice) || 0,
                            costPrice: effectiveCost,
                        };
                    }),
                }),
            });

            if (res.ok) {
                toast.success('Sale created successfully!');
                setShowCreateModal(false);
                setCustomerError(false);
                setFormData({
                    customerId: '',
                    paidAmount: '',
                    laborCharge: '',
                    vehicleRent: '',
                    otherCharges: '',
                    items: [{ _key: `item-${Date.now()}`, productId: '', batchId: '', quantity: '', salePrice: '', costPrice: '' }],
                });
                fetchSales();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to create sale');
            }
        } catch (err) {
            console.error('Failed to create sale:', err);
            toast.error('Failed to create sale');
        } finally {
            setSubmitting(false);
        }
    };

    const subtotalAmount = calculateSubtotal();
    const totalAmount = calculateTotal();
    const paidAmount = parseFloat(formData.paidAmount) || 0;
    const dueAmount = totalAmount - paidAmount;
    const estimatedProfit = calculateProfit();
    const hasStockErrors = formData.items.some(item => Boolean(getStockError(item)));

    const totalReceivables = sales.reduce((sum, s) => sum + (s.dueAmount || 0), 0);
    const totalSalesToday = sales
        .filter(s => new Date(s.createdAt).toDateString() === new Date().toDateString())
        .length;
    const totalProfitToday = sales
        .filter(s => new Date(s.createdAt).toDateString() === new Date().toDateString())
        .reduce((sum, s) => sum + (s.totalProfit || 0), 0);

    const productOptions = useMemo(() => {
        return products.map((p) => {
            const stock = Number(p.currentStock || 0);
            const isOutOfStock = stock <= 0;
            return {
                value: String(p.id || p._id),
                label: `${p.name} (${p.unit})`,
                sublabel: isOutOfStock ? `Out of Stock (0 ${p.unit})` : `Stock: ${stock} ${p.unit}`,
                sublabelClass: isOutOfStock
                    ? 'text-rose-700 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/70 border border-rose-200/80 dark:border-rose-900/60 px-2 py-0.5 rounded-md text-[10px]'
                    : 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-900/60 px-2 py-0.5 rounded-md text-[10px]',
                disabled: false,
                isOutOfStock,
                stock,
            };
        });
    }, [products]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDeleteSale}
                title="Delete Sale Record?"
                description="Are you sure you want to delete this sale? This will revert stock levels for all products in this sale."
                isLoading={submitting}
            />
            {/* Header Section */}
            <PageHeader 
                title="Sales Terminal"
                description="Manage customer liquidations and revenue tracking"
                icon={BadgeDollarSign}
                actionButton={
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 rounded-xl h-11 px-5 font-bold shadow-sm transition-all flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create New Sale
                  </Button>
                }
            />

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Receivables</p>
                            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">₹{totalReceivables.toLocaleString('en-IN')}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Outstanding from clients</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                            <ArrowUpRight className="h-6 w-6" />
                        </div>
                    </div>
                </Card>

                <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                {totalProfitToday >= 0 ? "Today's Profit" : "Today's Loss"}
                            </p>
                            <p className={cn(
                                "text-2xl sm:text-3xl font-black",
                                totalProfitToday >= 0 ? "text-blue-600 dark:text-blue-400" : "text-rose-600 dark:text-rose-400"
                            )}>
                                {totalProfitToday >= 0 ? "+" : "-"}₹{Math.abs(totalProfitToday).toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                {totalProfitToday >= 0 ? "Net trade gain" : "Net trade loss"}
                            </p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                </Card>

                <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today&apos;s Sales</p>
                            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{totalSalesToday} Invoices</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Completed today</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 shrink-0">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Sales Table Card */}
            <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Invoice Ledger</CardTitle>
                            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Total {sales.length} customer sales and liquidation records
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] text-sm text-slate-600 dark:text-slate-400">
                                    <thead>
                                        <tr className="border-b dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
                                            <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Client Information</th>
                                            <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Invoice Total</th>
                                            <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Paid Amount</th>
                                            <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Payment Status</th>
                                            <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Profit / Loss</th>
                                            <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Date</th>
                                            <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] w-48">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {sales.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="p-20 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                                                            <BadgeDollarSign className="h-8 w-8 text-slate-500 dark:text-slate-300" />
                                                        </div>
                                                        <p className="text-slate-400 font-medium">No sales records found</p>
                                                        <Button onClick={() => setShowCreateModal(true)} variant="outline" className="rounded-xl mt-2">
                                                            Create your first sale
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            sales.map((s) => (
                                                <tr key={s.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors group">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-100 dark:border-emerald-900/30 uppercase">
                                                                {s.customer?.name[0] || '?'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 dark:text-slate-100 text-base">{s.customer?.name || 'Unknown'}</p>
                                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">INV: {s.id.slice(-8).toUpperCase()}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <p className="font-black text-slate-900 dark:text-slate-100">₹{Number(s.totalAmount).toLocaleString('en-IN')}</p>
                                                    </td>
                                                    <td className="p-4 text-right text-emerald-600 dark:text-emerald-400 font-black">
                                                        ₹{Number(s.paidAmount || 0).toLocaleString('en-IN')}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        {(s.dueAmount || 0) <= 0 ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                                                                <CheckCircle2 className="h-3 w-3" /> Settled
                                                            </span>
                                                        ) : (s.paidAmount || 0) > 0 ? (
                                                            <div className="flex flex-col items-end leading-none">
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 mb-1">
                                                                    <Clock className="h-3 w-3" /> Partial
                                                                </span>
                                                                <span className="text-[10px] text-rose-500 dark:text-rose-400 font-black tracking-tighter uppercase">Due: ₹{Number(s.dueAmount).toLocaleString('en-IN')}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-end leading-none">
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/20 px-2.5 py-1 text-xs font-bold text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 mb-1">
                                                                    <AlertCircle className="h-3 w-3" /> Overdue
                                                                </span>
                                                                <span className="text-[10px] text-rose-500 dark:text-rose-400 font-black tracking-tighter uppercase">₹{Number(s.dueAmount || 0).toLocaleString('en-IN')}</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className={cn(
                                                                "text-[9px] font-black uppercase tracking-widest opacity-70",
                                                                (s.totalProfit || 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                                                            )}>
                                                                {(s.totalProfit || 0) >= 0 ? 'Profit' : 'Loss'}
                                                            </span>
                                                            <span className={cn(
                                                                "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black border shadow-sm",
                                                                (s.totalProfit || 0) >= 0
                                                                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
                                                                    : "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30"
                                                            )}>
                                                                {Number(s.totalProfit || 0) >= 0 ? '+' : '-'}₹{Math.abs(Number(s.totalProfit || 0)).toLocaleString('en-IN')}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 font-medium text-slate-500">
                                                        {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                onClick={() => handleViewBill(s.id)}
                                                                className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all hover:scale-105"
                                                                title="View Bill"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                onClick={() => handleEditClick(s)}
                                                                className="h-9 w-9 rounded-xl border-slate-200 hover:border-amber-500 hover:text-amber-600 transition-all hover:scale-105"
                                                                title="Edit Payment"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                onClick={() => setDeleteId(s.id)}
                                                                className="h-9 w-9 rounded-xl border-slate-200 hover:border-red-500 hover:text-red-600 transition-all hover:scale-105"
                                                                title="Delete Sale"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {pagination.pages > 1 && (
                                <div className="p-6 border-t flex items-center justify-between gap-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                                        Page {pagination.page} of {pagination.pages}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl px-4 h-9 font-bold transition-all hover:bg-slate-50"
                                            disabled={pagination.page <= 1}
                                            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl px-4 h-9 font-bold border-slate-900 bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                                            disabled={pagination.page >= pagination.pages}
                                            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Create Sale Modal */}
            <Dialog.Root open={showCreateModal} onOpenChange={(open) => {
                setShowCreateModal(open);
                if (!open) setCustomerError(false);
            }}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <Dialog.Content translate="no" className="notranslate fixed left-1/2 top-1/2 z-50 w-[95vw] sm:w-full max-w-4xl lg:max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-slate-950 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">

                        {/* Header */}
                        <div className="sticky top-0 z-20 shrink-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex justify-between items-center rounded-t-2xl shadow-xs relative">
                            <div className="flex items-center gap-3.5">
                                <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
                                    <BadgeDollarSign className="h-6 w-6" />
                                </div>
                                <div>
                                    <Dialog.Title className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                        New Sale Invoice
                                    </Dialog.Title>
                                    <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                                        Issue customer sale invoice & track revenue
                                    </Dialog.Description>
                                </div>
                            </div>
                            <Dialog.Close asChild>
                                <button
                                    type="button"
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                                    aria-label="Close dialog"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </Dialog.Close>
                            <div className="absolute -bottom-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                            {/* Customer Selection */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="customer" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Select Customer <span className="text-rose-500">*</span>
                                    </Label>
                                    {customerError && (
                                        <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                                            <AlertCircle className="h-3.5 w-3.5" />
                                            Customer is required
                                        </span>
                                    )}
                                </div>
                                <CustomSelect
                                    id="customer"
                                    value={formData.customerId}
                                    onChange={(e) => {
                                        setFormData({ ...formData, customerId: e.target.value });
                                        if (customerError) setCustomerError(false);
                                    }}
                                    placeholder="Choose a Customer"
                                    options={customers.map((c) => ({ value: String(c.id || c._id), label: c.name, sublabel: c.phone }))}
                                    className={cn(
                                        customerError && "!border-rose-500 !ring-2 !ring-rose-500/20 bg-rose-50/20"
                                    )}
                                />
                            </div>

                            {/* Items Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between pb-1">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Sale Items <span className="text-rose-500">*</span>
                                        </Label>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200/60 dark:border-emerald-800/60">
                                            {formData.items.length} {formData.items.length === 1 ? 'item' : 'items'}
                                        </span>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={addItem}
                                        className="h-8 sm:h-8.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add Item
                                    </Button>
                                </div>

                                {/* Items Sheet / Table */}
                                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 shadow-xs overflow-hidden">
                                    {/* Table Header (Desktop) */}
                                    <div className="hidden sm:grid sm:grid-cols-12 gap-2.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        <div className="sm:col-span-3">Product / Commodity</div>
                                        <div className="sm:col-span-2">Batch</div>
                                        <div className="sm:col-span-2">Quantity</div>
                                        <div className="sm:col-span-2">Rate (₹/Base Unit)</div>
                                        <div className="sm:col-span-2 text-right pr-2">Line Total</div>
                                        <div className="sm:col-span-1 text-center">Action</div>
                                    </div>

                                    {/* Rows List */}
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                        {formData.items.map((item, index) => {
                                            const stockError = getStockError(item);
                                            const product = products.find(p => String(p.id || p._id) === String(item.productId));
                                            const availableBatches = product?.batches?.filter(b => Number(b.quantity || 0) > 0) || [];
                                            const itemQty = parseFloat(item.quantity) || 0;
                                            const itemPrice = parseFloat(item.salePrice) || 0;

                                            const selectedUnit = item.unit || product?.unit || 'KG';
                                            const unitOptions = getCompatibleUnits(product?.unit);
                                            const factor = getConversionFactor(selectedUnit, product?.unit);
                                            const baseQty = itemQty * factor;

                                            const isCombined = item.batchId === 'COMBINED' && item.batchAllocations?.length > 0;
                                            const selectedBatch = isCombined ? null : availableBatches.find(b => String(b.id || b._id) === String(item.batchId));
                                            const itemCost = isCombined
                                                ? (parseFloat(item.costPrice) || 0)
                                                : (selectedBatch?.purchasePrice ?? (Number(product?.baseCostPrice) || 0));

                                            const lineTotal = baseQty * itemPrice;
                                            const lineProfit = baseQty * (itemPrice - itemCost);
                                            const hasProfit = lineProfit >= 0;

                                            const availableStock = isCombined
                                                ? item.batchAllocations.reduce((s, a) => s + (parseFloat(a.quantity) || 0), 0)
                                                : (selectedBatch ? Number(selectedBatch.quantity || 0) : Number(product?.currentStock || 0));
                                            const isOutOfStock = Boolean(product && availableStock <= 0);

                                            const batchOptions = availableBatches.map((b, idx) => {
                                                const bQty = Number(b.quantity || 0);
                                                const bPrice = Number(b.purchasePrice ?? (product?.baseCostPrice || 0));
                                                const isOldest = idx === 0;
                                                return {
                                                    value: String(b.id || b._id),
                                                    label: `${b.batchNumber || `Batch #${idx + 1}`}${isOldest ? ' (FIFO Oldest)' : ''}`,
                                                    sublabel: `Avail: ${bQty} ${product?.unit || 'KG'} • ₹${bPrice}/${product?.unit || 'KG'}`,
                                                    sublabelClass: cn(
                                                        "font-bold px-1.5 py-0.5 rounded text-[10px] border",
                                                        isOldest
                                                            ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800"
                                                            : "text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                                    )
                                                };
                                            });

                                            return (
                                                <div
                                                    key={item._key || index}
                                                    className="p-3.5 sm:px-4 sm:py-3.5 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-900/40"
                                                >
                                                    {/* Desktop Row View */}
                                                    <div className="hidden sm:grid sm:grid-cols-12 gap-2.5 items-start">
                                                        {/* Product */}
                                                        <div className="sm:col-span-3 min-w-0">
                                                            <CustomSelect
                                                                value={item.productId}
                                                                onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                                                placeholder="Select Item"
                                                                className="h-10 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs"
                                                                options={productOptions}
                                                            />
                                                            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1 pl-1 truncate h-4">
                                                                {product ? `Base: ${product.unit} • Current: ${product.currentStock || 0} ${product.unit}` : '\u00A0'}
                                                            </p>
                                                        </div>

                                                        {/* Batch */}
                                                        <div className="sm:col-span-2 min-w-0">
                                                            {isCombined ? (
                                                                <div className="h-10 px-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-1.5 shadow-2xs">
                                                                    <div className="min-w-0">
                                                                        <span className="text-[11px] font-black text-indigo-700 dark:text-indigo-300 truncate block">
                                                                            ⚡ Combined ({item.batchAllocations?.length} Lots)
                                                                        </span>
                                                                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold block truncate">
                                                                            Avg ₹{itemCost.toFixed(2)}/{product?.unit || 'KG'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 shrink-0">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setActiveBatchPickerRow(index)}
                                                                            className="p-1 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                                                                            title="Edit combined batch quantities"
                                                                        >
                                                                            <Pencil className="h-3 w-3" />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const firstBatch = availableBatches[0];
                                                                                const newItems = [...formData.items];
                                                                                newItems[index] = {
                                                                                    ...newItems[index],
                                                                                    batchId: firstBatch ? String(firstBatch.id || firstBatch._id) : '',
                                                                                    costPrice: firstBatch ? Number(firstBatch.purchasePrice ?? product?.baseCostPrice ?? 0) : Number(product?.baseCostPrice || 0),
                                                                                    batchAllocations: undefined,
                                                                                    combinedDescription: undefined,
                                                                                };
                                                                                setFormData({ ...formData, items: newItems });
                                                                            }}
                                                                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                                                            title="Remove combination & select single batch"
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <CustomSelect
                                                                        value={item.batchId}
                                                                        onChange={(e) => updateItem(index, 'batchId', e.target.value)}
                                                                        placeholder={availableBatches.length > 0 ? 'Select Batch' : 'No Batches'}
                                                                        className="h-10 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs font-semibold text-slate-900 dark:text-slate-100"
                                                                        allowClear={false}
                                                                        options={batchOptions}
                                                                        disabled={!item.productId || availableBatches.length === 0}
                                                                    />
                                                                    {availableBatches.length >= 2 && (
                                                                        <div className="mt-1 pl-0.5">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setActiveBatchPickerRow(index)}
                                                                                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                                                                                title="Combine portions from 2 or more batches"
                                                                            >
                                                                                <Layers className="h-2.5 w-2.5" />
                                                                                Combine Batches...
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* Quantity & Unit */}
                                                        <div className="sm:col-span-2 min-w-0">
                                                            <div className="flex gap-1.5 items-center">
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    disabled={isOutOfStock}
                                                                    className={cn(
                                                                        "h-10 flex-1 min-w-0 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs transition-colors",
                                                                        stockError && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20",
                                                                        isOutOfStock && "bg-slate-100/80 dark:bg-slate-800/60 cursor-not-allowed opacity-60 text-slate-400 border-slate-200/60 dark:border-slate-800/60"
                                                                    )}
                                                                    value={isOutOfStock ? '' : item.quantity}
                                                                    placeholder='0.00'
                                                                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                                    required={!isOutOfStock}
                                                                />
                                                                <div className="w-24 shrink-0">
                                                                    <CustomSelect
                                                                        value={selectedUnit}
                                                                        onChange={(e) => updateItem(index, 'unit', e.target.value)}
                                                                        options={unitOptions}
                                                                        disabled={isOutOfStock || !product}
                                                                        allowClear={false}
                                                                        placeholder="Unit"
                                                                        className="h-10 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <p className={cn(
                                                                "text-[10px] mt-1 pl-1 truncate h-4 font-medium",
                                                                stockError || isOutOfStock ? "text-rose-500 font-semibold" : "text-slate-400 dark:text-slate-500"
                                                            )}>
                                                                {stockError || (product ? (isOutOfStock ? `Out of Stock (0 ${product.unit})` : `Avail: ${availableStock} ${product.unit}${selectedUnit !== product.unit && item.quantity ? ` (= ${baseQty} ${product.unit})` : ''}`) : '\u00A0')}
                                                            </p>
                                                        </div>

                                                        {/* Sale Price */}
                                                        <div className="sm:col-span-2 min-w-0">
                                                            <div className="relative">
                                                                <span className={cn(
                                                                    "absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold pointer-events-none",
                                                                    isOutOfStock ? "text-slate-300 dark:text-slate-600" : "text-slate-400"
                                                                )}>₹</span>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    disabled={isOutOfStock}
                                                                    className={cn(
                                                                        "h-10 pl-7 pr-14 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs transition-colors",
                                                                        isOutOfStock && "bg-slate-100/80 dark:bg-slate-800/60 cursor-not-allowed opacity-60 text-slate-400 border-slate-200/60 dark:border-slate-800/60"
                                                                    )}
                                                                    value={isOutOfStock ? '' : item.salePrice}
                                                                    placeholder="0.00"
                                                                    onChange={(e) => updateItem(index, 'salePrice', e.target.value)}
                                                                    required={!isOutOfStock}
                                                                />
                                                                <span className={cn(
                                                                    "absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold pointer-events-none uppercase",
                                                                    isOutOfStock ? "text-slate-300 dark:text-slate-600" : "text-slate-400"
                                                                )}>
                                                                    /{product?.unit || 'KG'}
                                                                </span>
                                                            </div>
                                                            {selectedUnit !== product?.unit && itemPrice > 0 ? (
                                                                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 pl-1 truncate h-4">
                                                                    = ₹{(itemPrice * factor).toLocaleString('en-IN', { maximumFractionDigits: 2 })}/{selectedUnit}
                                                                    {itemCost > 0 && !isOutOfStock ? (
                                                                        ` • Cost: ₹${itemCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/${product?.unit || 'KG'}${isCombined ? ` (Avg of ${item.batchAllocations.length} lots)` : ''}`
                                                                    ) : ''}
                                                                </p>
                                                            ) : itemCost > 0 && !isOutOfStock ? (
                                                                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1 pl-1 truncate h-4">
                                                                    Cost: ₹{itemCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/${product?.unit || 'KG'}
                                                                    {isCombined && (
                                                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-1">
                                                                            (Weighted avg of {item.batchAllocations.length} lots)
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            ) : (
                                                                <div className="h-4 mt-1" />
                                                            )}
                                                        </div>

                                                        {/* Line Total */}
                                                        <div className="sm:col-span-2 min-w-0 text-right pr-2">
                                                            <div className="h-10 flex flex-col justify-center">
                                                                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">
                                                                    ₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                                </div>
                                                                {itemQty > 0 && itemPrice > 0 && (
                                                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none mt-0.5">
                                                                        {baseQty.toLocaleString()} {product?.unit || 'KG'} × ₹{itemPrice}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <p className="text-[10px] mt-1 pr-0.5 truncate h-4 text-right">
                                                                {itemQty > 0 && itemPrice > 0 && itemCost > 0 ? (
                                                                    <span className={cn(
                                                                        "font-bold",
                                                                        hasProfit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                                                                    )}>
                                                                        {hasProfit ? '+' : '-'}₹{Math.abs(lineProfit).toLocaleString('en-IN')}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-slate-400 dark:text-slate-500 font-medium">Subtotal</span>
                                                                )}
                                                            </p>
                                                        </div>

                                                        {/* Action */}
                                                        <div className="sm:col-span-1 min-w-0 flex flex-col items-center">
                                                            <div className="h-10 flex items-center justify-center">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    disabled={formData.items.length <= 1}
                                                                    className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors shrink-0 disabled:opacity-20 cursor-pointer"
                                                                    onClick={() => removeItem(index)}
                                                                    title="Remove item"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </div>
                                                            <div className="h-4 mt-1" />
                                                        </div>
                                                    </div>

                                                    {/* Mobile Card View (sm:hidden) */}
                                                    <div className="sm:hidden space-y-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-3.5">
                                                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                                                            <div className="flex items-center gap-2">
                                                                <span className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
                                                                    #{index + 1}
                                                                </span>
                                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                                    {product ? product.name : 'New Sale Item'}
                                                                </span>
                                                            </div>
                                                            {formData.items.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-semibold cursor-pointer"
                                                                    onClick={() => removeItem(index)}
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                                    Remove
                                                                </Button>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                                                Product / Commodity <span className="text-rose-500">*</span>
                                                            </Label>
                                                            <CustomSelect
                                                                value={item.productId}
                                                                onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                                                placeholder="Select Item"
                                                                className="h-10 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                                                options={productOptions}
                                                            />
                                                            {product && (
                                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium pl-0.5">
                                                                    Base: {product.unit} {availableStock > 0 ? `• Available: ${availableStock} ${product.unit}` : '• Out of Stock'}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Mobile Batch Selection */}
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center justify-between">
                                                                <Label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                                                    Batch / Lot
                                                                </Label>
                                                                {availableBatches.length >= 2 && !isCombined && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setActiveBatchPickerRow(index)}
                                                                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                                                                    >
                                                                        <Layers className="h-3 w-3" />
                                                                        Combine Batches...
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {isCombined ? (
                                                                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-2 shadow-2xs">
                                                                    <div className="min-w-0">
                                                                        <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 truncate block">
                                                                            ⚡ Combined ({item.batchAllocations?.length} Lots)
                                                                        </span>
                                                                        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono font-bold block truncate">
                                                                            Blended Cost: ₹{itemCost.toFixed(2)}/{product?.unit || 'KG'}
                                                                        </span>
                                                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                                                                            {item.combinedDescription}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setActiveBatchPickerRow(index)}
                                                                            className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                                                                            title="Edit combined batch quantities"
                                                                        >
                                                                            <Pencil className="h-3.5 w-3.5" />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const firstBatch = availableBatches[0];
                                                                                const newItems = [...formData.items];
                                                                                newItems[index] = {
                                                                                    ...newItems[index],
                                                                                    batchId: firstBatch ? String(firstBatch.id || firstBatch._id) : '',
                                                                                    costPrice: firstBatch ? Number(firstBatch.purchasePrice ?? product?.baseCostPrice ?? 0) : Number(product?.baseCostPrice || 0),
                                                                                    batchAllocations: undefined,
                                                                                    combinedDescription: undefined,
                                                                                };
                                                                                setFormData({ ...formData, items: newItems });
                                                                            }}
                                                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                                                            title="Reset to single batch"
                                                                        >
                                                                            <X className="h-3.5 w-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <CustomSelect
                                                                        value={item.batchId}
                                                                        onChange={(e) => updateItem(index, 'batchId', e.target.value)}
                                                                        placeholder={availableBatches.length > 0 ? 'Select Batch' : 'No Batches'}
                                                                        className="h-10 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-slate-100"
                                                                        allowClear={false}
                                                                        options={batchOptions}
                                                                        disabled={!item.productId || availableBatches.length === 0}
                                                                    />
                                                                    {selectedBatch && (
                                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-0.5">
                                                                            Available in this batch: <strong>{Number(selectedBatch.quantity || 0)} {product?.unit}</strong> • Cost: <strong>₹{selectedBatch.purchasePrice || 0}/{product?.unit}</strong>
                                                                        </p>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2.5">
                                                            <div className="space-y-1.5">
                                                                <Label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                                                    Quantity <span className="text-rose-500">*</span>
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    disabled={isOutOfStock}
                                                                    className={cn(
                                                                        "h-10 rounded-xl text-xs sm:text-sm font-semibold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors",
                                                                        stockError && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20",
                                                                        isOutOfStock && "bg-slate-100/80 dark:bg-slate-800/60 cursor-not-allowed opacity-60 text-slate-400 border-slate-200/60 dark:border-slate-800/60"
                                                                    )}
                                                                    value={isOutOfStock ? '' : item.quantity}
                                                                    placeholder={isOutOfStock ? "0 (Out)" : "0.00"}
                                                                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                                    required={!isOutOfStock}
                                                                />
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <Label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                                                    Unit
                                                                </Label>
                                                                <CustomSelect
                                                                    value={selectedUnit}
                                                                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                                                                    options={unitOptions}
                                                                    disabled={isOutOfStock || !product}
                                                                    allowClear={false}
                                                                    placeholder="Unit"
                                                                    className="h-10 text-xs font-semibold rounded-xl"
                                                                />
                                                            </div>
                                                        </div>
                                                        {selectedUnit !== product?.unit && item.quantity && (
                                                            <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 pl-0.5">
                                                                = {baseQty.toLocaleString()} {product?.unit} from stock
                                                            </p>
                                                        )}
                                                        {stockError ? (
                                                            <p className="text-[10px] font-semibold text-rose-500 leading-tight">
                                                                {stockError}
                                                            </p>
                                                        ) : product ? (
                                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium pl-0.5">
                                                                Available in stock: {availableStock} {product.unit}
                                                            </p>
                                                        ) : null}

                                                        <div className="space-y-1.5">
                                                            <Label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                                                Rate (₹ / {product?.unit || 'KG'}) <span className="text-rose-500">*</span>
                                                            </Label>
                                                            <div className="relative">
                                                                <span className={cn(
                                                                    "absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold pointer-events-none",
                                                                    isOutOfStock ? "text-slate-300 dark:text-slate-600" : "text-slate-400"
                                                                )}>₹</span>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    disabled={isOutOfStock}
                                                                    className={cn(
                                                                        "h-10 pl-7 pr-14 rounded-xl text-xs sm:text-sm font-semibold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors",
                                                                        isOutOfStock && "bg-slate-100/80 dark:bg-slate-800/60 cursor-not-allowed opacity-60 text-slate-400 border-slate-200/60 dark:border-slate-800/60"
                                                                    )}
                                                                    value={isOutOfStock ? '' : item.salePrice}
                                                                    placeholder="0.00"
                                                                    onChange={(e) => updateItem(index, 'salePrice', e.target.value)}
                                                                    required={!isOutOfStock}
                                                                />
                                                                <span className={cn(
                                                                    "absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold pointer-events-none uppercase",
                                                                    isOutOfStock ? "text-slate-300 dark:text-slate-600" : "text-slate-400"
                                                                )}>
                                                                    /{product?.unit || 'KG'}
                                                                </span>
                                                            </div>
                                                            {selectedUnit !== product?.unit && itemPrice > 0 && (
                                                                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 pl-0.5">
                                                                    = ₹{(itemPrice * factor).toLocaleString('en-IN', { maximumFractionDigits: 2 })} / {selectedUnit}
                                                                </p>
                                                            )}
                                                            {itemCost > 0 && !isOutOfStock && (
                                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium pl-0.5">
                                                                    Cost: ₹{itemCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {product?.unit || 'KG'}
                                                                    {isCombined && (
                                                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-1">
                                                                            (Weighted avg of {item.batchAllocations.length} lots)
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between pt-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                                {itemQty > 0 && itemPrice > 0
                                                                    ? `Line Total (${baseQty.toLocaleString()} ${product?.unit || 'KG'} × ₹${itemPrice}):`
                                                                    : 'Line Total:'}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                                                                    ₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                                </span>
                                                                {itemCost > 0 && itemQty > 0 && (
                                                                    <span className={cn(
                                                                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                                                                        hasProfit ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400" : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                                                                    )}>
                                                                        {hasProfit ? '+' : '-'}₹{Math.abs(lineProfit).toLocaleString('en-IN')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Instant Stock Alert Banner */}
                                                    {stockError && (
                                                        <div className="mt-3 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold animate-in fade-in slide-in-from-top-1">
                                                            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                                                            <span className="flex-1">
                                                                <strong>Stock Alert:</strong> {stockError}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Table Bottom Action Bar */}
                                    <div className="bg-slate-50/70 dark:bg-slate-900/60 px-4 py-2.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={addItem}
                                            className="h-8 px-2.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            Add Another Line
                                        </Button>
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-2">Items Subtotal:</span>
                                            <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                                                ₹{subtotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Logistics & Delivery Charges Section */}
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 sm:p-5 space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            Logistics & Delivery Charges
                                        </Label>
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-400">Optional</span>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    {/* Labour Charge */}
                                    <div className="space-y-1">
                                        <Label htmlFor="laborCharge" className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                            <Users className="h-3.5 w-3.5 text-slate-400" /> Labour / Loading (₹)
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">₹</span>
                                            <Input
                                                id="laborCharge"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="h-10 pl-7 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                placeholder="0.00"
                                                value={formData.laborCharge}
                                                onChange={(e) => setFormData({ ...formData, laborCharge: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Vehicle Rent */}
                                    <div className="space-y-1">
                                        <Label htmlFor="vehicleRent" className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                            <Truck className="h-3.5 w-3.5 text-slate-400" /> Vehicle Rent / Freight (₹)
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">₹</span>
                                            <Input
                                                id="vehicleRent"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="h-10 pl-7 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                placeholder="0.00"
                                                value={formData.vehicleRent}
                                                onChange={(e) => setFormData({ ...formData, vehicleRent: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Other Charges */}
                                    <div className="space-y-1">
                                        <Label htmlFor="otherCharges" className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                            <Receipt className="h-3.5 w-3.5 text-slate-400" /> Other Charges (₹)
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">₹</span>
                                            <Input
                                                id="otherCharges"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="h-10 pl-7 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                placeholder="0.00"
                                                value={formData.otherCharges}
                                                onChange={(e) => setFormData({ ...formData, otherCharges: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment & Sale Summary */}
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-4 sm:p-5">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center">
                                    {/* Total Sale */}
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                            Total Sale
                                        </span>
                                        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                                            ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </div>
                                        {(parseFloat(formData.laborCharge) > 0 || parseFloat(formData.vehicleRent) > 0 || parseFloat(formData.otherCharges) > 0) ? (
                                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                                Incl. ₹{((parseFloat(formData.laborCharge) || 0) + (parseFloat(formData.vehicleRent) || 0) + (parseFloat(formData.otherCharges) || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })} extra charges
                                            </p>
                                        ) : (
                                            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                                Subtotal of {formData.items.length} {formData.items.length === 1 ? 'item' : 'items'}
                                            </p>
                                        )}
                                    </div>

                                    {/* Payment Received Input */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="paidAmount" className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                                Payment Received (₹) <span className="text-rose-500">*</span>
                                            </Label>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, paidAmount: String(totalAmount) })}
                                                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:underline cursor-pointer"
                                            >
                                                Paid in Full
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                                            <Input
                                                id="paidAmount"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="h-10 pl-7 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                placeholder="0.00"
                                                value={formData.paidAmount}
                                                onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Balance Due */}
                                    <div className="space-y-1 sm:text-right">
                                        <div className="flex items-center sm:justify-end gap-2">
                                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                Balance Due
                                            </span>
                                            <span className={cn(
                                                "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                                dueAmount <= 0
                                                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60"
                                                    : paidAmount > 0
                                                        ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60"
                                                        : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/60"
                                            )}>
                                                {dueAmount <= 0 ? "Paid in Full" : paidAmount > 0 ? "Partial" : "Unpaid"}
                                            </span>
                                        </div>
                                        <div className={cn(
                                            "text-xl sm:text-2xl font-black",
                                            dueAmount > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                                        )}>
                                            ₹{Math.max(0, dueAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                {hasStockErrors ? (
                                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 text-xs font-semibold">
                                        <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                                        <span>Cannot submit: Stock limit exceeded in one or more items</span>
                                    </div>
                                ) : !formData.customerId ? (
                                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 text-xs font-medium">
                                        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                                        <span>Please select a customer above</span>
                                    </div>
                                ) : (
                                    <div />
                                )}
                                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full sm:w-auto rounded-xl h-11 px-5 sm:px-6 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                                        onClick={() => setShowCreateModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={submitting || hasStockErrors}
                                        className="w-full sm:w-auto rounded-xl h-11 px-6 sm:px-7 font-bold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-500/20 text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {submitting ? 'Recording Transaction...' : hasStockErrors ? 'Blocked by Stock Error' : 'Confirm & Log Sale'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Edit Payment Modal */}
            <Dialog.Root open={showEditModal} onOpenChange={setShowEditModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <Dialog.Content translate="no" className="notranslate fixed left-1/2 top-1/2 z-50 w-[95vw] sm:w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-slate-950 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                        {/* Header */}
                        <div className="sticky top-0 z-20 shrink-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex justify-between items-center rounded-t-2xl shadow-xs relative">
                            <div className="flex items-center gap-3.5">
                                <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
                                    <Wallet className="h-6 w-6" />
                                </div>
                                <div>
                                    <Dialog.Title className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                        Update Payment
                                    </Dialog.Title>
                                    <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                                        Adjust collection receipt & outstanding balance
                                    </Dialog.Description>
                                </div>
                            </div>
                            <Dialog.Close asChild>
                                <button
                                    type="button"
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                                    aria-label="Close dialog"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </Dialog.Close>
                            <div className="absolute -bottom-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleUpdateSale} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
                            {/* Total Card */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    Gross Invoice Value
                                </Label>
                                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 text-center">
                                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                                        Invoice Total
                                    </p>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                                        ₹{Number(editFormData.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            {/* Paid Input */}
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="editPaidAmount"
                                    className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                                >
                                    Collected Amount (₹) <span className="text-rose-500">*</span>
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                                    <Input
                                        id="editPaidAmount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="h-11 sm:h-12 pl-8 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:text-slate-100 font-bold text-base transition-all"
                                        value={editFormData.paidAmount}
                                        onChange={(e) =>
                                            setEditFormData({
                                                ...editFormData,
                                                paidAmount: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            {/* Balance Card */}
                            <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                    Balance Due
                                </span>
                                <span
                                    className={cn(
                                        "font-black text-base sm:text-lg",
                                        (Number(editFormData.totalAmount) - parseFloat(editFormData.paidAmount || 0)) > 0
                                            ? "text-rose-600 dark:text-rose-400"
                                            : "text-emerald-600 dark:text-emerald-400"
                                    )}
                                >
                                    ₹{Math.max(0, Number(editFormData.totalAmount) - parseFloat(editFormData.paidAmount || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowEditModal(false)}
                                    className="w-full sm:w-auto rounded-xl h-11 px-5 sm:px-6 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full sm:w-auto rounded-xl h-11 px-6 sm:px-7 font-bold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-500/20 text-xs sm:text-sm transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {submitting ? "Updating..." : "Save Payment"}
                                </Button>
                            </div>
                        </form>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>


            {/* View Bill Modal */}
            <Dialog.Root open={showViewModal} onOpenChange={setShowViewModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm" />
                    <Dialog.Content translate="no" className="notranslate fixed left-1/2 top-1/2 z-50 w-[95vw] sm:w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-slate-950 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
                        {selectedSale && (
                            <>
                                {/* Header */}
                                <div className="sticky top-0 z-20 shrink-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex justify-between items-center rounded-t-2xl shadow-xs relative">
                                    <div className="flex items-center gap-3.5">
                                        <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
                                            <BadgeDollarSign className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <Dialog.Title asChild>
                                                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Sale Invoice</h2>
                                            </Dialog.Title>
                                            <Dialog.Description asChild>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">Ref: {selectedSale.id.slice(-8).toUpperCase()}</p>
                                            </Dialog.Description>
                                        </div>
                                    </div>
                                    <Dialog.Close asChild>
                                        <button
                                            type="button"
                                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                                            aria-label="Close dialog"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </Dialog.Close>
                                    <div className="absolute -bottom-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                                </div>

                                {/* Body */}
                                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                                    {/* Meta */}
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Customer */}
                                        <div className="space-y-1">
                                            <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Customer</Label>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-semibold border dark:border-slate-800 dark:text-slate-100">
                                                    {selectedSale.customer?.name?.[0] || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-slate-100">{selectedSale.customer?.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{selectedSale.customer?.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Date */}
                                        <div className="text-right space-y-1">
                                            <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Date</Label>
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">{new Date(selectedSale.createdAt).toLocaleDateString()}</p>
                                            <span className={cn(
                                                "inline-block rounded-md px-2 py-1 text-xs font-medium",
                                                (selectedSale.dueAmount || 0) <= 0 ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400"
                                            )}>
                                                {(selectedSale.dueAmount || 0) <= 0 ? "Settled" : "Pending"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Items Table */}
                                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800">
                                                <tr>
                                                    <th className="p-3 text-left font-medium text-slate-600 dark:text-slate-400">Product</th>
                                                    <th className="p-3 text-right font-medium text-slate-600 dark:text-slate-400">Qty</th>
                                                    <th className="p-3 text-right font-medium text-slate-600 dark:text-slate-400">Price</th>
                                                    <th className="p-3 text-right font-medium text-slate-600 dark:text-slate-400">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y dark:divide-slate-800">
                                                {selectedSale.items?.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="p-3">
                                                            <p className="font-medium text-slate-900 dark:text-slate-100">{item.product?.name}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">{item.product?.unit}</p>
                                                        </td>
                                                        <td className="p-3 text-right text-slate-600 dark:text-slate-400">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="p-3 text-right text-slate-600 dark:text-slate-400">
                                                            ₹{item.salePrice.toLocaleString()}
                                                        </td>
                                                        <td className="p-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                                            ₹{(item.salePrice * item.quantity).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Summary */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-end gap-6 text-slate-600 dark:text-slate-400">
                                            <span>Items Subtotal</span>
                                            <span className="font-semibold w-28 text-right dark:text-slate-100 italic">
                                                ₹{Number(selectedSale.subtotal || selectedSale.items?.reduce((s, it) => s + (it.salePrice * it.quantity || 0), 0) || 0).toLocaleString()}
                                            </span>
                                        </div>

                                        {Number(selectedSale.laborCharge) > 0 && (
                                            <div className="flex justify-end gap-6 text-slate-600 dark:text-slate-400">
                                                <span>Labour Charge</span>
                                                <span className="font-semibold w-28 text-right dark:text-slate-100 italic">
                                                    + ₹{Number(selectedSale.laborCharge).toLocaleString()}
                                                </span>
                                            </div>
                                        )}

                                        {Number(selectedSale.vehicleRent) > 0 && (
                                            <div className="flex justify-end gap-6 text-slate-600 dark:text-slate-400">
                                                <span>Vehicle Rent</span>
                                                <span className="font-semibold w-28 text-right dark:text-slate-100 italic">
                                                    + ₹{Number(selectedSale.vehicleRent).toLocaleString()}
                                                </span>
                                            </div>
                                        )}

                                        {Number(selectedSale.otherCharges) > 0 && (
                                            <div className="flex justify-end gap-6 text-slate-600 dark:text-slate-400">
                                                <span>Other Charges</span>
                                                <span className="font-semibold w-28 text-right dark:text-slate-100 italic">
                                                    + ₹{Number(selectedSale.otherCharges).toLocaleString()}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-6 text-slate-900 dark:text-slate-100 font-bold pt-1 border-t dark:border-slate-800">
                                            <span>Total Gross Sale</span>
                                            <span className="w-28 text-right italic font-black">₹{selectedSale.totalAmount.toLocaleString()}</span>
                                        </div>

                                        <div className="flex justify-end gap-6 text-slate-600 dark:text-slate-400 border-b dark:border-slate-800 pb-2">
                                            <span>Amount Collected</span>
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400 w-28 text-right italic">₹{(selectedSale.paidAmount || 0).toLocaleString()}</span>
                                        </div>

                                        <div className="flex justify-end gap-6 pt-2 border-t dark:border-slate-0">
                                            <span className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[10px] mt-1">Balance Due</span>
                                            <span className={cn(
                                                "text-2xl font-black italic tracking-tighter",
                                                (selectedSale.dueAmount || 0) > 0 ? "text-rose-500 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-500"
                                            )}>₹{(selectedSale.dueAmount || 0).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <Button
                                            onClick={handlePrintBill}
                                            className="flex-1 h-11 sm:h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Printer className="h-4 w-4" />
                                            Print Statement
                                        </Button>
                                        <Dialog.Close asChild>
                                            <Button
                                                variant="outline"
                                                className="h-11 sm:h-12 rounded-xl px-6 font-semibold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs sm:text-sm transition-all cursor-pointer"
                                            >
                                                Close
                                            </Button>
                                        </Dialog.Close>
                                    </div>
                                </div>
                            </>
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Combine Batches for Sale Modal */}
            <Dialog.Root open={activeBatchPickerRow !== null} onOpenChange={(open) => { if (!open) { setActiveBatchPickerRow(null); setMultiBatchQtys({}); } }}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <Dialog.Content translate="no" className="notranslate fixed left-1/2 top-1/2 z-50 w-[95vw] sm:w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-slate-950 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                        {/* Header */}
                        <div className="sticky top-0 z-20 shrink-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex justify-between items-center rounded-t-2xl shadow-xs relative">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs">
                                    <Layers className="h-5 w-5" />
                                </div>
                                <div>
                                    <Dialog.Title asChild>
                                        <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                            Combine Batches for Sale
                                            {effectiveCombineRow !== null && (
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                    Row #{effectiveCombineRow + 1}
                                                </span>
                                            )}
                                        </h2>
                                    </Dialog.Title>
                                    <Dialog.Description asChild>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            Product: <strong className="text-slate-800 dark:text-slate-200">{activeCombineProduct?.name || 'Item'}</strong> • Available Stock: <strong className="text-emerald-600 dark:text-emerald-400">{activeCombineProduct?.currentStock || 0} {activeCombineProduct?.unit || 'KG'}</strong>
                                        </p>
                                    </Dialog.Description>
                                </div>
                            </div>
                            <Dialog.Close asChild>
                                <button
                                    type="button"
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                                    aria-label="Close dialog"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </Dialog.Close>
                            <div className="absolute -bottom-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                            {/* Explanatory banner */}
                            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed flex items-start gap-2.5">
                                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold">
                                        Combine portions from multiple batches to sell in 1 consolidated invoice item.
                                    </p>
                                    <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5 font-mono">
                                        Blended Cost Rate = Total Merged Valuation ÷ Total Combined Quantity
                                    </p>
                                </div>
                            </div>

                            {/* Batches Table / List */}
                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
                                <div className="bg-slate-50 dark:bg-slate-900/80 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                    <span>Active Lots ({activeCombineBatches.length})</span>
                                    <div className="flex items-center gap-2 text-[11px] font-medium lowercase">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const all = {};
                                                activeCombineBatches.forEach(b => {
                                                    all[String(b.id || b._id)] = String(Number(b.quantity || 0));
                                                });
                                                setMultiBatchQtys(all);
                                            }}
                                            className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-bold capitalize"
                                        >
                                            ⚡ Select All (Max)
                                        </button>
                                        <span className="text-slate-300 dark:text-slate-600">•</span>
                                        <button
                                            type="button"
                                            onClick={() => setMultiBatchQtys({})}
                                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer capitalize"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </div>

                                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[300px] overflow-y-auto">
                                    {activeCombineBatches.length > 0 ? (
                                        activeCombineBatches.map((b, idx) => {
                                            const bId = String(b.id || b._id);
                                            const avail = Number(b.quantity || 0);
                                            const cost = Number(b.purchasePrice ?? (activeCombineProduct?.baseCostPrice || 0));
                                            const currentQty = multiBatchQtys[bId] ?? '';
                                            const numQty = parseFloat(currentQty) || 0;
                                            const isSelected = numQty > 0;
                                            const isOverLimit = numQty > avail;
                                            const subtotalVal = numQty * cost;
                                            const isOldest = idx === 0;

                                            return (
                                                <div
                                                    key={bId}
                                                    className={cn(
                                                        "p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors",
                                                        isSelected ? "bg-indigo-50/30 dark:bg-indigo-950/20" : "bg-white dark:bg-slate-950",
                                                        isOverLimit && "bg-rose-50/50 dark:bg-rose-950/20"
                                                    )}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                                                {b.batchNumber || `BCH-${1000 + (idx + 1)}`}
                                                            </span>
                                                            {isOldest && (
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                                                    FIFO (Oldest)
                                                                </span>
                                                            )}
                                                            <span className="text-xs font-semibold text-slate-500">
                                                                Avail: <strong className="text-slate-800 dark:text-slate-200">{avail.toLocaleString()} {activeCombineProduct?.unit || 'KG'}</strong>
                                                            </span>
                                                            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                                                                @ ₹{cost.toLocaleString('en-IN')}/{activeCombineProduct?.unit || 'KG'}
                                                            </span>
                                                        </div>
                                                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                                                            <span>Inward: {b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Stock Batch'}</span>
                                                            {isSelected && !isOverLimit && (
                                                                <span className="text-indigo-600 dark:text-indigo-400 font-semibold font-mono">
                                                                    Contrib: ₹{subtotalVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </span>
                                                            )}
                                                            {isOverLimit && (
                                                                <span className="text-rose-600 dark:text-rose-400 font-bold">
                                                                    Exceeds lot stock ({avail} {activeCombineProduct?.unit || 'KG'})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <div className="relative">
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                max={avail}
                                                                step="any"
                                                                placeholder="0"
                                                                value={currentQty}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    setMultiBatchQtys(prev => ({ ...prev, [bId]: val }));
                                                                }}
                                                                className={cn(
                                                                    "w-28 h-9 text-right font-mono font-bold text-xs rounded-lg pr-7",
                                                                    isOverLimit
                                                                        ? "border-rose-400 focus:ring-rose-400"
                                                                        : isSelected
                                                                        ? "border-indigo-400 focus:ring-indigo-400"
                                                                        : ""
                                                                )}
                                                            />
                                                            <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-bold uppercase pointer-events-none">
                                                                {activeCombineProduct?.unit || 'KG'}
                                                            </span>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setMultiBatchQtys(prev => ({ ...prev, [bId]: String(avail) }))}
                                                            className="h-9 px-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg cursor-pointer"
                                                            title="Take entire lot quantity"
                                                        >
                                                            Max
                                                        </Button>
                                                        {isSelected && (
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => setMultiBatchQtys(prev => ({ ...prev, [bId]: '' }))}
                                                                className="h-9 w-8 p-0 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                                                                title="Clear quantity"
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="py-8 text-center text-slate-400 text-xs">
                                            No active batches available for this product.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Consolidation Live Preview Summary */}
                            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/30 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-indigo-100 dark:border-indigo-900/50">
                                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 uppercase tracking-wider">
                                        <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        Consolidation Live Preview
                                    </span>
                                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                        {combineSelectedCount} {combineSelectedCount === 1 ? 'Lot' : 'Lots'} Selected
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                    <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Combined Total Qty</div>
                                        <div className="text-base font-black text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                                            {combineTotalQty.toLocaleString()} {activeCombineProduct?.unit || 'KG'}
                                        </div>
                                    </div>

                                    <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Merged Valuation</div>
                                        <div className="text-base font-black text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                                            ₹{combineTotalVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </div>

                                    <div className="bg-indigo-600 text-white p-3 rounded-lg shadow-xs">
                                        <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">Weighted Avg Cost Rate</div>
                                        <div className="text-lg font-black font-mono mt-0.5 flex items-baseline gap-1">
                                            ₹{combineBlendedAvgCost.toFixed(2)}
                                            <span className="text-xs font-normal text-indigo-200">/{activeCombineProduct?.unit || 'KG'}</span>
                                        </div>
                                    </div>
                                </div>

                                {combineSelectedCount >= 2 && combineTotalQty > 0 && (
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-white/60 dark:bg-slate-900/60 p-2 rounded border border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
                                        <span>Weighted Avg Formula:</span>
                                        <span className="font-bold text-indigo-700 dark:text-indigo-300">
                                            ₹{combineTotalVal.toFixed(2)} ÷ {combineTotalQty} {activeCombineProduct?.unit || 'KG'} = ₹{combineBlendedAvgCost.toFixed(2)}/{activeCombineProduct?.unit || 'KG'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 z-20 shrink-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 sm:px-6 flex items-center justify-between gap-3 rounded-b-2xl">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => { setActiveBatchPickerRow(null); setMultiBatchQtys({}); }}
                                className="rounded-xl px-4 text-xs font-bold cursor-pointer"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="button"
                                onClick={handleCombineIntoSingleSaleItem}
                                disabled={combineSelectedCount < 1 || combineTotalQty <= 0 || combineHasExceeded}
                                className="rounded-xl px-5 text-xs font-black bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 transition-all"
                            >
                                <Layers className="h-4 w-4" />
                                Apply Combined Batches to Sale {combineBlendedAvgCost > 0 ? `(Avg: ₹${combineBlendedAvgCost.toFixed(2)}/${activeCombineProduct?.unit || 'KG'})` : ''}
                            </Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}

export default function SalesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mb-4" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Loading Sales Terminal...
                </p>
            </div>
        }>
            <SalesPageContent />
        </Suspense>
    );
}
