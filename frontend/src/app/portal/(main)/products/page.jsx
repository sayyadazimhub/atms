'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { ConfirmModal } from '@/components/portal/ConfirmModal';
import { PageHeader } from '@/components/portal/PageHeader';

const UNITS = ['KG', 'Quintal', 'Ton'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', unit: 'KG', baseCostPrice: 0, baseSalePrice: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    api
      .get(`/api/user/products?page=${pagination.page}&search=${search}`)
      .then((res) => {
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, search]);

  const handleOpen = (product = null) => {
    setEditing(product);
    setForm(product ? {
      name: product.name,
      unit: product.unit,
      baseCostPrice: product.baseCostPrice || 0,
      baseSalePrice: product.baseSalePrice || 0
    } : { name: '', unit: 'KG', baseCostPrice: 0, baseSalePrice: 0 });
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
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border-none bg-white dark:bg-slate-950 p-8 shadow-2xl dark:border dark:border-slate-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:max-w-md">
            <div className="flex flex-col gap-1 mb-6">
              <Dialog.Title className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {editing ? 'Edit Product' : 'Register Product'}
              </Dialog.Title>
              <Dialog.Description className="text-slate-500 dark:text-slate-400">
                Enter details to track this crop in your inventory
              </Dialog.Description>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Product Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  autoFocus
                  className="rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-blue-600 focus-visible:border-blue-600 dark:text-slate-100"
                  placeholder="e.g. Basmati Rice, Wheat (Grade A)"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Measurement Unit</Label>
                <select
                  className={cn(
                    'flex h-12 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus:ring-2 focus:ring-blue-600 appearance-none dark:text-slate-100'
                  )}
                  value={form.unit}
                  onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u} className="dark:bg-slate-900">{u}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium italic uppercase tracking-widest underline decoration-blue-500/30">This unit will be fixed for all transactions</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Base Cost (₹)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.baseCostPrice}
                  onChange={(e) => setForm((f) => ({ ...f, baseCostPrice: e.target.value }))}
                  required
                  className="rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-blue-600 focus-visible:border-blue-600 dark:text-slate-100"
                  placeholder="e.g. 30"
                />
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-2xl h-12 font-bold bg-slate-900 dark:bg-slate-100 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-xl transition-all"
                >
                  {submitting ? 'Saving…' : (editing ? 'Update Registry' : 'Save Product')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl h-12 px-6 border-slate-200 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div >
  );
}
