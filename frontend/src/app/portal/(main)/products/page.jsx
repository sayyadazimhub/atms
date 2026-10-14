'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Search, Package, X, IndianRupee, ChevronDown, Check } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { ConfirmModal } from '@/components/portal/ConfirmModal';
import { PageHeader } from '@/components/portal/PageHeader';
import { CustomSelect } from '@/components/ui/custom-select';

const UNITS = [
  { value: 'KG', label: 'KG (Kilogram)', sublabel: 'Standard Weight' },
  { value: 'Quintal', label: 'Quintal (100 KG)', sublabel: 'Bulk Grain / Produce' },
  { value: 'Ton', label: 'Ton (1,000 KG)', sublabel: 'Freight / Bulk Lot' },
  { value: 'Bag', label: 'Bag / Bori (Bori)', sublabel: 'Standard Package' },
  { value: 'Crate', label: 'Crate / Box', sublabel: 'Produce / Fruits' },
  { value: 'Box', label: 'Box / Carton', sublabel: 'Packaged Goods' },
  { value: 'Litre', label: 'Litre (Ltr)', sublabel: 'Liquid / Oils' },
  { value: 'Piece', label: 'Piece (Nos / Kattas)', sublabel: 'Count Item' },
  { value: 'Gram', label: 'Gram (gm)', sublabel: 'Fine Weight / Spices' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', unit: 'KG', baseCostPrice: 0, baseSalePrice: 0, openingStock: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    api
      .get(`/api/user/products?page=${pagination?.page || 1}&search=${search}`)
      .then((res) => {
        setProducts(res.data?.products || []);
        setPagination(res.data?.pagination || { page: 1, pages: 1 });
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [pagination?.page, search]);

  const handleOpen = (product = null) => {
    setEditing(product);
    setForm(product ? {
      name: product.name,
      unit: product.unit,
      baseCostPrice: product.baseCostPrice || 0,
      baseSalePrice: product.baseSalePrice || 0,
      openingStock: 0
    } : { name: '', unit: 'KG', baseCostPrice: 0, baseSalePrice: 0, openingStock: 0 });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/api/user/products/${editing.id}`, form);
        toast.success('Product updated');
      } else {
        await api.post(`/api/user/products`, form);
        toast.success('Product added');
      }
      setOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await api.delete(`/api/user/products/${deleteId}`);
      toast.success('Deleted');
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product?"
        description="Are you sure you want to delete this product? This will remove it from the registry permanently."
        isLoading={submitting}
      />
      {/* Header Section */}
      <PageHeader 
        title="Product Management"
        description="Manage all tradeable items and pricing"
        icon={Package}
        actionButton={
          <Button
            onClick={() => handleOpen()}
            className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 rounded-xl h-11 px-5 font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Products</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{products.length}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Catalog items</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
              <Package className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Low Stock</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                {products.filter(p => (p.currentStock || 0) <= 10).length}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Items under 10 units</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
              <Package className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Inventory On Hand</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                {products.reduce((acc, p) => acc + (p.currentStock || 0), 0).toLocaleString()}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Available volume</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <Package className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Products Table Card */}
      <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Product Catalog</CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Total {products.length} registered products
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-100 dark:text-slate-100 text-sm"
              />
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
                    <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Measurement Unit</th>
                    <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Base Cost (₹/Unit)</th>
                    <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Base Sale (₹/Unit)</th>
                    <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Current Inventory</th>
                    <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900/50">
                            {p.name[0]?.toUpperCase()}
                          </div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 text-base">{p.name}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase">
                          {p.unit}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            ₹{Number(p.baseCostPrice || 0).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">/ {p.unit}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            ₹{Number(p.baseSalePrice || 0).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">/ {p.unit}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className={cn(
                            "font-mono font-black text-base",
                            p.currentStock <= 10 ? "text-amber-600 dark:text-amber-500" : "text-slate-900 dark:text-slate-100"
                          )}>
                            {p.currentStock.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">{p.unit} in-hand</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpen(p)}
                            className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-105 bg-white dark:bg-slate-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setDeleteId(p.id)}
                            className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-all hover:scale-105 bg-white dark:bg-slate-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                            <Package className="h-8 w-8 text-slate-500 dark:text-slate-300" />
                          </div>
                          <p className="text-slate-400 font-medium">Your product catalog is empty</p>
                          <Button onClick={() => handleOpen()} variant="outline" className="rounded-xl mt-2">
                            Add your first product
                          </Button>
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

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] sm:w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-slate-950 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            {/* Modal Header */}
            <div className="sticky top-0 z-20 shrink-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex justify-between items-center rounded-t-2xl shadow-xs relative">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <Dialog.Title className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {editing ? 'Edit Product' : 'Register Product'}
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                    {editing ? 'Update commodity specifications & price limits' : 'Register a new crop or agricultural commodity in inventory'}
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

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Product / Commodity Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  autoFocus
                  className="rounded-xl h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:text-slate-100 font-medium text-sm transition-all"
                  placeholder="e.g. Basmati Rice, Wheat (Grade A)"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Standard Measurement Unit <span className="text-rose-500">*</span>
                </Label>
                <CustomSelect
                  value={form.unit}
                  onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                  placeholder="Select Unit"
                  options={UNITS}
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Standardized unit for all inventory batches, purchase orders, and sales vouchers.
                </p>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Base Cost Price (₹ / {form.unit || 'unit'}) <span className="text-rose-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.baseCostPrice}
                      onChange={(e) => setForm((f) => ({ ...f, baseCostPrice: e.target.value }))}
                      required
                      className="rounded-xl h-11 sm:h-12 pl-8 pr-16 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:text-slate-100 font-semibold text-sm transition-all"
                      placeholder="0.00"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase pointer-events-none">
                      / {form.unit}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Base Sale Price (₹ / {form.unit || 'unit'})
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.baseSalePrice}
                      onChange={(e) => setForm((f) => ({ ...f, baseSalePrice: e.target.value }))}
                      className="rounded-xl h-11 sm:h-12 pl-8 pr-16 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:text-slate-100 font-semibold text-sm transition-all"
                      placeholder="0.00"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase pointer-events-none">
                      / {form.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Opening Stock (Only when creating a new product) */}
              {!editing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Opening Stock ({form.unit || 'unit'})
                    </Label>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                      Auto-generates Batch (BCH-XXXX)
                    </span>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.openingStock}
                    onChange={(e) => setForm((f) => ({ ...f, openingStock: e.target.value }))}
                    className="rounded-xl h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:text-slate-100 font-semibold text-sm transition-all"
                    placeholder="0.00"
                  />
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    Optional opening inventory. Will automatically register as your first batch lot.
                  </p>
                </div>
              )}

              {/* Profit Margin Preview Helper */}
              {Number(form.baseCostPrice) > 0 && Number(form.baseSalePrice) > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-500 dark:text-slate-400">Projected Margin:</span>
                  <span className={cn(
                    "font-bold",
                    (Number(form.baseSalePrice) - Number(form.baseCostPrice)) >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  )}>
                    {(Number(form.baseSalePrice) - Number(form.baseCostPrice)) >= 0 ? '+' : ''}
                    ₹{(Number(form.baseSalePrice) - Number(form.baseCostPrice)).toFixed(2)} / {form.unit}
                    {' '}({(((Number(form.baseSalePrice) - Number(form.baseCostPrice)) / Number(form.baseCostPrice)) * 100).toFixed(1)}%)
                  </span>
                </div>
              )}

              {/* Responsive Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="w-full sm:w-auto rounded-xl h-11 px-5 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 font-semibold text-xs transition-all"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto rounded-xl h-11 px-6 font-bold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-500/20 text-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving…' : (editing ? 'Update Product' : 'Save Product')}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div >
  );
}
