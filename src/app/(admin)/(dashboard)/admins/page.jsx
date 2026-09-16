'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  ShieldX,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [editData, setEditData] = useState(null);

  const fetchAdmins = () => {
    setLoading(true);
    axios.get(`/api/admin/admins?search=${search}`)
      .then((res) => setAdmins(res.data.admins))
      .catch(() => toast.error('Failed to load administrators'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdmins();
  }, [search]);

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axios.put('/api/admin/admins', { id, is_active: newStatus });
      toast.success(`Admin account ${newStatus ? 'activated' : 'suspended'}`);
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update status');
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/admin/admins', formData);
      toast.success('Administrator created successfully');
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', phone: '', password: '' });
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put('/api/admin/admins', { 
        id: editData.id, 
        name: editData.name, 
        phone: editData.phone 
      });
      toast.success('Administrator updated successfully');
      setIsEditModalOpen(false);
      setEditData(null);
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await axios.delete(`/api/admin/admins?id=${deleteId}`);
      toast.success('Admin deleted successfully');
      setDeleteId(null);
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete admin');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-600" />
            Administrators
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage system administrators and staff access</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Administrator
        </Button>
      </div>

      {/* Main Content */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/50 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Admin Directory</CardTitle>
              <CardDescription>View and manage all admin accounts</CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search admins by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 border-slate-200 focus-visible:ring-indigo-500 rounded-lg w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="font-semibold text-slate-900">Administrator</TableHead>
                  <TableHead className="font-semibold text-slate-900">Contact</TableHead>
                  <TableHead className="font-semibold text-slate-900">Status</TableHead>
                  <TableHead className="font-semibold text-slate-900">Joined</TableHead>
                  <TableHead className="text-right font-semibold text-slate-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm">Loading administrators...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                      No administrators found
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-slate-100 flex items-center justify-center border border-slate-200 text-indigo-700 font-semibold shadow-sm">
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{admin.name}</p>
                            <Badge variant="outline" className="mt-1 text-[10px] uppercase tracking-wider text-slate-500 border-slate-200 bg-white">
                              {admin.role}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-slate-600">
                            <Mail className="mr-2 h-3.5 w-3.5 text-slate-400" />
                            {admin.email}
                          </div>
                          {admin.phone && (
                            <div className="flex items-center text-sm text-slate-600">
                              <Phone className="mr-2 h-3.5 w-3.5 text-slate-400" />
                              {admin.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm",
                            admin.is_active
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                          )}
                        >
                          {admin.is_active ? 'Active' : 'Suspended'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-slate-600">
                          <Calendar className="mr-2 h-3.5 w-3.5 text-slate-400" />
                          {formatDate(admin.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg">
                              <MoreVertical className="h-4 w-4 text-slate-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-slate-200">
                            <DropdownMenuLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => {
                                setEditData(admin);
                                setIsEditModalOpen(true);
                              }}
                              className="cursor-pointer"
                            >
                              <Edit2 className="mr-2 h-4 w-4 text-blue-500" />
                              <span>Edit Details</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem 
                              onClick={() => toggleStatus(admin.id, admin.is_active)}
                              className="cursor-pointer"
                            >
                              {admin.is_active ? (
                                <>
                                  <ShieldX className="mr-2 h-4 w-4 text-amber-500" />
                                  <span>Suspend Admin</span>
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />
                                  <span>Activate Admin</span>
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setDeleteId(admin.id)}
                              className="cursor-pointer text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete Admin</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Admin Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Administrator</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAdmin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                required 
                value={formData.name}
                onChange={e => setFormData(f => ({...f, name: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={formData.email}
                onChange={e => setFormData(f => ({...f, email: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData(f => ({...f, phone: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={formData.password}
                onChange={e => setFormData(f => ({...f, password: e.target.value}))}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Admin'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Administrator Details</DialogTitle>
          </DialogHeader>
          {editData && (
            <form onSubmit={handleEditAdmin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input 
                  id="edit-name" 
                  required 
                  value={editData.name}
                  onChange={e => setEditData(d => ({...d, name: e.target.value}))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  disabled
                  value={editData.email}
                  className="bg-slate-100"
                />
                <p className="text-xs text-slate-500">Email cannot be changed.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input 
                  id="edit-phone" 
                  type="tel" 
                  value={editData.phone || ''}
                  onChange={e => setEditData(d => ({...d, phone: e.target.value}))}
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-rose-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Administrator
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600 text-sm">
              Are you absolutely sure you want to permanently delete this administrator account? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white" 
              disabled={submitting}
            >
              {submitting ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
