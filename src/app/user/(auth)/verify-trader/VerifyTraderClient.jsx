'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, UploadCloud } from 'lucide-react';
import statesData from '@/lib/states-districts.json';

export default function VerifyTraderClient({ status, rejectionReason, initialState, initialDistrict }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [form, setForm] = useState({
    state: initialState || '',
    district: initialDistrict || '',
    proof: null
  });

  const availableDistricts = statesData.states.find(s => s.state === form.state)?.districts || [];

  useEffect(() => {
    // Check if initialDistrict is valid for initialState, otherwise clear it
    if (form.state && availableDistricts.length > 0) {
      if (form.district && !availableDistricts.includes(form.district)) {
        setForm(f => ({ ...f, district: '' }));
      }
    }
  }, [form.state, availableDistricts, form.district]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.state) {
      toast.error('Please select your state');
      return;
    }

    if (!form.district) {
      toast.error('Please select your district');
      return;
    }

    if (!form.proof) {
      toast.error('Please upload a proof document');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('state', form.state);
      formData.append('district', form.district);
      formData.append('proof', form.proof);

      await axios.post('/api/user/verify-trader', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Verification submitted successfully');
      router.refresh(); // Refresh page to get new server status
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit verification');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'PENDING') {
    return (
      <>
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 bg-slate-50 relative py-12">
          <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl border border-slate-200/50 p-8 sm:p-12 animate-in fade-in zoom-in-95 duration-1000 mt-16 lg:mt-0 text-center">
            <Clock className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Application Pending Review
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Your trader verification application has been submitted and is currently under review by our administration team.
              You will receive an email notification once a decision is made.
            </p>
            <Button
              className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm group mt-8"
              onClick={async () => {
                try {
                  await axios.post('/api/user/auth/logout');
                  router.push('/user/login');
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              Log Out
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 bg-slate-50 relative py-12">
        <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-xl border border-slate-200/50 p-8 sm:p-12 animate-in fade-in zoom-in-95 duration-1000 mt-16 lg:mt-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Complete Your Trader Profile
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Please provide your location and upload proof of your trading business to gain access to the platform.
            </p>
          </div>

          {status === 'REJECTED' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-red-200 pb-2.5 mb-2.5">
                <div className="bg-red-100 p-1.5 rounded-lg shrink-0">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-800">Application Rejected</h3>
                  <p className="text-xs text-red-700 mt-0.5">
                    Your request was not approved.
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-red-700">
                  <span className="font-semibold text-red-900">Reason:</span> {rejectionReason}
                </p>
                <p className="text-xs font-medium text-red-600 mt-2.5 italic">
                  Note: Please correct the information below and resubmit
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-slate-700 font-semibold">State <span className='text-red-500'>*</span></Label>
                <Select value={form.state} onValueChange={(val) => setForm(f => ({ ...f, state: val, district: '' }))} required>
                  <SelectTrigger id="state" className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 shadow-sm">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {statesData.states.map((s, idx) => (
                      <SelectItem key={idx} value={s.state}>
                        {s.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district" className="text-slate-700 font-semibold">District <span className='text-red-500'>*</span></Label>
                <Select value={form.district} onValueChange={(val) => setForm(f => ({ ...f, district: val }))} required disabled={!form.state}>
                  <SelectTrigger id="district" className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 shadow-sm">
                    <SelectValue placeholder={form.state ? "Select District" : "Select State First"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {availableDistricts.map((d, idx) => (
                      <SelectItem key={idx} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proof" className="text-slate-700 font-semibold">Upload Trading Proof (PDF, JPG, PNG) <span className='text-red-500'>*</span></Label>
              <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-100:bg-slate-900 transition-colors cursor-pointer">
                <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
                <Input
                  id="proof"
                  type="file"
                  accept=".pdf,image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => setForm(f => ({ ...f, proof: e.target.files[0] }))}
                />
                <Label htmlFor="proof" className="cursor-pointer text-emerald-600 hover:text-emerald-700 font-medium">
                  Click to browse
                </Label>
                {form.proof && (
                  <p className="mt-2 text-sm text-slate-600 font-medium">Selected: {form.proof.name}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">Max size: 5MB</p>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm group mt-4" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Verification'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
