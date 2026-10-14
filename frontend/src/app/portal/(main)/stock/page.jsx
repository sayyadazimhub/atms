'use client';

import { useEffect, useState, useMemo, Fragment } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Search,
  AlertTriangle,
  Package,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  History,
  Boxes,
  IndianRupee,
  Printer,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
  Layers,
  Sparkles,
  RefreshCw,
  X,
  Check,
  Calculator,
  Info
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/portal/PageHeader';
import { formatStockSecondaryUnits } from '@/lib/units';
import Link from 'next/link';

export default function StockMonitorPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'IN_STOCK', 'LOW_STOCK', 'DEPLETED'
  const [expandedProducts, setExpandedProducts] = useState(new Set());

  // Permanent Batch Combination State (Inventory Merging)
  const [combineModalProduct, setCombineModalProduct] = useState(null);
  const [combineBatchQtys, setCombineBatchQtys] = useState({});
  const [customMergedBatchNumber, setCustomMergedBatchNumber] = useState('');
  const [isSubmittingCombine, setIsSubmittingCombine] = useState(false);

  const openCombineModal = (product) => {
    setCombineModalProduct(product);
    const initialQtys = {};
    const active = (product.batches || []).filter(b => Number(b.quantity || 0) > 0);
    active.forEach(b => {
      initialQtys[b.id || b._id] = Number(b.quantity || 0);
    });
    setCombineBatchQtys(initialQtys);
    setCustomMergedBatchNumber(`BCH-COMBINED-${Date.now().toString().slice(-4)}`);
  };

  const combineStats = useMemo(() => {
    if (!combineModalProduct) return { totalQty: 0, totalVal: 0, avgCost: 0, count: 0, hasExceeded: false };
    let totalQty = 0;
    let totalVal = 0;
    let count = 0;
    let hasExceeded = false;

    for (const b of (combineModalProduct.batches || [])) {
      const bId = b.id || b._id;
      const q = parseFloat(combineBatchQtys[bId]) || 0;
      const avail = Number(b.quantity || 0);
      if (q > avail) hasExceeded = true;
      if (q > 0) {
        count += 1;
        const rate = Number(b.purchasePrice ?? combineModalProduct.baseCostPrice ?? 0);
        totalQty += q;
        totalVal += q * rate;
      }
    }

    const avgCost = totalQty > 0 ? (totalVal / totalQty) : 0;
    return { totalQty, totalVal, avgCost, count, hasExceeded };
  }, [combineModalProduct, combineBatchQtys]);

  const handleCombineSubmit = async (e) => {
    e?.preventDefault();
    if (!combineModalProduct) return;

    const allocations = [];
    for (const b of (combineModalProduct.batches || [])) {
      const bId = b.id || b._id;
      const q = parseFloat(combineBatchQtys[bId]) || 0;
      if (q > 0) {
        const maxAvail = Number(b.quantity || 0);
        if (q > maxAvail) {
          toast.error(`Quantity for lot ${b.batchNumber || bId} cannot exceed available stock (${maxAvail} ${combineModalProduct.unit})`);
          return;
        }
        allocations.push({ batchId: bId, quantity: q });
      }
    }

    if (allocations.length < 2) {
      toast.error('Please allocate quantities from at least 2 batches to combine them.');
      return;
    }

    try {
      setIsSubmittingCombine(true);
      const res = await api.post(`/api/user/products/${combineModalProduct.id || combineModalProduct._id}/combine-batches`, {
        batchAllocations: allocations,
        mergedBatchNumber: customMergedBatchNumber.trim() || undefined
      });

      toast.success(res.data?.message || `Batches combined! Merged lot created at ₹${res.data?.weightedAvgPrice}/${combineModalProduct.unit}`);
      setCombineModalProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Failed to combine batches:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to combine batches';
      toast.error(msg);
    } finally {
      setIsSubmittingCombine(false);
    }
  };

  const toggleExpand = (productId) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const expandAll = () => {
    if (expandedProducts.size === products.length) {
      setExpandedProducts(new Set());
    } else {
      setExpandedProducts(new Set(products.map(p => p.id || p._id)));
    }
  };

  const fetchProducts = () => {
    setLoading(true);
    api
      .get(`/api/user/products?page=${pagination.page}&search=${search}&limit=50`)
      .then((res) => {
        setProducts(res.data?.products || []);
        setPagination(res.data?.pagination || { page: 1, pages: 1 });
      })
      .catch(() => toast.error('Failed to load inventory'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, search]);

  // Financial & Inventory Valuation Helpers
  const calculateProductValuation = (product) => {
    const stock = Number(product.currentStock) || 0;
    if (stock <= 0) return 0;
    if (product.batches && product.batches.length > 0) {
      let batchVal = 0;
      let trackedQty = 0;
      for (const b of product.batches) {
        const bQty = Number(b.quantity) || 0;
        const bPrice = Number(b.purchasePrice) || Number(product.baseCostPrice) || 0;
        batchVal += bQty * bPrice;
        trackedQty += bQty;
      }
      const remainder = Math.max(0, stock - trackedQty);
      return batchVal + remainder * (Number(product.baseCostPrice) || 0);
    }
    return stock * (Number(product.baseCostPrice) || 0);
  };

  const getProductAvgCost = (product) => {
    const stock = Number(product.currentStock) || 0;
    if (stock <= 0) return Number(product.baseCostPrice) || 0;
    const valuation = calculateProductValuation(product);
    return valuation / stock;
  };

  // Executive KPI stats
  const totalValuation = useMemo(() => {
    return products.reduce((acc, p) => acc + calculateProductValuation(p), 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter(p => Number(p.currentStock || 0) > 0 && Number(p.currentStock || 0) <= 10).length;
  }, [products]);

  const depletedCount = useMemo(() => {
    return products.filter(p => Number(p.currentStock || 0) <= 0).length;
  }, [products]);

  const inStockCount = useMemo(() => {
    return products.filter(p => Number(p.currentStock || 0) > 10).length;
  }, [products]);

  const totalPhysicalUnits = useMemo(() => {
    return products.reduce((acc, p) => acc + (Number(p.currentStock) || 0), 0);
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const stock = Number(p.currentStock || 0);
      if (statusFilter === 'LOW_STOCK') return stock > 0 && stock <= 10;
      if (statusFilter === 'DEPLETED') return stock <= 0;
      if (statusFilter === 'IN_STOCK') return stock > 10;
      return true;
    });
  }, [products, statusFilter]);

  const getStatusBadge = (stock) => {
    if (stock <= 0) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 text-[10px] font-black text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60 uppercase tracking-wider">
          <XCircle className="h-3 w-3" /> Depleted
        </span>
      );
    }
    if (stock <= 10) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 text-[10px] font-black text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60 uppercase tracking-wider">
          <AlertTriangle className="h-3 w-3" /> Critical ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-[10px] font-black text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60 uppercase tracking-wider">
        <CheckCircle2 className="h-3 w-3" /> Stable
      </span>
    );
  };

  // Professional Printable Stock Audit Sheet
  const handlePrintAuditSheet = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const rowsHtml = products.map((p, idx) => {
      const stock = Number(p.currentStock || 0);
      const avgCost = getProductAvgCost(p);
      const val = calculateProductValuation(p);
      const secondary = formatStockSecondaryUnits(stock, p.unit);
      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 8px; text-align: center; color: #64748b; font-size: 11px;">${idx + 1}</td>
          <td style="padding: 10px 8px;">
            <div style="font-weight: 700; color: #0f172a; font-size: 13px;">${p.name}</div>
            <div style="font-size: 10px; color: #64748b;">${p.batches?.length || 0} batches tracked</div>
          </td>
          <td style="padding: 10px 8px; text-align: center; font-weight: 700; color: #334155;">${p.unit}</td>
          <td style="padding: 10px 8px; text-align: right; font-weight: 800; color: #0f172a; font-family: monospace;">
            ${stock.toLocaleString()} ${p.unit}
            ${secondary ? `<div style="font-size: 10px; color: #059669; font-weight: 600;">${secondary}</div>` : ''}
          </td>
          <td style="padding: 10px 8px; text-align: right; color: #475569; font-family: monospace;">
            ₹${avgCost.toFixed(2)}
          </td>
          <td style="padding: 10px 8px; text-align: right; font-weight: 800; color: #0f172a; font-family: monospace;">
            ₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
          <td style="padding: 10px 8px; text-align: center; border-left: 1px dashed #cbd5e1; width: 100px;">
            <div style="border-bottom: 1px solid #94a3b8; height: 18px; margin: 0 5px;"></div>
          </td>
          <td style="padding: 10px 8px; text-align: center; border-left: 1px dashed #cbd5e1; width: 80px;">
            <div style="border-bottom: 1px solid #94a3b8; height: 18px; margin: 0 5px;"></div>
          </td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>ATMS Physical Stock Audit Sheet - ${dateStr}</title>
          <style>
            @media print {
              @page { size: A4 landscape; margin: 12mm; }
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; -webkit-print-color-adjust: exact; margin: 0; }
            }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { background: #f8fafc; color: #475569; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; padding: 8px; border-bottom: 2px solid #cbd5e1; }
          </style>
        </head>
        <body>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 15px; border-bottom: 2px solid #0f172a; margin-bottom: 15px;">
            <div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 900; color: #0f172a; letter-spacing: -0.02em;">ATMS PHYSICAL STOCK AUDIT SHEET</h1>
              <p style="margin: 3px 0 0; font-size: 11px; color: #64748b; font-weight: 500;">Warehouse Inventory Verification & Capital Valuation Report</p>
            </div>
            <div style="text-align: right; font-size: 11px;">
              <div><strong>Audit Date:</strong> ${dateStr} at ${timeStr}</div>
              <div style="color: #64748b;"><strong>Total Commodities:</strong> ${products.length} Items</div>
              <div style="color: #059669; font-weight: 800; font-size: 13px; margin-top: 2px;">
                Total Asset Value: ₹${totalValuation.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 4%; text-align: center;">#</th>
                <th style="width: 25%; text-align: left;">Commodity Name</th>
                <th style="width: 8%; text-align: center;">Base Unit</th>
                <th style="width: 18%; text-align: right;">System Stock</th>
                <th style="width: 13%; text-align: right;">Avg Cost (₹)</th>
                <th style="width: 16%; text-align: right;">Total Asset Value (₹)</th>
                <th style="width: 10%; text-align: center; background: #eff6ff; color: #1e40af;">Physical Count</th>
                <th style="width: 6%; text-align: center; background: #eff6ff; color: #1e40af;">Diff (±)</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #f8fafc; font-weight: 800; border-top: 2px solid #cbd5e1;">
                <td colspan="3" style="padding: 12px 8px; text-transform: uppercase; font-size: 11px;">Consolidated Portfolio Valuation</td>
                <td style="padding: 12px 8px; text-align: right; font-family: monospace;">${totalPhysicalUnits.toLocaleString()} Units</td>
                <td style="padding: 12px 8px; text-align: right;">-</td>
                <td style="padding: 12px 8px; text-align: right; font-family: monospace; color: #059669; font-size: 14px;">
                  ₹${totalValuation.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td colspan="2" style="background: #eff6ff;"></td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 40px; display: flex; justify-content: space-between; padding: 0 30px;">
            <div style="text-align: center;">
              <div style="border-top: 1px solid #94a3b8; width: 220px; padding-top: 6px; font-size: 11px; font-weight: 700; color: #334155;">
                Warehouse Supervisor Signature
              </div>
            </div>
            <div style="text-align: center;">
              <div style="border-top: 1px solid #94a3b8; width: 220px; padding-top: 6px; font-size: 11px; font-weight: 700; color: #334155;">
                Stock Auditor Signature
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <PageHeader 
        title="Stock & Inventory Monitor"
        description="Real-time multi-unit warehouse stock tracking, FIFO batch audits, and asset valuation"
        icon={Boxes}
        actionButton={
          <div className="flex items-center gap-2.5">
            <Button
              onClick={handlePrintAuditSheet}
              variant="outline"
              className="rounded-xl h-11 px-4 font-bold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
              title="Print Physical Stock Audit Sheet"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span className="hidden sm:inline">Print Stock Sheet</span>
            </Button>

            <Link href="/portal/purchases">
              <Button
                variant="outline"
                className="rounded-xl h-11 px-4 font-bold border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 shadow-2xs hover:bg-emerald-100/60 dark:hover:bg-emerald-900/60 transition-all flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">+ Restock</span>
              </Button>
            </Link>

            <Link href="/portal/products">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 rounded-xl h-11 px-4 sm:px-5 font-bold shadow-sm transition-all flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Manage SKUs</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Professional Executive Inventory KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Stock Asset Value */}
        <Card className="border border-emerald-200/80 dark:border-emerald-900/50 shadow-sm rounded-2xl bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-900 dark:to-emerald-950/20 backdrop-blur-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Stock Valuation
              </p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">
                ₹{totalValuation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-500 font-medium">
                Warehouse capital asset value
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <IndianRupee className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Total Commodities */}
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Catalog SKUs
              </p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                {products.length} Commodities
              </p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                {inStockCount} In Stock • {depletedCount} Depleted
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
              <Boxes className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Stable Stock Items */}
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Optimal Inventory
              </p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {inStockCount} Items
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Above safety threshold
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Reorder Alerts
              </p>
              <p className={cn(
                "text-2xl sm:text-3xl font-black",
                lowStockCount + depletedCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-slate-100"
              )}>
                {lowStockCount + depletedCount} Items
              </p>
              <p className={cn(
                "text-[11px] font-medium",
                lowStockCount + depletedCount > 0 ? "text-amber-600 dark:text-amber-400 font-semibold" : "text-slate-400 dark:text-slate-500"
              )}>
                {lowStockCount > 0 ? `${lowStockCount} Low` : 'No Critical'} • {depletedCount > 0 ? `${depletedCount} Out` : '0 Depleted'}
              </p>
            </div>
            <div className={cn(
              "p-3.5 rounded-2xl border shrink-0",
              lowStockCount + depletedCount > 0
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
            )}>
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Stock Registry Card */}
      <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <CardTitle className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                  Warehouse Inventory Registry
                </CardTitle>
                <span className="bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2 py-0.5 rounded-lg font-bold">
                  {filteredProducts.length} items
                </span>
              </div>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time stock balance, FIFO batch distribution, and cost valuations
              </CardDescription>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
              {/* Status Filter Pills */}
              <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer",
                    statusFilter === 'ALL'
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
                  )}
                >
                  All ({products.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('IN_STOCK')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer",
                    statusFilter === 'IN_STOCK'
                      ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
                  )}
                >
                  In Stock ({inStockCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('LOW_STOCK')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer",
                    statusFilter === 'LOW_STOCK'
                      ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
                  )}
                >
                  Low Stock ({lowStockCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('DEPLETED')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer",
                    statusFilter === 'DEPLETED'
                      ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
                  )}
                >
                  Out ({depletedCount})
                </button>
              </div>

              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Search commodity..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 sm:h-10 text-xs sm:text-sm rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus-visible:ring-emerald-500"
                />
              </div>

              {/* Expand All Batches */}
              <Button
                variant="ghost"
                size="sm"
                onClick={expandAll}
                className="h-9 sm:h-10 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl border border-slate-200/80 dark:border-slate-800 px-3 shrink-0 cursor-pointer"
                title={expandedProducts.size === products.length ? 'Collapse All Batches' : 'Expand All Batches'}
              >
                <Layers className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                {expandedProducts.size === products.length ? 'Collapse All' : 'Batches'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
              <p className="text-xs font-semibold text-slate-400 animate-pulse">Loading warehouse inventory...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-sm text-slate-600 dark:text-slate-400">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-4 text-left w-[28%]">Commodity / SKU</th>
                    <th className="py-3 px-4 text-left w-[14%]">Status</th>
                    <th className="py-3 px-4 text-right w-[18%]">Warehouse Stock</th>
                    <th className="py-3 px-4 text-right w-[15%]">
                      <div>Valuation Rate</div>
                      <div className="text-[9px] font-semibold text-slate-400 normal-case tracking-normal">Weighted Avg Cost</div>
                    </th>
                    <th className="py-3 px-4 text-right w-[15%]">Stock Value (₹)</th>
                    <th className="py-3 px-4 text-center w-[10%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredProducts.map((p) => {
                    const productId = p.id || p._id;
                    const stock = Number(p.currentStock || 0);
                    const avgCost = getProductAvgCost(p);
                    const valuation = calculateProductValuation(p);
                    const isExpanded = expandedProducts.has(productId);
                    const secondaryText = formatStockSecondaryUnits(stock, p.unit);
                    const activeBatches = p.batches?.filter(b => Number(b.quantity || 0) > 0) || [];

                    return (
                      <Fragment key={productId}>
                        <tr
                          onClick={() => toggleExpand(productId)}
                          className={cn(
                            "transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer group",
                            isExpanded && "bg-slate-50/50 dark:bg-slate-900/60"
                          )}
                        >
                          {/* Commodity Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black text-sm border border-slate-200/80 dark:border-slate-700 shadow-2xs group-hover:scale-105 transition-transform">
                                {p.name[0]?.toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                                    {p.name}
                                  </p>
                                  {activeBatches.length > 0 && (
                                    <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-md font-extrabold border border-emerald-200/80 dark:border-emerald-900/60 shrink-0">
                                      {activeBatches.length} {activeBatches.length === 1 ? 'Batch' : 'Batches'}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                                    Base: {p.unit}
                                  </span>
                                  {p.baseSalePrice > 0 && (
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                      • Rec. Sale: ₹{p.baseSalePrice}/{p.unit}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {getStatusBadge(stock)}
                          </td>

                          {/* Warehouse Stock */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="font-mono font-black text-base text-slate-900 dark:text-slate-100">
                              {stock.toLocaleString()} <span className="text-xs font-bold text-slate-400">{p.unit}</span>
                            </div>
                            {secondaryText ? (
                              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                                {secondaryText}
                              </p>
                            ) : (
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                Standard Stock
                              </p>
                            )}
                          </td>

                          {/* Valuation Rate */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                              ₹{avgCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              <span className="text-[10px] text-slate-400 font-semibold uppercase"> /{p.unit}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                              {activeBatches.length > 1 ? `Avg of ${activeBatches.length} active lots` : activeBatches.length === 1 ? 'Single lot rate' : 'Base rate'}
                            </p>
                            {p.unit === 'KG' && stock >= 100 && (
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                = ₹{(avgCost * 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}/Quintal
                              </p>
                            )}
                          </td>

                          {/* Total Stock Asset Value */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-400">
                              ₹{valuation.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                              Asset Valuation
                            </p>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <Link href={`/portal/purchases?product=${productId}`} title="Log New Purchase (Restock)">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 px-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/60 rounded-lg cursor-pointer"
                                >
                                  + Buy
                                </Button>
                              </Link>

                              <Link href={`/portal/sales?product=${productId}&create=true`} title="Sell Commodity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  disabled={stock <= 0}
                                  className="h-8 px-2 text-xs font-bold text-blue-700 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/60 rounded-lg cursor-pointer disabled:opacity-30"
                                >
                                  Sell
                                </Button>
                              </Link>

                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => toggleExpand(productId)}
                                className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                                title={isExpanded ? 'Collapse Batches' : 'Expand Batches'}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded FIFO Batch Breakdown Ledger */}
                        {isExpanded && (
                          <tr className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
                            <td colSpan={6} className="p-4 sm:p-5">
                              <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-2xs">
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
                                  <div className="flex items-center gap-2">
                                    <History className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                                      Active Batches & Inward Allocation (FIFO Order)
                                    </h4>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-slate-400 mr-1">
                                      {activeBatches.length} Active {activeBatches.length === 1 ? 'Lot' : 'Lots'}
                                    </span>
                                    {activeBatches.length >= 2 && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openCombineModal(p)}
                                        className="h-7 px-2.5 text-[11px] font-extrabold border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer"
                                        title="Permanently combine 2 or more lots into a consolidated batch with weighted average valuation"
                                      >
                                        <Layers className="h-3 w-3" />
                                        🔗 Combine Batches
                                      </Button>
                                    )}
                                    {stock > 0 && (
                                      <Link href={`/portal/sales?product=${productId}&batch=FIFO&create=true`} title="Sell oldest stock first via Auto FIFO">
                                        <Button
                                          size="sm"
                                          className="h-7 px-2.5 text-[11px] font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer"
                                        >
                                          ⚡ Sell via FIFO (Old Stock)
                                        </Button>
                                      </Link>
                                    )}
                                  </div>
                                </div>

                                {activeBatches.length > 0 ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {activeBatches.map((batch, idx) => {
                                      const bQty = Number(batch.quantity || 0);
                                      const bPrice = Number(batch.purchasePrice || p.baseCostPrice || 0);
                                      const bVal = bQty * bPrice;
                                      const isOldest = idx === 0;
                                      const batchSecondary = formatStockSecondaryUnits(bQty, p.unit);
                                      const sharePct = stock > 0 ? Math.round((bQty / stock) * 100) : 0;

                                      return (
                                        <div
                                          key={batch.id || batch._id || idx}
                                          className={cn(
                                            "p-3.5 rounded-xl border transition-all relative overflow-hidden",
                                            isOldest
                                              ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 shadow-xs"
                                              : "bg-slate-50/50 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
                                          )}
                                        >
                                          <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                              <div className="flex items-center gap-1.5">
                                                <span className="font-mono font-black text-xs text-slate-900 dark:text-slate-100">
                                                  {batch.batchNumber || `BCH-${1000 + (idx + 1)}`}
                                                </span>
                                                {isOldest && (
                                                  <span className="bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-300 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                    FIFO (Oldest)
                                                  </span>
                                                )}
                                              </div>
                                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                                                Inward: {batch.createdAt ? new Date(batch.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Stock Batch'}
                                              </p>
                                            </div>

                                            <div className="text-right">
                                              <span className="text-xs font-black text-slate-900 dark:text-slate-100 font-mono">
                                                {bQty.toLocaleString()} {p.unit}
                                              </span>
                                              {batchSecondary && (
                                                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                                  {batchSecondary}
                                                </p>
                                              )}
                                            </div>
                                          </div>

                                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                                            <div>
                                              <span className="text-[10px] text-slate-400 uppercase font-bold">Cost Rate: </span>
                                              <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">
                                                ₹{bPrice}/{p.unit}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <div className="text-right">
                                                <span className="text-[10px] text-slate-400 uppercase font-bold">Value: </span>
                                                <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                                                  ₹{bVal.toLocaleString('en-IN')}
                                                </span>
                                              </div>
                                              {bQty > 0 && (
                                                <Link
                                                  href={`/portal/sales?product=${productId}&batch=${batch.id || batch._id}&create=true`}
                                                  title={`Sell directly from lot ${batch.batchNumber || `BCH-${1000 + (idx + 1)}`}`}
                                                >
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-6 px-2 text-[10px] font-extrabold text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/70 hover:bg-blue-100 rounded-md flex items-center gap-0.5 cursor-pointer shadow-2xs"
                                                  >
                                                    Sell Lot
                                                    <ArrowRight className="h-2.5 w-2.5" />
                                                  </Button>
                                                </Link>
                                              )}
                                            </div>
                                          </div>

                                          {/* Mini progress bar of batch share */}
                                          <div className="w-full bg-slate-200/70 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                                            <div
                                              className={cn("h-full rounded-full", isOldest ? "bg-emerald-500" : "bg-blue-500")}
                                              style={{ width: `${Math.min(100, Math.max(5, sharePct))}%` }}
                                            />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="py-6 text-center text-slate-400 text-xs font-medium">
                                    No discrete batches logged. Total inventory valued at base cost price.
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <Boxes className="h-7 w-7" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                              No inventory matching criteria
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Try clearing filters or search terms
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setStatusFilter('ALL'); setSearch(''); }}
                            className="rounded-xl text-xs font-bold mt-2"
                          >
                            Reset Filter
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-900/40">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:block">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl px-4 h-9 font-bold bg-white dark:bg-slate-950"
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl px-4 h-9 font-bold border-slate-900 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Combine Batches Radix Dialog Modal */}
      <Dialog.Root open={!!combineModalProduct} onOpenChange={(open) => !open && setCombineModalProduct(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] sm:w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-slate-950 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            {/* Dialog Header */}
            <div className="sticky top-0 z-20 shrink-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex justify-between items-center rounded-t-2xl shadow-xs relative">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 sm:p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <Dialog.Title className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    Combine Inventory Batches
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                      Stock Merge
                    </span>
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                    Commodity: <strong className="text-slate-800 dark:text-slate-200">{combineModalProduct?.name}</strong> • Available Stock: {Number(combineModalProduct?.currentStock || 0).toLocaleString()} {combineModalProduct?.unit}
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

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* Context Explainer */}
              <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-2.5 text-xs text-indigo-950 dark:text-indigo-200">
                <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">
                    How Batch Combination Works:
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Select 2 or more lots and specify how much quantity to merge from each. The system will create a new consolidated batch with the mathematically exact <strong>weighted average purchase cost</strong>:
                    <span className="font-mono ml-1 text-indigo-700 dark:text-indigo-300 font-bold bg-white/70 dark:bg-slate-900/70 px-1 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                      Weighted Cost = Total Valuation ÷ Total Combined Quantity
                    </span>
                  </p>
                </div>
              </div>

              {/* Batches Table */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
                <div className="bg-slate-50 dark:bg-slate-900/80 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Active Lots to Merge</span>
                  <div className="flex gap-2 text-[11px] font-medium">
                    <button
                      type="button"
                      onClick={() => {
                        const all = {};
                        (combineModalProduct?.batches || []).forEach(b => {
                          all[b.id || b._id] = Number(b.quantity || 0);
                        });
                        setCombineBatchQtys(all);
                      }}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-bold"
                    >
                      Select All Max
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setCombineBatchQtys({})}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[280px] overflow-y-auto">
                  {(combineModalProduct?.batches || [])
                    .filter(b => Number(b.quantity || 0) > 0)
                    .map((b, idx) => {
                      const bId = b.id || b._id;
                      const avail = Number(b.quantity || 0);
                      const cost = Number(b.purchasePrice ?? combineModalProduct?.baseCostPrice ?? 0);
                      const currentQty = combineBatchQtys[bId] ?? '';
                      const numQty = parseFloat(currentQty) || 0;
                      const isSelected = numQty > 0;
                      const isOverLimit = numQty > avail;
                      const subtotalVal = numQty * cost;

                      return (
                        <div
                          key={bId}
                          className={cn(
                            "p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors",
                            isSelected ? "bg-indigo-50/30 dark:bg-indigo-950/15" : "bg-white dark:bg-slate-950",
                            isOverLimit && "bg-rose-50/50 dark:bg-rose-950/20"
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                {b.batchNumber || `BCH-${1000 + (idx + 1)}`}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">
                                Avail: <strong className="text-slate-800 dark:text-slate-200">{avail} {combineModalProduct?.unit}</strong>
                              </span>
                              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                                @ ₹{cost}/{combineModalProduct?.unit}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                              <span>Inward: {b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Inventory Lot'}</span>
                              {isSelected && !isOverLimit && (
                                <span className="text-indigo-600 dark:text-indigo-400 font-semibold font-mono">
                                  Contrib: ₹{subtotalVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              )}
                              {isOverLimit && (
                                <span className="text-rose-600 font-bold">
                                  Exceeds lot limit ({avail} {combineModalProduct?.unit})
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
                                  setCombineBatchQtys(prev => ({ ...prev, [bId]: val }));
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
                                {combineModalProduct?.unit}
                              </span>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setCombineBatchQtys(prev => ({ ...prev, [bId]: String(avail) }))}
                              className="h-9 px-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg cursor-pointer"
                              title="Merge entire lot stock"
                            >
                              Max
                            </Button>
                            {isSelected && (
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => setCombineBatchQtys(prev => ({ ...prev, [bId]: '' }))}
                                className="h-9 w-8 p-0 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                                title="Clear quantity"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Live Result Calculation Summary */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/30 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-100 dark:border-indigo-900/50">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 uppercase tracking-wider">
                    <Calculator className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    Consolidation Live Preview
                  </span>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {combineStats.count} {combineStats.count === 1 ? 'Lot' : 'Lots'} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Combined Total Qty</div>
                    <div className="text-base font-black text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                      {combineStats.totalQty.toLocaleString()} {combineModalProduct?.unit}
                    </div>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Merged Value</div>
                    <div className="text-base font-black text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                      ₹{combineStats.totalVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="bg-indigo-600 text-white p-3 rounded-lg shadow-xs">
                    <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">Weighted Avg Cost Rate</div>
                    <div className="text-lg font-black font-mono mt-0.5 flex items-baseline gap-1">
                      ₹{combineStats.avgCost.toFixed(2)}
                      <span className="text-xs font-normal text-indigo-200">/{combineModalProduct?.unit}</span>
                    </div>
                  </div>
                </div>

                {combineStats.count >= 2 && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-white/60 dark:bg-slate-900/60 p-2 rounded border border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
                    <span>Weighted Avg Formula:</span>
                    <span className="font-bold text-indigo-700 dark:text-indigo-300">
                      ₹{combineStats.totalVal.toFixed(2)} ÷ {combineStats.totalQty} {combineModalProduct?.unit} = ₹{combineStats.avgCost.toFixed(2)}/{combineModalProduct?.unit}
                    </span>
                  </div>
                )}
              </div>

              {/* Custom Merged Batch ID Input */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>New Consolidated Batch ID / Number (Optional)</span>
                  <span className="text-[10px] text-slate-400 lowercase font-normal">will auto-generate if empty</span>
                </label>
                <Input
                  value={customMergedBatchNumber}
                  onChange={(e) => setCustomMergedBatchNumber(e.target.value)}
                  placeholder="e.g. BCH-COMBINED-01"
                  className="font-mono text-xs rounded-xl h-10 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60"
                />
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="sticky bottom-0 z-20 shrink-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 sm:px-6 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCombineModalProduct(null)}
                disabled={isSubmittingCombine}
                className="rounded-xl px-4 text-xs font-bold cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleCombineSubmit}
                disabled={isSubmittingCombine || combineStats.count < 2 || combineStats.totalQty <= 0 || combineStats.hasExceeded}
                className="rounded-xl px-5 text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmittingCombine ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Combining Batches...
                  </>
                ) : (
                  <>
                    <Layers className="h-4 w-4" />
                    Confirm & Combine {combineStats.count > 0 ? `${combineStats.count} Batches` : ''} {combineStats.avgCost > 0 ? `(Avg: ₹${combineStats.avgCost.toFixed(2)}/${combineModalProduct?.unit})` : ''}
                  </>
                )}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
