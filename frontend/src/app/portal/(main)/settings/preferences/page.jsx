'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Fingerprint, Mail, Package, ShoppingCart, TrendingUp, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/portal/PageHeader';

export default function PreferencesSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      lowStock: true,
      newSale: true,
      newPurchase: true,
    }
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setInitialLoading(true);
    try {
      const res = await api.get('/api/user/settings');
      if (res.data) {
        setPreferences({
          ...res.data,
          notifications: {
            email: res.data.notifications?.email ?? true,
            lowStock: res.data.notifications?.lowStock ?? true,
            newSale: res.data.notifications?.newSale ?? true,
            newPurchase: res.data.notifications?.newPurchase ?? true,
          }
        });
      }
    } catch (error) {
      toast.error('Failed to load preferences');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleToggle = (key, checked) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: checked,
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put('/api/user/settings', preferences);
      setPreferences(res.data);
      toast.success('Preferences saved successfully');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent dark:border-slate-100" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading preferences...</p>
      </div>
    );
  }

  const preferenceItems = [
    {
      id: 'email',
      title: 'Email Reports & Summaries',
      desc: 'Receive periodic analytics digests and account statements.',
      icon: Mail,
    },
    {
      id: 'lowStock',
      title: 'Critical Stock Alerts',
      desc: 'Trigger warnings when product inventory falls below reorder threshold.',
      icon: Package,
    },
    {
      id: 'newSale',
      title: 'Real-time Sales Notifications',
      desc: 'Instant updates whenever a customer invoice or sale is completed.',
      icon: TrendingUp,
    },
    {
      id: 'newPurchase',
      title: 'Purchase & Inbound Delivery Alerts',
      desc: 'Alerts when stock supplies and vendor bills are recorded.',
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <PageHeader
        title="Preferences & Alerts"
        description="Configure system notifications and trading communication rules"
        icon={Bell}
        actionButton={
          <Button
            onClick={handleSave}
            disabled={loading}
            className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-sm flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Main Switches Card (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/40 p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Notification Triggers</CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Customize which business events push real-time alerts to your account.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {preferenceItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="group flex items-start justify-between p-5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50/80 dark:hover:bg-slate-900/80 transition-all duration-200"
                    >
                      <div className="space-y-1 pr-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors" />
                          <Label htmlFor={item.id} className="text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer">
                            {item.title}
                          </Label>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{item.desc}</p>
                      </div>
                      <Switch
                        id={item.id}
                        checked={!!preferences.notifications[item.id]}
                        onCheckedChange={(checked) => handleToggle(item.id, checked)}
                        className="data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-slate-100 shrink-0 mt-0.5"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="h-10 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Sync Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Fingerprint className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Secure Cloud Sync</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Preferences are synced automatically to your user session and browser.</p>
              </div>
            </div>
          </Card>

          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Delivery Channels
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              In-app toast alerts are delivered instantly during transactions. Email digests are batched according to your selected analytical window.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
