'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label } from '@/components/ui';
import { ExternalLink, Copy, CheckCircle2, Clock, Plus } from 'lucide-react';

interface PaymentRequest {
  id: string;
  amount: string;
  description: string;
  recipient: string;
  status: 'pending' | 'paid';
  createdAt: string;
}

export default function FreelancerDashboard() {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    recipient: ''
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    // In a real app, we'd have a GET /api/payments endpoint
    // For now, we'll just show what's created in this session or fetch if implemented
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setPayments([data, ...payments]);
      setFormData({ amount: '', description: '', recipient: '' });
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      setCreating(false);
    }
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/pay/${id}`;
    navigator.clipboard.writeText(url);
    alert('Payment link copied to clipboard!');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Freelancer Dashboard</h2>
          <p className="text-slate-500">Create and manage your USDC payment requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                New Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Your Wallet Address (Arc Testnet)</Label>
                  <Input 
                    id="recipient" 
                    placeholder="0x..." 
                    value={formData.recipient}
                    onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USDC)</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    step="0.000001"
                    placeholder="10.00" 
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Website Design Work" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Payment Link'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h3 className="font-semibold text-slate-700">Recent Requests</h3>
          {payments.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-lg p-12 text-center">
              <p className="text-slate-400">No payment requests yet. Create your first one!</p>
            </div>
          ) : (
            payments.map((p) => (
              <Card key={p.id} className="shadow-sm border-slate-200 overflow-hidden">
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${p.status === 'paid' ? 'bg-green-100' : 'bg-blue-100'}`}>
                      {p.status === 'paid' ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{p.description}</p>
                      <p className="text-2xl font-bold text-slate-900">{p.amount} <span className="text-sm font-normal text-slate-500 uppercase">USDC</span></p>
                      <p className="text-xs text-slate-400 mt-1">Created on {new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyLink(p.id)} className="flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => window.open(`/pay/${p.id}`, '_blank')} className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View
                    </Button>
                  </div>
                </div>
                <div className={`px-4 py-2 text-xs font-medium flex items-center gap-2 ${p.status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-600'}`}>
                  Status: {p.status === 'paid' ? 'Paid' : 'Pending Payment'}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
