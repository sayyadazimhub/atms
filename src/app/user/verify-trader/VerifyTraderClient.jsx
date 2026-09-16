'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, UploadCloud } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-lg shadow-lg text-center py-10 px-6">
          <Clock className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-pulse" />
          <CardTitle className="text-2xl mb-2">Application Pending Review</CardTitle>
          <CardDescription className="text-base text-slate-600">
            Your trader verification application has been submitted and is currently under review by our administration team.
            You will receive an email notification once a decision is made.
          </CardDescription>
          <Button 
            variant="outline" 
            className="mt-8" 
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
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Trader Profile</CardTitle>
          <CardDescription>
            Please provide your location and upload proof of your trading business to gain access to the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'REJECTED' && (
            <Alert variant="destructive" className="mb-6 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Application Rejected</AlertTitle>
              <AlertDescription>
                Your previous application was rejected for the following reason:
                <br />
                <strong>{rejectionReason}</strong>
                <br />
                Please correct the information below and resubmit.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State <span className='text-red-500'>*</span></Label>
                <Select value={form.state} onValueChange={(val) => setForm(f => ({ ...f, state: val, district: '' }))} required>
                  <SelectTrigger id="state">
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
                <Label htmlFor="district">District <span className='text-red-500'>*</span></Label>
                <Select value={form.district} onValueChange={(val) => setForm(f => ({ ...f, district: val }))} required disabled={!form.state}>
                  <SelectTrigger id="district">
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
              <Label htmlFor="proof">Upload Trading Proof (PDF, JPG, PNG) <span className='text-red-500'>*</span></Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
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

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Verification'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
