'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  ShieldX,
  Eye,
  Trash2,
  X,
  Plus,
  BadgeCheck,
  Pencil
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { ConfirmModal } from '@/components/ConfirmModal';

export default function TradersPage() {
  const router = useRouter();
  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400); // 400ms delay
    return () => clearTimeout(handler);
  }, [search]);

  const fetchTraders = () => {
    setLoading(true);
    axios.get(`/api/admin/traders?search=${debouncedSearch}`)
      .then((res) => setTraders(res.data.traders))
      .catch(() => toast.error('Failed to load traders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTraders();
  }, [debouncedSearch]);

  const filteredTraders = traders.filter(t => {
    if (statusFilter === 'active') return t.is_active;
    if (statusFilter === 'suspended') return !t.is_active;
    return true;
  });

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await axios.put('/api/admin/traders', { id, status: newStatus });
      toast.success(`Trader ${newStatus === 'active' ? 'activated' : 'suspended'}`);
      fetchTraders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await axios.delete(`/api/admin/traders?id=${deleteId}`);
      toast.success('Trader account deleted successfully');
      setDeleteId(null);
      fetchTraders();
    } catch (error) {
      toast.error('Failed to delete trader');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTrader = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/admin/traders', formData);
      toast.success('Trader created successfully');
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', phone: '', password: '' });
      fetchTraders();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create trader');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTrader = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put('/api/admin/traders', { 
        id: editData.id, 
        name: editData.name, 
        phone: editData.phone 
      });
      toast.success('Trader updated successfully');
      setIsEditModalOpen(false);
      setEditData(null);
      fetchTraders();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update trader');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Trader Account?"
        description="Are you sure you want to delete this trader account? This action cannot be undone and will remove all associated data."
        isLoading={submitting}
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
              <Users className="h-6 w-6" />
            </div>
            Traders Management
          </h1>
          <p className="text-slate-500 mt-2">View and manage all registered trading accounts</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all rounded-xl h-11 px-6 font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Trader
        </Button>
      </div>

      {/* Filters & Search & Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/50 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Trader Directory</CardTitle>
              <CardDescription>View and manage all trading accounts</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search traders by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-10 border-slate-200 focus-visible:ring-emerald-500 rounded-lg w-full"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 bg-white border-slate-200 text-slate-700 rounded-lg focus-visible:ring-emerald-500 w-full sm:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter {statusFilter !== 'all' && <span className="ml-1.5 flex h-2 w-2 rounded-full bg-emerald-500"></span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 rounded-xl p-2 shadow-lg">
                  <DropdownMenuLabel className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Filter by Status</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                    <DropdownMenuRadioItem value="all" className="cursor-pointer rounded-lg font-medium">All Statuses</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="active" className="cursor-pointer rounded-lg text-emerald-700 focus:text-emerald-800 focus:bg-emerald-50 font-medium">Active Only</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="suspended" className="cursor-pointer rounded-lg text-rose-700 focus:text-rose-800 focus:bg-rose-50 font-medium">Suspended Only</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {(search !== '' || statusFilter !== 'all') && (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('all');
                  }}
                  className="h-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg px-3"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="font-semibold text-slate-900">Trader Name</TableHead>
                  <TableHead className="font-semibold text-slate-900">Contact Info</TableHead>
                  <TableHead className="font-semibold text-slate-900">Joined</TableHead>
                  <TableHead className="font-semibold text-slate-900">Status</TableHead>
                  <TableHead className="text-right font-semibold text-slate-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" />
                          <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
                          <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
                          <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
                          <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredTraders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                      No traders found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTraders.map((trader) => (
                    <TableRow key={trader.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-slate-100 border border-slate-200 text-emerald-700 font-semibold shadow-sm shrink-0">
                            {trader.name?.charAt(0) || 'T'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-sm text-slate-900 truncate">{trader.name}</p>
                              {trader.emailVerified && (
                                <BadgeCheck className="h-4 w-4 text-emerald-500" title="Verified Trader" />
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            {/* <Mail className="h-4 w-4 text-slate-400 shrink-0" /> */}
                            <span className="truncate font-medium text-slate-800">{trader.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                            <span className="truncate">{trader.phone || 'No phone'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {trader.joined ? new Date(trader.joined).toLocaleDateString() : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm",
                            trader.is_active
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                          )}
                        >
                          {trader.is_active ? 'Active' : 'Suspended'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            onClick={() => router.push(`/traders/${trader.id}`)}
                            title="View Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-500 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                            onClick={() => {
                              setEditData({ id: trader.id, name: trader.name, phone: trader.phone || '' });
                              setIsEditModalOpen(true);
                            }}
                            title="Edit Trader"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                              "h-8 w-8 rounded-lg",
                              trader.is_active 
                                ? "text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                                : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                            )}
                            onClick={() => toggleStatus(trader.id, trader.is_active ? 'active' : 'suspended')}
                            title={trader.is_active ? "Suspend Trader" : "Activate Trader"}
                          >
                            {trader.is_active ? <ShieldX className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            onClick={() => setDeleteId(trader.id)}
                            title="Delete Trader"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Trader Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Add New Trader</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTrader} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">Full Name</Label>
              <Input 
                id="name" 
                required 
                value={formData.name}
                onChange={e => setFormData(f => ({...f, name: e.target.value}))}
                className="bg-white text-slate-900 border-slate-300 focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={formData.email}
                onChange={e => setFormData(f => ({...f, email: e.target.value}))}
                className="bg-white text-slate-900 border-slate-300 focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700">Phone Number (Optional)</Label>
              <Input 
                id="phone" 
                value={formData.phone}
                onChange={e => setFormData(f => ({...f, phone: e.target.value}))}
                className="bg-white text-slate-900 border-slate-300 focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Temporary Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={formData.password}
                onChange={e => setFormData(f => ({...f, password: e.target.value}))}
                className="bg-white text-slate-900 border-slate-300 focus-visible:ring-emerald-500"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="border-slate-300 text-slate-700">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {submitting ? 'Creating...' : 'Create Trader'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Trader Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Edit Trader Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditTrader} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-slate-700">Full Name</Label>
              <Input 
                id="edit-name" 
                required 
                value={editData?.name || ''}
                onChange={e => setEditData(d => ({...d, name: e.target.value}))}
                className="bg-white text-slate-900 border-slate-300 focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="text-slate-700">Phone Number</Label>
              <Input 
                id="edit-phone" 
                value={editData?.phone || ''}
                onChange={e => setEditData(d => ({...d, phone: e.target.value}))}
                className="bg-white text-slate-900 border-slate-300 focus-visible:ring-emerald-500"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="border-slate-300 text-slate-700">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
