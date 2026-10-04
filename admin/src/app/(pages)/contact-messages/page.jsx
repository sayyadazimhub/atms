"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Check, Trash2, Search, ArrowRight, Loader2, RefreshCcw, Eye, MailOpen, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { ConfirmModal } from '@/components/ConfirmModal';
import { PageHeader } from '@/components/PageHeader';

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/contact-messages');
      setMessages(res.data.data);
    } catch (error) {
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/api/admin/contact-messages/${id}/status`, { isRead: !currentStatus });
      toast.success(currentStatus ? 'Marked as unread' : 'Marked as read');
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: !currentStatus } : m));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/contact-messages/${deleteId}`);
      toast.success('Message deleted');
      setMessages(messages.filter(m => m.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete message');
    } finally {
      setDeleting(false);
    }
  };

  const filteredMessages = messages?.filter(
    (msg) =>
      msg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Messages"
        description="Manage and respond to user inquiries."
        icon={Mail}
        actionButton={
          <Button onClick={fetchMessages} variant="outline" size="sm" className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/50 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-600" />
                Inbox ({filteredMessages.length})
              </CardTitle>
              <CardDescription>View and respond to all messages</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 border-slate-200 focus-visible:ring-emerald-500 rounded-lg w-full bg-white"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center p-8 text-slate-500">
              No messages found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="w-[200px] font-semibold text-slate-900">Sender</TableHead>
                    <TableHead className="w-[200px] font-semibold text-slate-900">Subject</TableHead>
                    <TableHead className="font-semibold text-slate-900 min-w-[300px]">Message</TableHead>
                    <TableHead className="w-[150px] font-semibold text-slate-900">Date</TableHead>
                    <TableHead className="w-[120px] font-semibold text-slate-900">Status</TableHead>
                    <TableHead className="w-[150px] font-semibold text-slate-900 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((msg) => (
                    <TableRow key={msg.id} className={`hover:bg-slate-50/80 transition-colors ${!msg.isRead ? 'bg-emerald-50/30' : ''}`}>
                      <TableCell className="align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-slate-100 border border-slate-200 text-emerald-700 font-semibold shadow-sm shrink-0 uppercase">
                            {msg.fullName?.charAt(0) || 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-slate-900 truncate">{msg.fullName}</p>
                            <div className="flex items-center text-xs text-slate-500 mt-0.5 truncate">
                              <Mail className="mr-1 h-3 w-3 text-slate-400 shrink-0" />
                              {msg.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle text-sm text-slate-700 font-medium">{msg.subject}</TableCell>
                      <TableCell className="align-middle text-sm text-slate-600">
                        <div className="max-w-[300px] xl:max-w-[400px]">
                          <p className="whitespace-pre-wrap line-clamp-2 leading-relaxed" title={msg.message}>{msg.message}</p>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center text-sm text-slate-700">
                            {/* <Calendar className="mr-2 h-3.5 w-3.5 text-slate-400 shrink-0" /> */}
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </div>
                          <span className="text-xs text-slate-500">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle">
                        <Badge
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm ${
                            msg.isRead 
                            ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100" 
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {msg.isRead ? 'Read' : 'Unread'}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-middle text-right">
                        <div className="flex justify-end gap-1">
                          <Button onClick={() => setSelectedMessage(msg)} size="icon" variant="ghost" title="View Full Message" className="h-8 w-8 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleToggleStatus(msg.id, msg.isRead)} size="icon" variant="ghost" title={msg.isRead ? "Mark as Unread" : "Mark as Read"} className={`h-8 w-8 ${msg.isRead ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'}`}>
                            {msg.isRead ? <MailOpen className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </Button>
                          <a href={`mailto:${msg.email}?subject=RE: ${msg.subject}`} className="inline-flex items-center justify-center rounded-md hover:bg-slate-100 h-8 w-8 text-slate-600 transition-colors" title="Reply">
                            <ArrowRight className="h-4 w-4" />
                          </a>
                          <Button onClick={() => setDeleteId(msg.id)} size="icon" variant="ghost" title="Delete" className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0 border-b pb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-emerald-600" />
              Message Details
            </DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-slate-500">Sender Name</div>
                  <div className="text-base font-semibold text-slate-900 mt-1">{selectedMessage.fullName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-500">Email Address</div>
                  <div className="text-base font-semibold text-slate-900 mt-1">
                    <a href={`mailto:${selectedMessage.email}`} className="text-emerald-600 hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500">Received</div>
                <div className="text-base text-slate-900 mt-1">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <div className="text-sm font-medium text-slate-500 mb-2">Subject</div>
                <div className="text-lg font-bold text-slate-900">{selectedMessage.subject}</div>
                
                <div className="text-sm font-medium text-slate-500 mt-6 mb-2">Message</div>
                <p className="text-base text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => !deleting && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Message?"
        description="Are you sure you want to permanently delete this contact message? This action cannot be undone."
        confirmText="Delete Message"
        isLoading={deleting}
      />
    </div>
  );
}
