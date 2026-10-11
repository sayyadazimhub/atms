'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/portal/PageHeader';
import {
  TrendingUp,
  Wallet,
  AlertTriangle,
  Calendar,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
  FileText,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('today');

  useEffect(() => {
    fetchDashboardData(period);
  }, [period]);

  const fetchDashboardData = (selectedPeriod) => {
    setLoading(true);

    const end = new Date();
    const start = new Date();

    if (selectedPeriod === 'today') {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (selectedPeriod === '7' || selectedPeriod === 'weekly') {
      start.setDate(end.getDate() - 7);
    } else if (selectedPeriod === '30' || selectedPeriod === 'daily') {
      start.setDate(end.getDate() - 30);
    } else if (selectedPeriod === 'month') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    } else if (selectedPeriod === 'year') {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
    }

    const query = new URLSearchParams({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });

    fetch(`/api/user/dashboard?${query.toString()}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch dashboard data');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard metrics');
      })
      .finally(() => setLoading(false));
  };

  if (loading && !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent dark:border-slate-100" />
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Loading metrics...
        </p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center p-8 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 max-w-md">
          <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto mb-3" />
          <p className="text-rose-600 dark:text-rose-400 font-bold mb-4">{error}</p>
          <Button
            onClick={() => fetchDashboardData(period)}
            className="rounded-xl px-5 font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
          >
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  const s = data?.summary || {};
  const lowStock = data?.lowStockProducts || [];
  const recent = data?.recentTransactions || {};
  const chartData = data?.chartData || [];

  const totalSales = Number(s.totalSales || 0);
  const totalProfit = Number(s.totalProfit || 0);
  const totalReceivables = Number(s.totalDueFromCustomers || 0);
  const totalPayables = Number(s.totalDueToProviders || 0);
  const netMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : '0';

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${totalSales.toLocaleString('en-IN')}`,
      subtext: 'Completed sales volume',
      icon: TrendingUp,
      badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    {
      label: 'Gross Profit',
      value: `₹${totalProfit.toLocaleString('en-IN')}`,
      subtext: `${netMargin}% margin on sales`,
      icon: Wallet,
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    {
      label: 'Receivables',
      value: `₹${totalReceivables.toLocaleString('en-IN')}`,
      subtext: 'Pending from customers',
      icon: ArrowUpRight,
      badgeBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20'
    },
    {
      label: 'Payables',
      value: `₹${totalPayables.toLocaleString('en-IN')}`,
      subtext: 'Pending to suppliers',
      icon: ArrowDownRight,
      badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    },
  ];

  const combinedRecent = [
    ...(recent.sales || []).map(item => ({ ...item, type: 'sale' })),
    ...(recent.purchases || []).map(item => ({ ...item, type: 'purchase' }))
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Dashboard Overview"
        description="Key financial metrics, revenue performance, and inventory status"
        icon={LayoutDashboard}
        actionButton={
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 h-10 shadow-sm">
              <Calendar className="h-4 w-4 text-slate-400" />
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="border-0 shadow-none p-0 h-auto text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-0 w-[120px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
                  <SelectItem value="today" className="text-xs font-semibold">Today</SelectItem>
                  <SelectItem value="weekly" className="text-xs font-semibold">Last 7 Days</SelectItem>
                  <SelectItem value="month" className="text-xs font-semibold">This Month</SelectItem>
                  <SelectItem value="30" className="text-xs font-semibold">Last 30 Days</SelectItem>
                  <SelectItem value="year" className="text-xs font-semibold">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Link href="/portal/reports">
              <Button
                variant="outline"
                className="h-10 rounded-xl px-4 border-slate-200/80 dark:border-slate-800 text-xs font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all"
              >
                <FileText className="h-3.5 w-3.5 mr-2" />
                Full Reports
              </Button>
            </Link>
          </div>
        }
      />

      {/* 4 Core Financial Metrics */}
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

      {/* Trends & Activity in One Responsive Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[55%_auto] gap-6 items-stretch">
        {/* Financial Trends Chart */}
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Revenue & Profit Trends
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sales income and gross profit trajectories
                </CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  <span>Sales</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
                  <span>Profit</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 flex-1 flex flex-col justify-center">
            <div className="h-[300px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={3}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100 dark:stroke-slate-800/80" />
                    <XAxis
                      dataKey="date"
                      fontSize={11}
                      fontWeight={600}
                      tickLine={false}
                      axisLine={false}
                      stroke="#94a3b8"
                      dy={8}
                      tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis
                      fontSize={11}
                      fontWeight={600}
                      tickLine={false}
                      axisLine={false}
                      stroke="#94a3b8"
                      tickFormatter={(val) => (val === 0 ? '0' : `₹${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`)}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 shadow-xl text-slate-900 dark:text-slate-100 min-w-[170px]">
                              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2">
                                {new Date(label).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                              <div className="space-y-1.5 text-xs">
                                <div className="flex items-center justify-between gap-4">
                                  <span className="font-medium text-slate-500 dark:text-slate-400">Sales</span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    ₹{Number(payload[0]?.value || 0).toLocaleString('en-IN')}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                  <span className="font-medium text-slate-500 dark:text-slate-400">Profit</span>
                                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                    ₹{Number(payload[1]?.value || 0).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                    <Bar dataKey="profit" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                  <Package className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-xs font-semibold">No transactions recorded for this period</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions Activity Feed */}
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Latest customer sales and supplier acquisitions
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/portal/sales">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg px-2.5 text-xs font-bold border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Sales
                  </Button>
                </Link>
                <Link href="/portal/purchases">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg px-2.5 text-xs font-bold border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Purchases
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col justify-between">
            {combinedRecent.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {combinedRecent.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="p-3.5 sm:px-5 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border ${
                          item.type === 'sale'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                        }`}
                      >
                        {item.type === 'sale' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                          {item.type === 'sale'
                            ? item.customer?.name || 'Walk-in Client'
                            : item.provider?.name || 'Supplier'}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          <span className="font-bold uppercase text-[9px]">
                            {item.type === 'sale' ? 'Sale' : 'Purchase'}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(item.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric'
                            })} at {new Date(item.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p
                        className={`text-xs sm:text-sm font-black ${
                          item.type === 'sale'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {item.type === 'sale' ? '+' : '-'}₹{Number(item.totalAmount || 0).toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        {item.items?.length || 0} item{(item.items?.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-xs">
                No recent activity recorded
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
