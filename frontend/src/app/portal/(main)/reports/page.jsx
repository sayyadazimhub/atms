'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Printer,
  TrendingUp,
  ShoppingBag,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCw,
  FileText,
  Layers,
  AlertCircle,
  Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/portal/PageHeader';

export default function ReportsPage() {
  const [type, setType] = useState('today');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get('type');
      if (typeParam && ['today', 'weekly', 'daily', 'monthly', 'yearly'].includes(typeParam)) {
        setType(typeParam);
      }
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [type]);

  const fetchReport = () => {
    setLoading(true);
    fetch(`/api/user/reports?type=${type}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load report');
        return res.json();
      })
      .then((resData) => setData(resData))
      .catch((err) => console.error('Failed to load report:', err))
      .finally(() => setLoading(false));
  };

  const handlePrint = () => {
    if (!data) return;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Business Report - ${type.toUpperCase()}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
          @media print {
            @page { margin: 15mm; }
            body { -webkit-print-color-adjust: exact; }
          }
          body { 
            font-family: 'Inter', sans-serif; 
            color: #0f172a;
            line-height: 1.4;
            padding: 0;
            margin: 0;
          }
          .report-header { 
            border-bottom: 4px solid #0f172a; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .brand h1 { 
            font-size: 34px; 
            font-weight: 900; 
            margin: 0; 
            letter-spacing: -1px; 
            text-transform: uppercase;
          }
          .brand p { 
            margin: 2px 0 0 0; 
            font-weight: 700; 
            color: #64748b; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            font-size: 10px;
          }
          .meta-info { text-align: right; }
          .meta-label { 
            font-size: 9px; 
            font-weight: 900; 
            color: #94a3b8; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            margin-bottom: 2px;
          }
          .meta-value { font-size: 14px; font-weight: 900; }

          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 28px;
          }
          .summary-card {
            padding: 16px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
          }
          .summary-label {
            font-size: 10px;
            font-weight: 900;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .summary-value {
            font-size: 20px;
            font-weight: 900;
          }

          .section-title {
            font-size: 11px;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: #f8fafc;
            padding: 8px 12px;
            border-left: 4px solid #0f172a;
            margin-bottom: 12px;
            margin-top: 24px;
          }

          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; table-layout: fixed; }
          th { 
            text-align: left; 
            font-size: 9px; 
            font-weight: 900; 
            text-transform: uppercase; 
            padding: 10px;
            background: #f8fafc;
            border-bottom: 2px solid #0f172a;
            color: #64748b;
          }
          td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 11px; vertical-align: top; }
          .text-right { text-align: right; }
          .font-bold { font-weight: 700; }
          .items-list {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }
          .item-tag {
            font-size: 9px;
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            white-space: nowrap;
          }
          
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 9px; 
            color: #94a3b8; 
            font-weight: 700;
            text-transform: uppercase; 
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="brand">
            <h1>Market Statement</h1>
            <p>Agriculture Trading Management System</p>
          </div>
          <div class="meta-info">
            <div class="meta-label">Audit Period</div>
            <div class="meta-value">
              ${new Date(data.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} — 
              ${new Date(data.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-card" style="background: #f0fdf4;">
            <div class="summary-label" style="color: #166534;">Total Sales</div>
            <div class="summary-value" style="color: #15803d;">₹${Number(data.totalSales || 0).toLocaleString('en-IN')}</div>
          </div>
          <div class="summary-card" style="background: #eff6ff;">
            <div class="summary-label" style="color: #1e40af;">Total Purchases</div>
            <div class="summary-value" style="color: #1d4ed8;">₹${Number(data.totalPurchases || 0).toLocaleString('en-IN')}</div>
          </div>
          <div class="summary-card" style="background: ${data.totalProfit >= 0 ? '#ecfdf5' : '#fef2f2'};">
            <div class="summary-label" style="color: ${data.totalProfit >= 0 ? '#065f46' : '#991b1b'};">${data.totalProfit >= 0 ? 'Net Profit' : 'Net Loss'}</div>
            <div class="summary-value" style="color: ${data.totalProfit >= 0 ? '#047857' : '#b91c1c'};">${data.totalProfit >= 0 ? '+' : '-'}₹${Math.abs(data.totalProfit || 0).toLocaleString('en-IN')}</div>
            <div style="font-size: 9px; font-weight: 700; color: ${data.totalProfit >= 0 ? '#059669' : '#dc2626'}; margin-top: 4px;">Margin: ${data.totalSales > 0 ? ((data.totalProfit / data.totalSales) * 100).toFixed(1) : 0}%</div>
          </div>
        </div>

        <div class="section-title">Sales Analytics (${data.sales?.length || 0} Records)</div>
        <table>
          <thead>
            <tr>
              <th style="width: 15%">Date</th>
              <th style="width: 20%">Customer</th>
              <th style="width: 35%">Commodity Details</th>
              <th style="width: 15%" class="text-right">Total</th>
              <th style="width: 15%" class="text-right">Profit / Loss</th>
            </tr>
          </thead>
          <tbody>
            ${(data.sales || []).map(sale => `
              <tr>
                <td>${new Date(sale.createdAt).toLocaleDateString('en-IN')}</td>
                <td class="font-bold">${sale.customer?.name || 'Walk-in'}</td>
                <td>
                  <div class="items-list">
                    ${(sale.items || []).map(item => `<span class="item-tag">${item.product?.name || 'Item'} (${item.quantity})</span>`).join('')}
                  </div>
                </td>
                <td class="text-right font-bold" style="color: #15803d;">₹${Number(sale.totalAmount || 0).toLocaleString('en-IN')}</td>
                <td class="text-right font-bold" style="color: ${sale.totalProfit >= 0 ? '#047857' : '#b91c1c'};">${sale.totalProfit >= 0 ? '+' : '-'}₹${Math.abs(sale.totalProfit || 0).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="section-title">Procurement Analytics (${data.purchases?.length || 0} Records)</div>
        <table>
          <thead>
            <tr>
              <th style="width: 15%">Date</th>
              <th style="width: 20%">Provider</th>
              <th style="width: 35%">Acquisition Details</th>
              <th style="width: 15%" class="text-right">Outlay</th>
              <th style="width: 15%" class="text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            ${(data.purchases || []).map(p => `
              <tr>
                <td>${new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                <td class="font-bold">${p.provider?.name || 'Unknown'}</td>
                <td>
                  <div class="items-list">
                    ${(p.items || []).map(item => `<span class="item-tag">${item.product?.name || 'Item'} (${item.quantity})</span>`).join('')}
                  </div>
                </td>
                <td class="text-right font-bold" style="color: #1d4ed8;">₹${Number(p.totalAmount || 0).toLocaleString('en-IN')}</td>
                <td class="text-right font-bold" style="color: #b91c1c;">₹${Number(p.dueAmount || 0).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Confidential Business Intelligence • Generated by ATMS • No Signature Required</p>
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

  const totalSales = Number(data?.totalSales || 0);
  const totalPurchases = Number(data?.totalPurchases || 0);
  const totalProfit = Number(data?.totalProfit || 0);
  const totalTransactions = (data?.sales?.length || 0) + (data?.purchases?.length || 0);
  const netMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : '0';

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${totalSales.toLocaleString('en-IN')}`,
      subtext: `${data?.sales?.length || 0} sales transactions`,
      icon: TrendingUp,
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    {
      label: 'Procurement Outlay',
      value: `₹${totalPurchases.toLocaleString('en-IN')}`,
      subtext: `${data?.purchases?.length || 0} purchase orders`,
      icon: ShoppingBag,
      badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    {
      label: totalProfit >= 0 ? 'Net Profit' : 'Net Loss',
      value: `${totalProfit >= 0 ? '+' : '-'}₹${Math.abs(totalProfit).toLocaleString('en-IN')}`,
      subtext: `${netMargin}% profit margin on sales`,
      icon: Wallet,
      badgeBg: totalProfit >= 0
        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    },
    {
      label: 'Total Operations',
      value: `${totalTransactions} Records`,
      subtext: 'Combined trade entries',
      icon: Layers,
      badgeBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20'
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title="Analytical Reports"
        description="Comprehensive audit of revenue, procurement, and profitability performance"
        icon={FileText}
        actionButton={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Timeframe Selector */}
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-10 w-[175px] rounded-xl px-3 border border-slate-200/80 dark:border-slate-800 text-xs font-bold bg-white dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  <SelectValue placeholder="Analytical Window" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl dark:bg-slate-900">
                <SelectItem value="today" className="text-xs font-semibold">Today&apos;s Activity</SelectItem>
                <SelectItem value="weekly" className="text-xs font-semibold">Last 7 Days</SelectItem>
                <SelectItem value="daily" className="text-xs font-semibold">Trailing 30 Days</SelectItem>
                <SelectItem value="monthly" className="text-xs font-semibold">Current Month</SelectItem>
                <SelectItem value="yearly" className="text-xs font-semibold">Fiscal Year</SelectItem>
              </SelectContent>
            </Select>

            {/* Re-Sync Button */}
            <Button
              variant="outline"
              onClick={fetchReport}
              disabled={loading}
              className="h-10 rounded-xl px-3 border-slate-200/80 dark:border-slate-800 text-xs font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
            >
              <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5", loading && "animate-spin")} />
              Sync
            </Button>

            {/* Export PDF Button */}
            <Button
              onClick={handlePrint}
              disabled={!data}
              className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 rounded-xl h-10 px-4 font-bold shadow-sm transition-all flex items-center gap-2 text-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              Export PDF
            </Button>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card
            key={item.label}
            className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                  {item.value}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {item.subtext}
                </p>
              </div>
              <div className={`p-3.5 rounded-2xl border shrink-0 ${item.badgeBg}`}>
                <item.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {loading && !data ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-900 border-t-transparent dark:border-slate-100" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Generating report...</p>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Sales Analytics Table Card */}
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Sales Transactions
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Client liquidations and gross revenue breakdowns
                    </CardDescription>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                  {data.sales?.length || 0} Total Transactions
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {data.sales?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px] text-sm text-slate-600 dark:text-slate-400">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        <th className="p-4 text-left">Date</th>
                        <th className="p-4 text-left">Customer</th>
                        <th className="p-4 text-left">Items Sold</th>
                        <th className="p-4 text-right">Total Amount</th>
                        <th className="p-4 text-right">Profit / Loss</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {data.sales.map((sale) => (
                        <tr
                          key={sale.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {new Date(sale.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                            {sale.customer?.name || 'Walk-in Client'}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1.5">
                              {sale.items?.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                                >
                                  {item.product?.name || 'Item'} ({item.quantity} {item.product?.unit || ''})
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-right font-black text-slate-900 dark:text-slate-100">
                            ₹{Number(sale.totalAmount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="p-4 text-right">
                            <span
                              className={cn(
                                "font-black text-sm",
                                sale.totalProfit >= 0
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400"
                              )}
                            >
                              {sale.totalProfit >= 0 ? '+' : '-'}₹{Math.abs(sale.totalProfit || 0).toLocaleString('en-IN')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 mb-2.5">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Sales Recorded</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    No sales transactions or invoices found for this timeframe.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Procurement Analytics Table Card */}
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <ArrowDownRight className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Procurement Invoices
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Supplier purchasing and payment settlement records
                    </CardDescription>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                  {data.purchases?.length || 0} Total Purchases
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {data.purchases?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px] text-sm text-slate-600 dark:text-slate-400">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        <th className="p-4 text-left">Date</th>
                        <th className="p-4 text-left">Supplier</th>
                        <th className="p-4 text-left">Items Acquired</th>
                        <th className="p-4 text-right">Invoice Amount</th>
                        <th className="p-4 text-right">Pending Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {data.purchases.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {new Date(p.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                            {p.provider?.name || 'Unknown Supplier'}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1.5">
                              {p.items?.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                                >
                                  {item.product?.name || 'Item'} ({item.quantity} {item.product?.unit || ''})
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-right font-black text-slate-900 dark:text-slate-100">
                            ₹{Number(p.totalAmount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="p-4 text-right">
                            <span
                              className={cn(
                                "font-black text-sm",
                                Number(p.dueAmount || 0) > 0
                                  ? "text-rose-600 dark:text-rose-400"
                                  : "text-emerald-600 dark:text-emerald-400"
                              )}
                            >
                              ₹{Number(p.dueAmount || 0).toLocaleString('en-IN')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 mb-2.5">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Procurement Invoices</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    No supplier purchase records found for this timeframe.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm p-12 text-center">
          <AlertCircle className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No report data found for this period</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try selecting a different analytical window above.</p>
        </Card>
      )}
    </div>
  );
}
