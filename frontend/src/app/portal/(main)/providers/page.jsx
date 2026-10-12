'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Search, Eye, Filter, Users, Phone, MapPin, Truck, X, Building2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { ConfirmModal } from '@/components/portal/ConfirmModal';
import { PageHeader } from '@/components/portal/PageHeader';

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProviders = () => {
    setLoading(true);
    api
      .get(`/api/user/providers?page=${pagination.page}&search=${search}`)
      .then((res) => {
        setProviders(res.data.providers || []);
        setPagination(res.data.pagination || { page: 1, pages: 1 });
      })
      .catch(() => toast.error('Failed to load providers'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProviders();
  }, [pagination.page, search]);

  const handleOpen = (provider = null) => {
    setEditing(provider);
    setForm(
      provider
        ? { name: provider.name, phone: provider.phone || '', address: provider.address || '' }
        : { name: '', phone: '', address: '' }
    );
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/api/user/providers/${editing.id}`, form);
        toast.success('Provider updated');
      } else {
        await api.post(`/api/user/providers`, form);
        toast.success('Provider added');
      }
      setOpen(false);
      fetchProviders();
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
      await api.delete(`/api/user/providers/${deleteId}`);
      toast.success('Deleted');
      setDeleteId(null);
      fetchProviders();
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setSubmitting(false);
    }
  };

  const handleView = async (provider) => {
    setViewing(provider);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/api/user/providers/${provider.id}`);
      setViewData(res.data);
    } catch (err) {
      toast.error('Failed to load details');
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Provider?"
        description="Are you sure you want to delete this provider? All associated purchase records will also be affected."
        isLoading={submitting}
      />
      {/* Header Section */}
      <PageHeader 
        title="Provider Registry"
        description="Manage all providers and agricultural suppliers"
        icon={Truck}
        actionButton={
          <Button
            onClick={() => handleOpen()}
            className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 rounded-xl h-11 px-5 font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Register New Provider
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Suppliers</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{providers.length}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Registered providers</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
              <Truck className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone Verified</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {providers.filter(p => p.phone).length}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Active contact numbers</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <Phone className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Locations</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                {providers.filter(p => p.address).length}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Physical addresses logged</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 shrink-0">
              <MapPin className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Providers Table Card */}
      <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Supplier Directory</CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Total {providers.length} registered suppliers
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <Input
                placeholder="Search suppliers by name or phone..."
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
                    <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Provider Information</th>
                    <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Contact Details</th>
                    <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Location / Address</th>
                    <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] w-48">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {providers.map((f) => (
                    <tr key={f.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900/50">
                            {f.name[0]?.toUpperCase()}
                          </div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 text-base">{f.name}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                          <Phone className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                          {f.phone || '—'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <MapPin className="h-3 w-3 text-slate-400 dark:text-slate-500 shrink-0" />
                          <span className="truncate max-w-[200px]">{f.address || '—'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleView(f)}
                            className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-105 bg-white dark:bg-slate-900"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpen(f)}
                            className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-700 hover:text-amber-600 dark:hover:text-amber-400 transition-all hover:scale-105 bg-white dark:bg-slate-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setDeleteId(f.id)}
                            className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-all hover:scale-105 bg-white dark:bg-slate-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {providers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                            <Truck className="h-8 w-8 text-slate-500 dark:text-slate-300" />
                          </div>
                          <p className="text-slate-400 font-medium">No providers found in registry</p>
                          <Button onClick={() => handleOpen()} variant="outline" className="rounded-xl mt-2">
                            Register your first provider
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

      {/* View Details Dialog */}
      <Dialog.Root open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] sm:w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-slate-950 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            {/* Header */}
            <div className="sticky top-0 z-20 shrink-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex justify-between items-center rounded-t-2xl shadow-xs relative">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <Dialog.Title className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Provider: {viewing?.name}
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                    Complete procurement history and supplier contact record
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

            <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
              {loadingDetails ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                </div>
              ) : viewData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 mt-0.5">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <Label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">Phone Number</Label>
                        <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{viewData.phone || '—'}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 mt-0.5">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <Label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">Registered Address</Label>
                        <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{viewData.address || '—'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>Purchase History</span>
                      <span className="text-[11px] text-slate-400 font-semibold">{viewData.purchases?.length || 0} Orders</span>
                    </h3>
                    {viewData.purchases?.length > 0 ? (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[550px] text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                              <tr>
                                <th className="p-3 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="p-3 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Items</th>
                                <th className="p-3 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unit Price</th>
                                <th className="p-3 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                              {viewData.purchases.map(purchase => (
                                <tr key={purchase.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                                  <td className="p-3 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                                    {new Date(purchase.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </td>
                                  <td className="p-3">
                                    {purchase.items.map(item => (
                                      <div key={item.id} className="text-slate-900 dark:text-slate-100 font-bold">
                                        {item.product.name} <span className="text-slate-400 dark:text-slate-500 font-medium text-[11px]">x {item.quantity} {item.product.unit}</span>
                                      </div>
                                    ))}
                                  </td>
                                  <td className="p-3 text-right">
                                    {purchase.items.map(item => (
                                      <div key={item.id} className="text-slate-700 dark:text-slate-300 font-semibold">
                                        ₹{item.unitPrice.toLocaleString('en-IN')} <span className="text-slate-400 text-[10px]">/{item.product.unit}</span>
                                      </div>
                                    ))}
                                  </td>
                                  <td className="p-3 text-right font-black text-slate-900 dark:text-slate-100">
                                    ₹{purchase.totalAmount.toLocaleString('en-IN')}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs italic">
                        No purchase records registered for this provider yet.
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex justify-end shrink-0">
              <Button
                variant="outline"
                onClick={() => setViewing(null)}
                className="rounded-xl px-6 h-11 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Close Profile
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Add/Edit Dialog */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] sm:w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-slate-950 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            {/* Modal Header */}
            <div className="sticky top-0 z-20 shrink-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex justify-between items-center rounded-t-2xl shadow-xs relative">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <Dialog.Title className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {editing ? 'Update Provider' : 'Register Provider'}
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                    {editing ? 'Modify supplier contact information and registry record' : 'Register a new farmer or agricultural goods supplier in directory'}
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
                  Full Name / Entity Name <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    autoFocus
                    className="rounded-xl h-11 sm:h-12 pl-10 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:text-slate-100 font-medium text-sm transition-all"
                    placeholder="e.g. Kisan Agro Farms, Rajesh Patel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Phone / Mobile
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className="rounded-xl h-11 sm:h-12 pl-10 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:text-slate-100 font-medium text-sm transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Location / Address
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={form.address}
                      onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                      className="rounded-xl h-11 sm:h-12 pl-10 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:text-slate-100 font-medium text-sm transition-all"
                      placeholder="Village, Mandi, State"
                    />
                  </div>
                </div>
              </div>

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
                  {submitting ? 'Saving…' : (editing ? 'Update Provider' : 'Save Provider')}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
