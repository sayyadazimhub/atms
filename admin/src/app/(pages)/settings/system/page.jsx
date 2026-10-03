'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Layout, Bell, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/PageHeader';

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    traderSelfRegistration: true,
    notifyOnNewTrader: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get(`/api/admin/settings`);
        if (res.data) {
          setSettings({
            maintenanceMode: res.data.maintenanceMode,
            traderSelfRegistration: res.data.traderSelfRegistration,
            notifyOnNewTrader: res.data.notifyOnNewTrader ?? true,
          });
        }
      } catch (error) {
        toast.error('Failed to load settings');
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = async (key) => {
    const newValue = !settings[key];
    setSettings(s => ({ ...s, [key]: newValue }));
    
    try {
      await api.put(`/api/admin/settings`, {
        ...settings,
        [key]: newValue
      });
      toast.success('Setting updated automatically');
    } catch (error) {
      toast.error('Failed to update setting');
      setSettings(s => ({ ...s, [key]: !newValue }));
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <PageHeader 
          title="System & Alerts"
          description="Manage platform access rules and your email notifications."
          icon={Layout}
        />
      </div>

      <div className="space-y-6">
        <Card className="border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6 px-6 sm:px-8">
            <CardTitle className="text-lg">Access Controls</CardTitle>
            <CardDescription>
              Manage who can access the trading platform and under what conditions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 sm:px-8 py-8">
            {[
              { id: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Disable all trader access during maintenance windows. Only admins can log in.' },
              { id: 'traderSelfRegistration', label: 'Self Registration', desc: 'Allow new traders to register on their own via the public landing page.' },
            ].map((p) => (
              <div key={p.id} className="flex items-start justify-between gap-6 rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
                <div className="space-y-1.5 pr-4">
                  <Label className="text-base font-semibold text-slate-800">{p.label}</Label>
                  <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
                <div className="pt-1">
                  <Switch
                    checked={settings[p.id]}
                    onCheckedChange={() => handleToggle(p.id)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6 px-6 sm:px-8">
            <CardTitle className="text-lg flex items-center gap-2">
              Email Alerts
            </CardTitle>
            <CardDescription>
              Choose what events trigger an email to your administrative account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 sm:px-8 py-8">
            <div className="space-y-4">
              {[
                { id: 'notifyOnNewTrader', label: 'New Trader Registration', desc: 'Receive an email alert instantly whenever a new trader registers in the system.' },
              ].map((p) => (
                <div key={p.id} className="flex items-start justify-between gap-6 rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
                  <div className="space-y-1.5 pr-4">
                    <Label className="text-base font-semibold text-slate-800">{p.label}</Label>
                    <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="pt-1">
                    <Switch
                      checked={settings[p.id]}
                      onCheckedChange={() => handleToggle(p.id)}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-blue-50/80 p-5 flex gap-4 items-start border border-blue-100/50 shadow-sm mt-8">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900">Automatic Saving</h4>
                <p className="text-sm text-blue-700/80 mt-1.5 leading-relaxed">
                  Both system and notification preferences are saved automatically as soon as you toggle them. No need to look for a save button.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
