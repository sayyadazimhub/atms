'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/PageHeader';

export default function SecuritySettingsPage() {
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.put(`/api/admin/auth/change-password`, passwordData);
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <PageHeader 
          title="Security Settings"
          description="Update your password and secure your account."
          icon={Shield}
        />
      </div>

      <form onSubmit={handleUpdatePassword} className="space-y-6">
        <Card className="border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
            <CardTitle className="text-lg">Change Password</CardTitle>
            <CardDescription>
              Ensure you use a strong, random password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 max-w-lg px-6 sm:px-8 py-8">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-semibold text-slate-700">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword || ''}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                className="h-11 bg-white border-slate-200 focus-visible:ring-amber-500/20 focus-visible:border-amber-500 rounded-lg transition-all"
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-semibold text-slate-700">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={6}
                className="h-11 bg-white border-slate-200 focus-visible:ring-amber-500/20 focus-visible:border-amber-500 rounded-lg transition-all"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                className="h-11 bg-white border-slate-200 focus-visible:ring-amber-500/20 focus-visible:border-amber-500 rounded-lg transition-all"
                placeholder="Confirm new password"
              />
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 bg-slate-50/80 px-6 sm:px-8 py-4 flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 shadow-sm rounded-lg transition-colors"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
