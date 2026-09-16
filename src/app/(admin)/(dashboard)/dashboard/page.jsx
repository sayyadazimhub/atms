'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Users,
  TrendingUp,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Activity,
  UserPlus,
  BarChart3,
  Settings
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/admin/dashboard')
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
      </div>
    );
  }

  const s = data?.summary || {};
  const stats = [
    {
      label: 'Total Traders',
      value: s.totalTraders || 0,
      icon: Users,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Administrators',
      value: s.totalAdmins || 0,
      icon: ShieldCheck,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      label: 'System Status',
      value: s.maintenanceMode ? 'Maintenance' : 'Online',
      icon: Activity,
      bgColor: s.maintenanceMode ? 'bg-rose-50' : 'bg-emerald-50',
      iconColor: s.maintenanceMode ? 'text-rose-600' : 'text-emerald-600',
    },
  ];

  const pieData = [
    { name: 'Active', value: s.activeTraders || 0 },
    { name: 'Suspended', value: (s.totalTraders || 0) - (s.activeTraders || 0) },
  ];
  const pieColors = ['#10B981', '#F43F5E'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-slate-500">Monitor your network's activity and system health.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">{item.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{item.value}</p>
                </div>
                <div className={`p-4 rounded-2xl ${item.bgColor}`}>
                  <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Recent Registered Traders Chart */}
        <Card className="border-slate-200 lg:col-span-2">
          <CardHeader className="border-b bg-slate-50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <UserPlus className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Trader Growth</CardTitle>
                <CardDescription>Active vs Suspended registrations over time</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="activeTraders" name="Active" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="suspendedTraders" name="Suspended" stackId="a" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card className="border-slate-200 lg:col-span-1 flex flex-col">
          <CardHeader className="border-b bg-slate-50">
            <CardTitle className="text-lg">Status Distribution</CardTitle>
            <CardDescription>Overall ratio of active users</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col justify-between">
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    itemStyle={{ color: '#0f172a', fontWeight: '500' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-900">{s.totalTraders || 0}</span>
                <span className="text-xs text-slate-500 font-medium">Total</span>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: pieColors[index] }} />
                    <span className="text-sm font-medium text-slate-600">{entry.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
}
