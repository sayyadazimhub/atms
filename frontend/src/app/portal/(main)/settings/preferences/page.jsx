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
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 dark:border-slate-100 border-t-transparent" />
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
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-16 mx-auto">
      <PageHeader
        title="Preferences & Alerts"
        description="Configure system notifications and trading communication rules"
        icon={Bell}
        glowColor="bg-blue-500/10"
      />

      <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/60 dark:bg-slate-800/40 p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-black text-slate-900 dark:text-slate-100">Notification Channels</CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Customize which events and triggers push alerts to your workspace.
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
                  className="group flex items-start justify-between p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-all duration-200"
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

          <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm">
              <Fingerprint className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-950 dark:text-blue-200">Secure Synchronization</p>
              <p className="text-[11px] text-blue-800/70 dark:text-blue-300/70 mt-0.5">Preferences are saved to your account and synced across your devices.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="h-11 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
