'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Mail, Smartphone, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/PageHeader';

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [originalProfile, setOriginalProfile] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/admin/profile`);
        const data = {
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
        };
        setProfile(data);
        setOriginalProfile(data);
      } catch (error) {
        toast.error('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/api/admin/profile`, profile);
      setOriginalProfile(profile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <PageHeader 
          title="Personal Profile"
          description="View and update your administrative account details."
          icon={User}
        />
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        <Card className="border-slate-200/80 shadow-sm overflow-hidden">
          {/* Decorative Header Background */}
          <div className="h-24 bg-gradient-to-r from-slate-100 to-emerald-50/50 w-full border-b border-slate-100"></div>
          
          <CardContent className="px-6 sm:px-8 pb-8">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 -mt-10 mb-8">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-emerald-600 flex items-center justify-center text-white text-3xl font-bold shadow-md border-4 border-white shrink-0">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="mt-2 sm:mt-8">
                  <h3 className="text-xl font-bold text-slate-900">{profile.name || 'Administrator'}</h3>
                  <p className="text-sm text-slate-500">{profile.email || 'No email provided'}</p>
                </div>
              </div>
              {!isEditing && (
                <div className="sm:mt-8">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(true)} 
                    className="gap-2 bg-white"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</Label>
                  {isEditing ? (
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="pl-10 h-11 bg-white border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 rounded-lg transition-all"
                        required
                        placeholder="e.g. John Doe"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 pt-1">
                      <User className="h-5 w-5 text-emerald-600 shrink-0" />
                      <span className="text-slate-900 font-medium text-base truncate">{profile.name || 'Not set'}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                  {isEditing ? (
                    <>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          className="pl-10 h-11 bg-slate-50 text-slate-500 border-slate-200 rounded-lg cursor-not-allowed"
                          disabled
                        />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Email address cannot be changed.</p>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 pt-1">
                      <Mail className="h-5 w-5 text-emerald-600 shrink-0" />
                      <span className="text-slate-900 font-medium text-base truncate">{profile.email}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone Number</Label>
                {isEditing ? (
                  <div className="relative max-w-md">
                    <Smartphone className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <Input
                      id="phone"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="pl-10 h-11 bg-white border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 rounded-lg transition-all"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pt-1 max-w-md">
                    <Smartphone className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="text-slate-900 font-medium text-base truncate">{profile.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          
          {isEditing && (
            <CardFooter className="border-t border-slate-100 bg-slate-50/80 px-6 sm:px-8 py-4 flex justify-end gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 shadow-sm rounded-lg"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          )}
        </Card>
      </form>
    </div>
  );
}
