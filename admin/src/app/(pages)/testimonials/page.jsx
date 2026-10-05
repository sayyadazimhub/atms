"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2, MessageSquare, Clock, CheckCircle, XCircle, ChevronDown, Eye, Pencil, Plus, Search, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { cn } from '@/lib/utils';
import { ConfirmModal } from '@/components/ConfirmModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', role: '', message: '', image: '' });
  const [addFormData, setAddFormData] = useState({ name: '', role: '', message: '', image: '' });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/testimonials');
      setTestimonials(data);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch = search === '' || 
      t.name?.toLowerCase().includes(search.toLowerCase()) || 
      t.message?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/admin/testimonials/${id}/status`, { status });
      toast.success(`Testimonial ${status.toLowerCase()} successfully`);
      fetchTestimonials();
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/testimonials', addFormData);
      toast.success('Testimonial added successfully');
      setIsAddModalOpen(false);
      setAddFormData({ name: '', role: '', message: '', image: '' });
      fetchTestimonials();
    } catch (error) {
      const errRes = error.response?.data;
      if (errRes?.errors) {
        toast.error(Object.values(errRes.errors)[0]);
      } else if (errRes?.error) {
        toast.error(errRes.error);
      } else {
        toast.error('Failed to add testimonial');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/api/admin/testimonials/${selectedTestimonial.id || selectedTestimonial._id}`, editFormData);
      toast.success('Testimonial updated successfully');
      setIsEditModalOpen(false);
      fetchTestimonials();
    } catch (error) {
      const errRes = error.response?.data;
      if (errRes?.errors) {
        toast.error(Object.values(errRes.errors)[0]);
      } else if (errRes?.error) {
        toast.error(errRes.error);
      } else {
        toast.error('Failed to update testimonial');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await api.delete(`/api/admin/testimonials/${deleteId}`);
      toast.success('Testimonial deleted');
      setDeleteId(null);
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete testimonial');
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
        title="Delete Testimonial?"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
        isLoading={submitting}
      />

      <PageHeader 
        title="Testimonials Management" 
        description="Review and manage user testimonials for the landing page" 
        icon={MessageSquare}
        actionButton={
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
        }
      />

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/50 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">All Testimonials</CardTitle>
              <CardDescription>Approve or reject testimonials submitted by users.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name or message..."
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
                    <DropdownMenuRadioItem value="APPROVED" className="cursor-pointer rounded-lg text-emerald-700 focus:text-emerald-800 focus:bg-emerald-50 font-medium">Approved</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="PENDING" className="cursor-pointer rounded-lg text-amber-700 focus:text-amber-800 focus:bg-amber-50 font-medium">Pending</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="REJECTED" className="cursor-pointer rounded-lg text-rose-700 focus:text-rose-800 focus:bg-rose-50 font-medium">Rejected</DropdownMenuRadioItem>
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
                  <TableHead className="font-semibold text-slate-900 w-[200px]">User Details</TableHead>
                  <TableHead className="font-semibold text-slate-900 w-[400px]">Message</TableHead>
                  <TableHead className="font-semibold text-slate-900">Status</TableHead>
                  <TableHead className="text-right font-semibold text-slate-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse shrink-0" />
                          <div className="space-y-2">
                            <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                            <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2 w-full">
                          <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                          <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
                          <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredTestimonials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                      No testimonials found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTestimonials.map((t) => (
                    <TableRow key={t.id || t._id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {t.image ? (
                            <img src={t.image} alt={t.name} className="h-10 w-10 rounded-full object-cover shrink-0 border border-slate-200 shadow-sm" />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-slate-100 border border-slate-200 text-emerald-700 font-semibold shadow-sm shrink-0">
                              {t.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-slate-900 truncate">{t.name}</p>
                            <p className="text-xs text-slate-500 truncate">{t.role}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-slate-700 line-clamp-2" title={t.message}>
                          {t.message}
                        </p>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="focus:outline-none">
                            <Badge
                              variant="outline"
                              className={cn(
                                "px-2.5 py-1 rounded-full text-xs font-medium shadow-sm border whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity",
                                t.status === 'APPROVED' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                t.status === 'PENDING' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                t.status === 'REJECTED' ? "bg-rose-50 text-rose-700 border-rose-200" :
                                "bg-slate-50 text-slate-700 border-slate-200"
                              )}
                            >
                              {t.status === 'APPROVED' && <CheckCircle className="h-3 w-3 mr-1.5 inline" />}
                              {t.status === 'PENDING' && <Clock className="h-3 w-3 mr-1.5 inline" />}
                              {t.status === 'REJECTED' && <XCircle className="h-3 w-3 mr-1.5 inline" />}
                              {t.status}
                              <ChevronDown className="h-3 w-3 ml-1.5 inline opacity-50" />
                            </Badge>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-40 bg-white">
                            <DropdownMenuItem onClick={() => updateStatus(t.id || t._id, 'PENDING')} className="cursor-pointer font-medium text-amber-700">
                              <Clock className="h-4 w-4 mr-2" /> Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(t.id || t._id, 'APPROVED')} className="cursor-pointer font-medium text-emerald-700">
                              <CheckCircle className="h-4 w-4 mr-2" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(t.id || t._id, 'REJECTED')} className="cursor-pointer font-medium text-rose-700">
                              <XCircle className="h-4 w-4 mr-2" /> Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg" 
                            onClick={() => { setSelectedTestimonial(t); setIsViewModalOpen(true); }}
                            title="View Testimonial"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-500 hover:text-slate-600 hover:bg-slate-100 rounded-lg" 
                            onClick={() => { 
                              setSelectedTestimonial(t); 
                              setEditFormData({ name: t.name, role: t.role, message: t.message, image: t.image || '' });
                              setIsEditModalOpen(true); 
                            }}
                            title="Edit Testimonial"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg" 
                            onClick={() => setDeleteId(t.id || t._id)}
                            title="Delete Testimonial"
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

      {/* Add Testimonial Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Add Testimonial</DialogTitle>
            <DialogDescription>Manually add a new testimonial.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Name</Label>
              <Input 
                id="add-name" 
                value={addFormData.name}
                onChange={e => setAddFormData(d => ({...d, name: e.target.value}))}
                placeholder="E.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-role">Role / Business</Label>
              <Input 
                id="add-role" 
                value={addFormData.role}
                onChange={e => setAddFormData(d => ({...d, role: e.target.value}))}
                placeholder="E.g. Agricultural Trader"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-image">Profile Image</Label>
              {addFormData.image && (
                <div className="mb-2 relative w-16 h-16">
                  <img src={addFormData.image} alt="Profile preview" className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-sm" />
                  <button type="button" onClick={() => setAddFormData(f => ({ ...f, image: '' }))} className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-200 hover:bg-rose-50 text-rose-500">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <input 
                id="add-image" 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                      toast.error('Image must be less than 2MB');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setAddFormData({...addFormData, image: reader.result});
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-shadow focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-message">Message</Label>
              <textarea 
                id="add-message" 
                rows={4}
                className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 resize-none shadow-sm transition-colors"
                value={addFormData.message}
                onChange={e => setAddFormData(d => ({...d, message: e.target.value}))}
                maxLength={300}
                placeholder="How has ATMS helped your business?"
              />
              <div className="text-right text-[11px] font-medium text-slate-400 mt-1">
                {addFormData.message.length}/300
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {submitting ? 'Adding...' : 'Add Testimonial'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Testimonial Dialog */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">View Testimonial</DialogTitle>
          </DialogHeader>
          {selectedTestimonial && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                {selectedTestimonial.image ? (
                  <img src={selectedTestimonial.image} alt={selectedTestimonial.name} className="h-16 w-16 rounded-full object-cover border border-slate-200 shadow-sm" />
                ) : (
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-slate-100 border border-slate-200 text-emerald-700 font-semibold shadow-sm text-xl">
                    {selectedTestimonial.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-slate-900 text-lg">{selectedTestimonial.name}</h4>
                  <p className="text-sm text-slate-500">{selectedTestimonial.role}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                "{selectedTestimonial.message}"
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Testimonial Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Edit Testimonial</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input 
                id="edit-name" 
                value={editFormData.name}
                onChange={e => setEditFormData(d => ({...d, name: e.target.value}))}
                placeholder="E.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role / Business</Label>
              <Input 
                id="edit-role" 
                value={editFormData.role}
                onChange={e => setEditFormData(d => ({...d, role: e.target.value}))}
                placeholder="E.g. Agricultural Trader"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Profile Image</Label>
              {editFormData.image && (
                <div className="mb-2 relative w-16 h-16">
                  <img src={editFormData.image} alt="Profile preview" className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-sm" />
                  <button type="button" onClick={() => setEditFormData(f => ({ ...f, image: '' }))} className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-200 hover:bg-rose-50 text-rose-500">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <input 
                id="edit-image" 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                      toast.error('Image must be less than 2MB');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setEditFormData({...editFormData, image: reader.result});
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-shadow focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-message">Message</Label>
              <textarea 
                id="edit-message" 
                rows={4}
                className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 resize-none shadow-sm transition-colors"
                value={editFormData.message}
                onChange={e => setEditFormData(d => ({...d, message: e.target.value}))}
                maxLength={300}
                placeholder="How has ATMS helped your business?"
              />
              <div className="text-right text-[11px] font-medium text-slate-400 mt-1">
                {editFormData.message.length}/300
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
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
