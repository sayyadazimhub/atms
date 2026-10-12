'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Eye,
  X,
  Plus,
  Trash2,
  Pencil,
  Printer,
  ShoppingCart,
  IndianRupee,
  Clock,
  AlertCircle,
  TrendingUp,
  Filter,
  CheckCircle2,
  Wallet,
  Truck,
  ChevronDown
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { ConfirmModal } from '@/components/portal/ConfirmModal';
import { PageHeader } from '@/components/portal/PageHeader';
import { CustomSelect } from '@/components/ui/custom-select';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form state
  const [providers, setProviders] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    providerId: '',
    paidAmount: '',
    items: [{ productId: '', quantity: '', unitPrice: '' }],
  });
  const [editFormData, setEditFormData] = useState({
    id: '',
    paidAmount: 0,
    totalAmount: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, [pagination.page]);

  useEffect(() => {
    if (showCreateModal) {
      fetchProvidersAndProducts();
    }
  }, [showCreateModal]);

  const fetchPurchases = () => {
    setLoading(true);
    fetch(`/api/user/purchases?page=${pagination.page}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setPurchases(data.purchases || []);
        setPagination(data.pagination || { page: 1, pages: 1 });
      })
      .catch((err) => console.error('Failed to load purchases:', err))
      .finally(() => setLoading(false));
  };

  const fetchProvidersAndProducts = async () => {
    try {
      const [providersRes, productsRes] = await Promise.all([
        fetch(`/api/user/providers?limit=100`, { credentials: 'include' }),
        fetch(`/api/user/products?limit=100`, { credentials: 'include' }),
      ]);
      const providersData = await providersRes.json();
      const productsData = await productsRes.json();
      setProviders(providersData.providers || []);
      setProducts(productsData.products || []);
    } catch (err) {
      console.error('Failed to load providers/products:', err);
    }
  };

  const handleViewBill = async (purchaseId) => {
    try {
      const res = await fetch(`/api/user/purchases/${purchaseId}`, { credentials: 'include' });
      const data = await res.json();
      setSelectedPurchase(data);
      setShowViewModal(true);
    } catch (err) {
      console.error('Failed to load purchase details:', err);
      toast.error('Failed to load purchase details');
    }
  };

  const handleEditClick = (purchase) => {
    setEditFormData({
      id: purchase.id,
      paidAmount: purchase.paidAmount,
      totalAmount: purchase.totalAmount,
    });
    setShowEditModal(true);
  };

  const handleUpdatePurchase = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/user/purchases/${editFormData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paidAmount: parseFloat(editFormData.paidAmount),
        }),
      });

      if (res.ok) {
        toast.success('Purchase updated successfully');
        setShowEditModal(false);
        fetchPurchases();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update purchase');
      }
    } catch (err) {
      console.error('Failed to update purchase:', err);
      toast.error('Failed to update purchase');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePurchase = async () => {
    if (!deleteId) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/user/purchases/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        toast.success('Purchase deleted successfully');
        setDeleteId(null);
        fetchPurchases();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete purchase');
      }
    } catch (err) {
      console.error('Failed to delete purchase:', err);
      toast.error('Failed to delete purchase');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintBill = () => {
    if (!selectedPurchase) return;

    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Purchase Invoice - ${selectedPurchase.id.slice(-8).toUpperCase()}</title>
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
            <h1>Procurement Statement</h1>
            <p>Agriculture Trading Management System</p>
          </div>
          <div class="meta-info">
            <div class="meta-label">Filing ID</div>
            <div class="meta-value">#${selectedPurchase.id.slice(-8).toUpperCase()}</div>
            <div class="meta-label" style="margin-top: 8px;">Recording Date</div>
            <div class="meta-value">${new Date(selectedPurchase.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
        </div>

        <div class="grid">
          <div class="info-box">
            <div class="section-title">Provider Details</div>
            <p><strong>Provider:</strong> ${selectedPurchase.provider?.name || 'Unknown'}</p>
            ${selectedPurchase.provider?.phone ? `<p><strong>Phone:</strong> ${selectedPurchase.provider.phone}</p>` : ''}
            ${selectedPurchase.provider?.address ? `<p><strong>Address:</strong> ${selectedPurchase.provider.address}</p>` : ''}
          </div>
          <div class="info-box">
            <div class="section-title">Recipient Entity</div>
            <p><strong>Acquired By:</strong> Sayyad Traders</p>
            <p><strong>Accounting Status:</strong> ${selectedPurchase.dueAmount > 0 ? 'Payment Required' : 'Liability Settled'}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 45%">Inventory Item</th>
              <th style="width: 15%" class="text-right">Quantity</th>
              <th style="width: 20%" class="text-right">Acquisition Rate</th>
              <th style="width: 20%" class="text-right">Total Outlay</th>
            </tr>
          </thead>
          <tbody>
            ${selectedPurchase.items?.map(item => `
              <tr>
                <td>
                  <div class="font-bold text-slate-900">${item.product?.name || 'Unknown Item'}</div>
                  <div style="font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Unit: ${item.product?.unit || 'N/A'}</div>
                </td>
                <td class="text-right font-bold">${item.quantity}</td>
                <td class="text-right text-slate-500">₹${item.unitPrice.toLocaleString('en-IN')}</td>
                <td class="text-right font-bold text-slate-900">₹${item.totalPrice.toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals-container">
          <div class="totals-box">
            <div class="total-item">
              <span>Gross Outlay</span>
              <span style="color: white">₹${selectedPurchase.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div class="total-item">
              <span>Paid to Provider</span>
              <span style="color: #10b981">₹${selectedPurchase.paidAmount.toLocaleString('en-IN')}</span>
            </div>
            <div class="total-main">
              <span style="font-size: 12px; color: #94a3b8; display: flex; align-items: center;">BALANCE PAYABLE</span>
              <span>₹${selectedPurchase.dueAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>This is a computer-verified procurement record • Sayyad Traders • generated automatically</p>
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
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: '', unitPrice: '' }],
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      return sum + qty * price;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.providerId) {
      toast.error('Please select a provider');
      return;
    }

    const validItems = formData.items.filter(
      (item) => item.productId && item.quantity && item.unitPrice
    );

    if (validItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/user/purchases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: formData.providerId,
          paidAmount: parseFloat(formData.paidAmount) || 0,
          items: validItems,
        }),
      });

      if (res.ok) {
        toast.success('Purchase created successfully!');
        setShowCreateModal(false);
        setFormData({
          providerId: '',
          paidAmount: '',
          items: [{ productId: '', quantity: '', unitPrice: '' }],
        });
        fetchPurchases();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to create purchase');
      }
    } catch (err) {
      console.error('Failed to create purchase:', err);
      toast.error('Failed to create purchase');
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = calculateTotal();
  const paidAmount = parseFloat(formData.paidAmount) || 0;
  const dueAmount = totalAmount - paidAmount;

  const totalDue = purchases.reduce((sum, p) => sum + (p.dueAmount || 0), 0);
  const totalPurchasesToday = purchases
    .filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString())
    .length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeletePurchase}
        title="Delete Purchase?"
        description="Are you sure you want to delete this purchase? This will revert stock levels for all items in this purchase."
        isLoading={submitting}
      />
      {/* Header Section */}
      <PageHeader 
        title="Purchase Registry"
        description="Track inventory acquisitions and provider payments"
        icon={ShoppingCart}
        actionButton={
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 rounded-xl h-11 px-5 font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Log New Purchase
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Dues</p>
              <p className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">₹{totalDue.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Payable to suppliers</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today&apos;s Purchases</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">{totalPurchasesToday} Records</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Activity recorded today</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Latest Supplier</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 truncate">{purchases[0]?.provider?.name || '---'}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Last supplier billed</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <Truck className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Purchases Table Card */}
      <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Transaction History</CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Total {purchases.length} recorded procurement transactions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-sm text-slate-600 dark:text-slate-400">
                  <thead>
                    <tr className="border-b dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
                      <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Provider Information</th>
                      <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Total Amount</th>
                      <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Paid Amount</th>
                      <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Payment Status</th>
                      <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Entry Date</th>
                      <th className="p-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] w-48">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {purchases.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                              <ShoppingCart className="h-8 w-8 text-slate-500 dark:text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-medium">No purchase records found</p>
                            <Button onClick={() => setShowCreateModal(true)} variant="outline" className="rounded-xl mt-2">
                              Log your first purchase
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      purchases.map((p) => (
                        <tr key={p.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold border border-slate-100 dark:border-slate-800 uppercase">
                                {p.provider?.name[0] || '?'}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-slate-100 text-base">{p.provider?.name || 'Unknown'}</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">ID: {p.id.slice(-8).toUpperCase()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <p className="font-black text-slate-900 dark:text-slate-100">₹{Number(p.totalAmount).toLocaleString('en-IN')}</p>
                          </td>
                          <td className="p-4 text-right font-medium text-emerald-600 dark:text-emerald-400 font-black">
                            ₹{Number(p.paidAmount).toLocaleString('en-IN')}
                          </td>
                          <td className="p-4 text-right">
                            {p.dueAmount <= 0 ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                                <CheckCircle2 className="h-3 w-3" /> Fully Paid
                              </span>
                            ) : p.paidAmount > 0 ? (
                              <div className="flex flex-col items-end leading-none">
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 mb-1">
                                  <Clock className="h-3 w-3" /> Partial
                                </span>
                                <span className="text-[10px] text-rose-500 dark:text-rose-400 font-black tracking-tighter uppercase">Due: ₹{Number(p.dueAmount).toLocaleString('en-IN')}</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-end leading-none">
                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/20 px-2.5 py-1 text-xs font-bold text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 mb-1">
                                  <AlertCircle className="h-3 w-3" /> Unpaid
                                </span>
                                <span className="text-[10px] text-rose-500 dark:text-rose-400 font-black tracking-tighter uppercase">₹{Number(p.dueAmount).toLocaleString('en-IN')}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 font-medium text-slate-500">
                            {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleViewBill(p.id)}
                                className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-105"
                                title="View Bill"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleEditClick(p)}
                                className="h-9 w-9 rounded-xl border-slate-200 hover:border-amber-500 hover:text-amber-600 transition-all hover:scale-105"
                                title="Edit Payment"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setDeleteId(p.id)}
                                className="h-9 w-9 rounded-xl border-slate-200 hover:border-red-500 hover:text-red-600 transition-all hover:scale-105"
                                title="Delete Purchase"
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
                      className="rounded-xl px-4 h-9 font-bold bg-slate-900 text-white border-slate-900 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
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

      {/* Create Purchase Modal */}
      <Dialog.Root open={showCreateModal} onOpenChange={setShowCreateModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] sm:w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-slate-950 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">

            {/* Header */}
            <div className="sticky top-0 z-20 shrink-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex justify-between items-center rounded-t-2xl shadow-xs relative">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <div>
                  <Dialog.Title className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    New Purchase
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                    Record inventory acquisition and supplier bill
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
              {/* Provider Selection */}
              <div className="space-y-1.5">
                <Label htmlFor="provider" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Select Provider <span className="text-rose-500">*</span>
                </Label>
                <CustomSelect
                  id="provider"
                  value={formData.providerId}
                  onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
                  placeholder="Choose Provider"
                  options={providers.map((p) => ({ value: p.id, label: p.name }))}
                />
              </div>

              {/* Items Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Purchase Items <span className="text-rose-500">*</span>
                    </Label>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      {formData.items.length}
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={addItem}
                    className="h-8 sm:h-9 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs shadow-sm shadow-emerald-500/10 transition-all cursor-pointer"
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 p-3.5 sm:p-4 space-y-3 transition-colors hover:border-slate-300 dark:hover:border-slate-700"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Item #{index + 1}
                        </span>
                        {formData.items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-12">
                        {/* Product */}
                        <div className="sm:col-span-6 space-y-1">
                          <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Product</Label>
                          <CustomSelect
                            value={item.productId}
                            onChange={(e) => updateItem(index, 'productId', e.target.value)}
                            placeholder="Select Product"
                            options={products.map((p) => ({ value: p.id, label: `${p.name} (${p.unit})` }))}
                          />
                        </div>

                        {/* Quantity */}
                        <div className="sm:col-span-3 space-y-1">
                          <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Quantity</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            className="h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            value={item.quantity}
                            placeholder="0.00"
                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                            required
                          />
                        </div>

                        {/* Unit Price */}
                        <div className="sm:col-span-3 space-y-1">
                          <Label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Unit Cost (₹)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">₹</span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              className="h-11 pl-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                              value={item.unitPrice}
                              placeholder="0.00"
                              onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Subtotal row */}
                      {item.quantity && item.unitPrice && (
                        <div className="flex justify-end pt-1">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Item Subtotal:</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              ₹{(parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Bill Summary */}
              <div className="grid gap-4 sm:grid-cols-12 sm:items-stretch">
                {/* Initial Payment Input */}
                <div className="sm:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 sm:p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <Label htmlFor="paidAmount" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                      Initial Advance Paid (₹) <span className="text-rose-500">*</span>
                    </Label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Amount paid upfront to provider at purchase
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                    <Input
                      id="paidAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      className="h-11 sm:h-12 pl-8 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-base font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition-all"
                      placeholder="0.00"
                      value={formData.paidAmount}
                      onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Summary Card */}
                <div className="sm:col-span-7 rounded-2xl bg-slate-900 dark:bg-slate-950 p-5 text-white space-y-3 border border-slate-800 shadow-xl flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
                      <span className="uppercase tracking-wider text-[10px] font-bold">Gross Bill</span>
                      <span className="text-sm font-bold text-white">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400 text-xs font-medium pb-2.5 border-b border-slate-800">
                      <span className="uppercase tracking-wider text-[10px] font-bold">Advance Paid</span>
                      <span className="text-sm font-bold text-emerald-400">₹{paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Balance Payable</span>
                    <span className={cn(
                      "text-xl sm:text-2xl font-black",
                      dueAmount > 0 ? 'text-amber-400' : 'text-emerald-400'
                    )}>
                      ₹{dueAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
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
                  disabled={submitting}
                  className="w-full sm:w-auto rounded-xl h-11 px-6 sm:px-7 font-bold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-500/20 text-xs sm:text-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Recording Purchase...' : 'Confirm Purchase'}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Edit Purchase Modal */}
      <Dialog.Root open={showEditModal} onOpenChange={setShowEditModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] sm:w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-slate-950 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
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
                    Adjust procurement outlay & outstanding balance
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

            <form onSubmit={handleUpdatePurchase} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
              {/* Total Card */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Gross Purchase Bill
                </Label>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 text-center">
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                    Order Total
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
                  Paid Amount (₹) <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <Input
                    id="editPaidAmount"
                    type="number"
                    step="0.01"
                    min="0"
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
                  Balance Payable
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

              {/* Responsive Actions */}
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
      <Dialog.Root open={showViewModal && selectedPurchase} onOpenChange={setShowViewModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50 w-[95vw] sm:w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-slate-950 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            {selectedPurchase && (
              <>
                {/* Header */}
                <div className="sticky top-0 z-20 shrink-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex justify-between items-center rounded-t-2xl shadow-xs relative">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Purchase Invoice
                      </Dialog.Title>
                      <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                        Ref: {selectedPurchase.id.slice(-8).toUpperCase()}
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

                    {/* Provider */}
                    <div className="space-y-1">

                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Provider
                      </Label>

                      <div className="flex items-center gap-3">

                        <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900
              flex items-center justify-center font-semibold border dark:border-slate-800">

                          {selectedPurchase.provider?.name?.[0] || "?"}

                        </div>

                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {selectedPurchase.provider?.name}
                          </p>

                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {selectedPurchase.provider?.phone}
                          </p>
                        </div>

                      </div>

                    </div>

                    {/* Date */}
                    <div className="text-right space-y-1">

                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Date
                      </Label>

                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {new Date(
                          selectedPurchase.createdAt
                        ).toLocaleDateString()}
                      </p>

                      <span
                        className={cn(
                          "inline-block rounded-md px-2 py-1 text-xs font-medium",
                          selectedPurchase.dueAmount <= 0
                            ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                            : "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400"
                        )}
                      >
                        {selectedPurchase.dueAmount <= 0
                          ? "Settled"
                          : "Pending"}
                      </span>

                    </div>

                  </div>

                  {/* Items Table */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">

                    <table className="w-full text-sm">

                      <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800">

                        <tr>
                          <th className="p-3 text-left font-medium text-slate-600 dark:text-slate-400">
                            Product
                          </th>

                          <th className="p-3 text-right font-medium text-slate-600 dark:text-slate-400">
                            Qty
                          </th>

                          <th className="p-3 text-right font-medium text-slate-600 dark:text-slate-400">
                            Price
                          </th>

                          <th className="p-3 text-right font-medium text-slate-600 dark:text-slate-400">
                            Total
                          </th>
                        </tr>

                      </thead>

                      <tbody className="divide-y dark:divide-slate-800">

                        {selectedPurchase.items?.map((item) => (

                          <tr key={item.id}>

                            <td className="p-3">
                              <p className="font-medium text-slate-900 dark:text-slate-100">
                                {item.product?.name}
                              </p>

                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {item.product?.unit}
                              </p>
                            </td>

                            <td className="p-3 text-right text-slate-600 dark:text-slate-400">
                              {item.quantity}
                            </td>

                            <td className="p-3 text-right text-slate-600 dark:text-slate-400">
                              ₹{item.unitPrice.toLocaleString()}
                            </td>

                            <td className="p-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                              ₹{item.totalPrice.toLocaleString()}
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                  {/* Summary */}
                  <div className="space-y-2 text-sm">

                    <div className="flex justify-end gap-6 text-slate-600 dark:text-slate-400">
                      <span>Total</span>
                      <span className="font-semibold w-24 text-right dark:text-slate-100 italic">₹{selectedPurchase.totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-end gap-6 text-slate-600 dark:text-slate-400 border-b dark:border-slate-800 pb-2">
                      <span>Paid</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 w-24 text-right italic">₹{selectedPurchase.paidAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-end gap-6 pt-2 border-t dark:border-slate-0">
                      <span className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[10px] mt-1">Balance Payable</span>
                      <span className={cn(
                        "text-2xl font-black italic tracking-tighter",
                        selectedPurchase.dueAmount > 0 ? "text-rose-500 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-500"
                      )}>₹{selectedPurchase.dueAmount.toLocaleString()}</span>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">

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
    </div>
  );
}
