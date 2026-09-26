'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/profile`, { withCredentials: true });
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
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/settings`, { withCredentials: true });
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
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/settings`, {
        ...settings,
        [key]: newValue
      }, { withCredentials: true });
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
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/profile`, profile, { withCredentials: true });
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
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/auth/change-password`, passwordData, { withCredentials: true });
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
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/auth/logout`, {}, { withCredentials: true });
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-slate-900 text-white">
          <SettingsIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Settings</h1>
          <p className="text-sm text-slate-500">Manage your profile and system configuration</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Navigation Tabs */}
        <aside className="lg:col-span-3 space-y-2">
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
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm",
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-slate-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 font-bold gap-3 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9">
          {activeTab === 'profile' && (
            <Card className="border-slate-200 animate-in slide-in-from-right-4 duration-300">
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="text-lg">Personal Profile</CardTitle>
                <CardDescription>Update your administrative account details</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 max-w-2xl">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                      className="h-10 rounded-lg"
                      placeholder="Admin Name"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="h-10 rounded-lg bg-slate-50 border-slate-200 text-slate-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                        className="h-10 rounded-lg"
                        placeholder="+91 0000000000"
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button onClick={handleSaveProfile} disabled={loading} className="h-10 rounded-lg">
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'system' && (
            <Card className="border-slate-200 animate-in slide-in-from-right-4 duration-300">
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="text-lg">System Configuration</CardTitle>
                <CardDescription>Basic system identity and access rules</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-slate-900">Maintenance Mode</Label>
                      <p className="text-xs text-slate-500">Disable all trader access during maintenance</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={() => handleToggle('maintenanceMode')}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-slate-900">Self Registration</Label>
                      <p className="text-xs text-slate-500">Allow new traders to register on their own</p>
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
            <Card className="border-slate-200 animate-in slide-in-from-right-4 duration-300">
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-5 w-5 text-amber-500" />
                  Security Settings
                </CardTitle>
                <CardDescription>Authentication and access controls</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 max-w-2xl">
                    <div className="space-y-4">

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                            className="h-10 rounded-lg"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                            className="h-10 rounded-lg"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button onClick={handleUpdatePassword} disabled={loading} className="h-10 rounded-lg">
                          {loading ? 'Updating...' : 'Update Password'}
                        </Button>
                      </div>
                    </div>


                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="border-slate-200 animate-in slide-in-from-right-4 duration-300">
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="text-lg">Global Notifications</CardTitle>
                <CardDescription>Configure system-wide alert triggers</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-4 sm:grid-cols-2 max-w-4xl">
                  {[
                    { id: 'notifyOnNewTrader', label: 'New Trader Alert', sub: 'Notify admin when a new trader registers' },
                  ].map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-slate-900">{p.label}</Label>
                        <p className="text-xs text-slate-500">{p.sub}</p>
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
