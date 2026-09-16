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
  Pencil,
  FileText,
  CheckCircle,
  XCircle,
  Clock
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud } from 'lucide-react';
import statesDistrictsData from '@/lib/states-districts.json';

export default function TradersPage() {
  const router = useRouter();
  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '',
    state: '',
    district: '',
    proof: null
  });

  const availableDistricts = formData.state 
    ? statesDistrictsData.states.find(s => s.state === formData.state)?.districts || []
    : [];

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
    let statusMatch = true;
    if (statusFilter === 'active') statusMatch = t.is_active;
    if (statusFilter === 'suspended') statusMatch = !t.is_active;

    let verificationMatch = true;
    if (verificationFilter !== 'all') {
      verificationMatch = t.verificationStatus === verificationFilter;
    }

    return statusMatch && verificationMatch;
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

    if (!formData.name.trim()) return toast.error('Full Name is required');
    if (!formData.email.trim()) return toast.error('Email Address is required');
    if (!formData.password.trim()) return toast.error('Password is required');
    if (!formData.state) return toast.error('State is required');
    if (!formData.district) return toast.error('District is required');
    if (!formData.proof) return toast.error('Please upload a trading proof document');

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('password', formData.password);
      data.append('state', formData.state);
      data.append('district', formData.district);
      data.append('proof', formData.proof);

      await axios.post('/api/admin/traders', data);
      toast.success('Trader created successfully');
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', phone: '', password: '', state: '', district: '', proof: null });
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

  const handleReviewTrader = async (status) => {
    if (status === 'REJECTED' && !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setSubmitting(true);
    try {
      await axios.put('/api/admin/traders/verify', { 
        id: reviewData.id, 
        status, 
        reason: status === 'REJECTED' ? rejectionReason : null 
      });
      toast.success(`Trader ${status.toLowerCase()} successfully`);
      setIsReviewModalOpen(false);
      setReviewData(null);
      setRejectionReason('');
      fetchTraders();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to verify trader');
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
                    Filter {(statusFilter !== 'all' || verificationFilter !== 'all') && <span className="ml-1.5 flex h-2 w-2 rounded-full bg-emerald-500"></span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 rounded-xl p-2 shadow-lg">
                  <DropdownMenuLabel className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Filter by Status</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                    <DropdownMenuRadioItem value="all" className="cursor-pointer rounded-lg font-medium">All Statuses</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="active" className="cursor-pointer rounded-lg text-emerald-700 focus:text-emerald-800 focus:bg-emerald-50 font-medium">Active Only</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="suspended" className="cursor-pointer rounded-lg text-rose-700 focus:text-rose-800 focus:bg-rose-50 font-medium">Suspended Only</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <div className="h-px bg-slate-100 my-2" />
                  <DropdownMenuLabel className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Filter by Verification</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={verificationFilter} onValueChange={setVerificationFilter}>
                    <DropdownMenuRadioItem value="all" className="cursor-pointer rounded-lg font-medium">All Verifications</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="APPROVED" className="cursor-pointer rounded-lg text-emerald-700 focus:text-emerald-800 focus:bg-emerald-50 font-medium">Approved</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="PENDING" className="cursor-pointer rounded-lg text-amber-700 focus:text-amber-800 focus:bg-amber-50 font-medium">Pending Review</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="REJECTED" className="cursor-pointer rounded-lg text-rose-700 focus:text-rose-800 focus:bg-rose-50 font-medium">Rejected</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="UNVERIFIED" className="cursor-pointer rounded-lg text-slate-700 focus:text-slate-800 focus:bg-slate-50 font-medium">Unverified</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {(search !== '' || statusFilter !== 'all' || verificationFilter !== 'all') && (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('all');
                    setVerificationFilter('all');
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
                  <TableHead className="font-semibold text-slate-900">Address</TableHead>
                  <TableHead className="font-semibold text-slate-900">Verification</TableHead>
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
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm text-slate-700">{trader.state || 'N/A'}</span>
                          <span className="text-xs text-slate-500">{trader.district || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm border",
                            trader.verificationStatus === 'APPROVED' ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" :
                            trader.verificationStatus === 'PENDING' ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" :
                            trader.verificationStatus === 'REJECTED' ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100" :
                            "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          {trader.verificationStatus === 'APPROVED' && <CheckCircle className="h-3 w-3 mr-1 inline" />}
                          {trader.verificationStatus === 'PENDING' && <Clock className="h-3 w-3 mr-1 inline" />}
                          {trader.verificationStatus === 'REJECTED' && <XCircle className="h-3 w-3 mr-1 inline" />}
                          {trader.verificationStatus}
                        </Badge>
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
                        <div className="flex justify-end gap-1">
                          {trader.verificationStatus === 'PENDING' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                              onClick={() => {
                                setReviewData(trader);
                                setIsReviewModalOpen(true);
                              }}
                              title="Review Verification"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                          {trader.verificationStatus === 'APPROVED' && trader.verificationProofUrl && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                              onClick={() => {
                                setReviewData(trader);
                                setIsReviewModalOpen(true);
                              }}
                              title="View Verification Document"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
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
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-slate-900">Add New Trader</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTrader} className="flex-1 overflow-y-auto pr-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">Full Name <span className='text-red-500'>*</span></Label>
                <Input 
                  id="name" 
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={e => setFormData(f => ({...f, name: e.target.value}))}
                  className="bg-white text-slate-900 border-slate-300 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email Address <span className='text-red-500'>*</span></Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={e => setFormData(f => ({...f, email: e.target.value}))}
                  className="bg-white text-slate-900 border-slate-300 focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700">Phone Number (Optional)</Label>
                <Input 
                  id="phone" 
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={e => setFormData(f => ({...f, phone: e.target.value}))}
                  className="bg-white text-slate-900 border-slate-300 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password <span className='text-red-500'>*</span></Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={e => setFormData(f => ({...f, password: e.target.value}))}
                  className="bg-white text-slate-900 border-slate-300 focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-slate-700">State <span className='text-red-500'>*</span></Label>
                <Select value={formData.state} onValueChange={(val) => setFormData(f => ({ ...f, state: val, district: '' }))}>
                  <SelectTrigger id="state" className="bg-white text-slate-900 border-slate-300">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {statesDistrictsData.states.map((stateObj) => (
                      <SelectItem key={stateObj.state} value={stateObj.state}>
                        {stateObj.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district" className="text-slate-700">District <span className='text-red-500'>*</span></Label>
                <Select value={formData.district} onValueChange={(val) => setFormData(f => ({ ...f, district: val }))} disabled={!formData.state}>
                  <SelectTrigger id="district" className="bg-white text-slate-900 border-slate-300">
                    <SelectValue placeholder={formData.state ? "Select District" : "Select State First"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDistricts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proof">Upload Trading Proof (PDF, JPG, PNG) <span className='text-red-500'>*</span></Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
                <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
                <Input
                  id="proof"
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/jpg"
                  className="hidden"
                  onChange={e => setFormData(f => ({ ...f, proof: e.target.files?.[0] || null }))}
                />
                <Button type="button" variant="outline" className="border-slate-300 text-slate-700 font-medium" onClick={() => document.getElementById('proof').click()}>
                  Select File
                </Button>
                {formData.proof && (
                  <p className="mt-2 text-sm text-emerald-600 font-medium">Selected: {formData.proof.name}</p>
                )}
              </div>
            </div>

            <DialogFooter className="pt-2 shrink-0">
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

      {/* Review Trader Dialog */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-4xl bg-white h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Review Trader Verification</DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex flex-col gap-4 overflow-hidden pt-2">
            {reviewData && (() => {
              const url = reviewData.verificationProofUrl;
              let viewerUrl = url;
              let isImage = false;
              let isPdf = false;
              
              if (url) {
                isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i) || url.includes('/image/upload/');
                isPdf = url.match(/\.pdf$/i);
                
                if (!isImage || isPdf) {
                  viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`;
                }
              }

              return (
              <>
                <div className="flex items-center justify-between shrink-0">
                  <div>
                    <p className="text-sm font-semibold">Trader: {reviewData.name}</p>
                    <p className="text-sm text-slate-600">Email: {reviewData.email}</p>
                  </div>
                  {url && (
                    <a 
                      href={viewerUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 hover:underline text-sm font-medium flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Open in new tab
                    </a>
                  )}
                </div>
                
                {url ? (
                  <div className="flex-1 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 min-h-0 flex items-center justify-center">
                    {isImage && !isPdf ? (
                      <img 
                        src={url} 
                        alt="Verification Proof" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <iframe 
                        src={`${viewerUrl}&embedded=true`} 
                        title="Verification Document"
                        className="w-full h-full border-0"
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-500">No document provided.</p>
                  </div>
                )}

                {reviewData.verificationStatus === 'PENDING' ? (
                  <>
                    <div className="space-y-2 shrink-0">
                      <Label htmlFor="rejection" className="text-slate-700">Rejection Reason (if rejecting)</Label>
                      <Input 
                        id="rejection" 
                        placeholder="e.g. Document is blurry, Name does not match"
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                        className="bg-white text-slate-900 border-slate-300 focus-visible:ring-emerald-500"
                      />
                    </div>
                    <DialogFooter className="pt-2 shrink-0">
                      <Button type="button" variant="outline" onClick={() => setIsReviewModalOpen(false)} className="border-slate-300 text-slate-700">
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        disabled={submitting} 
                        onClick={() => handleReviewTrader('REJECTED')}
                        className="bg-rose-600 hover:bg-rose-700 text-white"
                      >
                        {submitting ? 'Processing...' : 'Reject Application'}
                      </Button>
                      <Button 
                        type="button" 
                        disabled={submitting} 
                        onClick={() => handleReviewTrader('APPROVED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {submitting ? 'Processing...' : 'Approve Application'}
                      </Button>
                    </DialogFooter>
                  </>
                ) : (
                  <DialogFooter className="pt-2 shrink-0">
                    <Button type="button" variant="outline" onClick={() => setIsReviewModalOpen(false)} className="border-slate-300 text-slate-700">
                      Close
                    </Button>
                  </DialogFooter>
                )}
              </>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
