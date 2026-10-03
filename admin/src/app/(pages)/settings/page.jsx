'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Settings as SettingsIcon,
  Lock,
  Database,
  Shield,
  Bell,
  Layout,
  Save,
  RefreshCw,
  LogOut,
  User
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/PageHeader';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    traderSelfRegistration: true,
    notifyOnNewTrader: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/admin/profile`);
        setProfile({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
        });
      } catch (error) {
        toast.error('Failed to load profile');
      }
    };
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
    fetchProfile();
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

  const handleSelect = (key, value) => {
    setSettings(s => ({ ...s, [key]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await api.put(`/api/admin/profile`, profile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.put(`/api/admin/auth/change-password`, passwordData);
      toast.success('Password updated successfully');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // System settings would be saved here if a model existed
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post(`/api/admin/auth/logout`, {});
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <PageHeader 
        title="Settings"
        description="Manage your profile and system configuration"
        icon={SettingsIcon}
      />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Tabs */}
        <aside className="md:w-64 shrink-0 space-y-1">
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'profile', label: 'Personal Profile', icon: User },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'system', label: 'System Config', icon: Layout },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-slate-100 text-slate-900 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="pt-4 mt-4 border-t border-slate-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 font-medium gap-3 rounded-md shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 max-w-3xl">
          {activeTab === 'profile' && (
            <Card className="border-slate-200 shadow-sm animate-in fade-in duration-300">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-xl">Personal Profile</CardTitle>
                <CardDescription>Update your administrative account details</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6 max-w-2xl">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                      className="max-w-md"
                      placeholder="Admin Name"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 0000000000"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50/50 px-6 py-4">
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === 'system' && (
            <Card className="border-slate-200 shadow-sm animate-in fade-in duration-300">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-xl">System Configuration</CardTitle>
                <CardDescription>Basic system identity and access rules</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium text-slate-900">Maintenance Mode</Label>
                      <p className="text-sm text-slate-500">Disable all trader access during maintenance windows</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={() => handleToggle('maintenanceMode')}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium text-slate-900">Self Registration</Label>
                      <p className="text-sm text-slate-500">Allow new traders to register on their own</p>
                    </div>
                    <Switch
                      checked={settings.traderSelfRegistration}
                      onCheckedChange={() => handleToggle('traderSelfRegistration')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="border-slate-200 shadow-sm animate-in fade-in duration-300">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-xl">Security Settings</CardTitle>
                <CardDescription>Authentication and access controls for your admin account</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50/50 px-6 py-4">
                <Button onClick={handleUpdatePassword} disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="border-slate-200 shadow-sm animate-in fade-in duration-300">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-xl">Global Notifications</CardTitle>
                <CardDescription>Configure system-wide alert triggers</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { id: 'notifyOnNewTrader', label: 'New Trader Alert', sub: 'Notify admin when a new trader registers in the system' },
                  ].map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium text-slate-900">{p.label}</Label>
                        <p className="text-sm text-slate-500">{p.sub}</p>
                      </div>
                      <Switch
                        checked={settings[p.id]}
                        onCheckedChange={() => handleToggle(p.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
