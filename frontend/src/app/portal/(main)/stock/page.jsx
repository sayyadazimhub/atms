'use client';

import { useEffect, useState, Fragment } from 'react';
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
  ArrowRight,
  XCircle,
  ChevronDown,
  ChevronUp,
  History,
  Boxes
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/portal/PageHeader';
import { formatStockSecondaryUnits } from '@/lib/units';
import Link from 'next/link';

export default function StockMonitorPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState(new Set());

  const toggleExpand = (productId) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const fetchProducts = () => {
    setLoading(true);
    api
      .get(`/api/user/products?page=${pagination.page}&search=${search}&limit=50`)
      .then((res) => {
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      })
      .catch(() => toast.error('Failed to load inventory'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, search]);

  // Derived stats
  const lowStockCount = products.filter(p => p.currentStock <= 10).length;
  const totalStockUnits = products.reduce((acc, p) => acc + (p.currentStock || 0), 0);

  const filteredProducts = filterLowStock
    ? products.filter(p => p.currentStock <= 10)
    : products;

  const getStatusBadge = (stock) => {
    if (stock <= 0) return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-950/30 px-3 py-1 text-[10px] font-black text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 uppercase tracking-widest">
        <XCircle className="h-3 w-3" /> DEPLETED
      </span>
    );
    if (stock <= 10) return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 px-3 py-1 text-[10px] font-black text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 uppercase tracking-widest">
        <AlertTriangle className="h-3 w-3" /> CRITICAL
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 text-[10px] font-black text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 uppercase tracking-widest">
        <CheckCircle2 className="h-3 w-3" /> STABLE
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header Section */}
      <PageHeader 
        title="Inventory Monitor"
        description="Real-time stock tracking and inventory management"
        icon={Boxes}
        actionButton={
          <Link href="/portal/products">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 rounded-xl h-11 px-5 font-bold shadow-sm transition-all flex items-center gap-2">
              <Package className="h-4 w-4" />
              Manage Products
            </Button>
          </Link>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total SKUs</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{products.length}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Catalog items</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
              <Boxes className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Low Stock Alerts</p>
              <p className={cn("text-2xl sm:text-3xl font-black", lowStockCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
                {lowStockCount}
              </p>
              <p className={cn("text-xs font-medium", lowStockCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
                {lowStockCount > 0 ? "Action required" : "All levels optimal"}
              </p>
            </div>
            <div className={cn("p-3.5 rounded-2xl border shrink-0", lowStockCount > 0 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20")}>
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Units</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{totalStockUnits.toLocaleString()}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Physical inventory</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <Package className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Inventory Table Card */}
      <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Stock Inventory</CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time availability and stock levels across catalog
              </CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Button
                variant={filterLowStock ? "destructive" : "outline"}
                onClick={() => setFilterLowStock(!filterLowStock)}
                className="h-10 rounded-xl px-4 w-full sm:w-auto text-xs font-bold transition-all border-slate-200 dark:border-slate-700"
              >
                <AlertTriangle className="mr-2 h-3.5 w-3.5" />
                {filterLowStock ? "All Stock" : "Low Stock Only"}
              </Button>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Search inventory..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-100 dark:text-slate-100 text-sm"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm text-slate-600 dark:text-slate-400">
                <thead>
                  <tr className="border-b dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50">
                    <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Product Information</th>
                    <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Availability Status</th>
                    <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Total Inventory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredProducts.map((p) => (
                    <Fragment key={p.id || p._id}>
                      <tr key={`row-${p.id || p._id}`} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group cursor-pointer" onClick={() => toggleExpand(p.id)}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900/50">
                              {p.name[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-900 dark:text-slate-100 text-base">{p.name}</p>
                                {p.batches?.length > 1 && (
                                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-tight">
                                    {p.batches.length} BATCHES
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Unit: {p.unit}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                            {getStatusBadge(p.currentStock)}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-4">
                            <div className="flex flex-col items-end">
                              <span className={cn(
                                "font-mono font-black text-lg",
                                p.currentStock <= 10 ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-slate-100"
                              )}>
                                {p.currentStock.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">{p.unit} total</span>
                              {formatStockSecondaryUnits(p.currentStock, p.unit) && (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold tracking-tight mt-0.5">
                                  {formatStockSecondaryUnits(p.currentStock, p.unit)}
                                </span>
                              )}
                            </div>
                            {expandedProducts.has(p.id) ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                          </div>
                        </td>
                      </tr>
                      {expandedProducts.has(p.id) && (
                        <tr className="bg-slate-50/50 dark:bg-slate-900/20 animate-in slide-in-from-top-1 duration-200">
                          <td colSpan={3} className="p-0 border-b dark:border-slate-800">
                            <div className="p-4 pl-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {p.batches && p.batches.length > 0 ? p.batches.map((batch, idx) => (
                                <div key={batch.id || batch._id || idx} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                                      <History className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {batch.batchNumber || `BCH-${1000 + (idx + 1)}`}
                                      </p>
                                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                                        Rate: ₹{batch.purchasePrice} / {p.unit}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</p>
                                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{batch.quantity} {p.unit}</p>
                                  </div>
                                </div>
                              )) : (
                                <p className="text-xs text-slate-400 py-2">No active batches for this product</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                            <Boxes className="h-8 w-8 text-slate-500 dark:text-slate-300" />
                          </div>
                          <p className="text-slate-400 font-medium">No inventory data matches your criteria</p>
                          <Link href="/portal/products">
                            <Button variant="outline" className="rounded-xl mt-2">
                              Manage product catalog
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {pagination.pages > 1 && (
            <div className="p-6 border-t dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/10 dark:bg-slate-900/50">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:block">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl px-4 h-9 font-bold bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
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
    </div>
  );
}
