'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount, useConnect, useSwitchChain, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { injected } from 'wagmi/connectors';
import { arcTestnet } from 'viem/chains';
import { parseUnits, formatUnits } from 'viem';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { CheckCircle2, AlertCircle, Loader2, Wallet, ExternalLink } from 'lucide-react';
import { ARC_CROSS_PAY_ABI, USDC_ABI, USDC_ADDRESS } from '@/lib/contracts';

// Replace with your deployed contract address from /api/admin/deploy
const CROSS_PAY_ADDRESS = "0xDEPLOYED_CONTRACT_ADDRESS";

interface PaymentRequest {
  id: string;
  amount: string;
  description: string;
  recipient: string;
  status: 'pending' | 'paid';
  txHash?: string;
}

export default function PaymentPage() {
  const { id } = useParams();
  const [payment, setPayment] = useState<PaymentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'approve' | 'pay' | 'verifying' | 'done'>('approve');

  const { address, isConnected, chainId } = useAccount();
  const { connect } = useConnect();
  const { switchChain } = useSwitchChain();

  // USDC balance
const { data: balance } = useReadContract({
  address: USDC_ADDRESS as `0x${string}`,
  abi: erc20Abi,
  functionName: 'balanceOf',
  args: [address],
})
  const { writeContract: writeApprove, data: approveHash, isPending: isApprovePending } = useWriteContract();
  const { isSuccess: isApproveSuccess, isLoading: isApproveConfirming } = useWaitForTransactionReceipt({ hash: approveHash });

  const { writeContract: writePay, data: payHash, isPending: isPayPending } = useWriteContract();
  const { isSuccess: isPaySuccess, isLoading: isPayConfirming } = useWaitForTransactionReceipt({ hash: payHash });

  useEffect(() => {
    if (id) fetchPayment();
  }, [id]);

  useEffect(() => {
    if (isApproveSuccess) setStep('pay');
    if (isPaySuccess) handleVerify(payHash!);
  }, [isApproveSuccess, isPaySuccess]);

  const fetchPayment = async () => {
    try {
      const res = await fetch(`/api/payment/${id}`);
      if (!res.ok) throw new Error('Payment not found');
      const data = await res.json();
      setPayment(data);
      if (data.status === 'paid') setStep('done');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    if (!payment) return;
    writeApprove({
      address: USDC_ADDRESS as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [CROSS_PAY_ADDRESS, parseUnits(payment.amount, 6)],
    });
  };

  const handlePay = () => {
    if (!payment) return;
    writePay({
      address: CROSS_PAY_ADDRESS as `0x${string}`,
      abi: ARC_CROSS_PAY_ABI,
      functionName: 'pay',
      args: [payment.recipient, parseUnits(payment.amount, 6), payment.id],
    });
  };

  const handleVerify = async (hash: string) => {
    setStep('verifying');
    try {
      const res = await fetch(`/api/payment/verify/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash: hash })
      });
      if (res.ok) {
        setStep('done');
        setPayment(prev => prev ? { ...prev, status: 'paid', txHash: hash } : null);
      }
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  if (loading) return <div className="flex items-center justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  if (error || !payment) return <div className="text-center p-20 text-red-600"><AlertCircle className="w-12 h-12 mx-auto mb-4" /> {error || 'Payment not found'}</div>;

  const isArc = chainId === arcTestnet.id;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="text-center text-slate-500 font-normal">Payment Request from {payment.recipient.slice(0, 6)}...{payment.recipient.slice(-4)}</CardTitle>
        </CardHeader>
        <CardContent className="pt-8 pb-10 space-y-6 text-center">
          <div className="space-y-1">
            <h3 className="text-5xl font-extrabold text-slate-900">{payment.amount} <span className="text-2xl font-bold text-slate-400">USDC</span></h3>
            <p className="text-slate-500 text-lg">{payment.description}</p>
          </div>

          {!isConnected ? (
            <Button size="lg" className="w-full h-14 text-lg" onClick={() => connect({ connector: injected() })}>
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet to Pay
            </Button>
          ) : !isArc ? (
            <Button size="lg" variant="outline" className="w-full h-14 text-lg border-red-200 text-red-600 hover:bg-red-50" onClick={() => switchChain({ chainId: arcTestnet.id })}>
              Switch to Arc Testnet
            </Button>
          ) : step === 'done' ? (
            <div className="space-y-4">
              <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center justify-center gap-2 font-semibold">
                <CheckCircle2 className="w-6 h-6" />
                Payment Confirmed
              </div>
              <a 
                href={`https://testnet.arcscan.app/tx/${payment.txHash || payHash}`} 
                target="_blank" 
                className="text-sm text-blue-600 flex items-center justify-center gap-1 hover:underline"
              >
                View on Explorer <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {balance && (
                <p className="text-sm text-slate-500">
                  Your Balance: {formatUnits(balance.value, 6)} USDC
                </p>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  size="lg" 
                  disabled={step !== 'approve' || isApprovePending || isApproveConfirming}
                  onClick={handleApprove}
                  className={step !== 'approve' ? 'opacity-50' : ''}
                >
                  {isApproveConfirming ? 'Approving...' : '1. Approve USDC'}
                </Button>
                <Button 
                  size="lg" 
                  disabled={step !== 'pay' || isPayPending || isPayConfirming}
                  onClick={handlePay}
                  className={step !== 'pay' ? 'opacity-50' : ''}
                >
                  {isPayConfirming ? 'Paying...' : '2. Complete Payment'}
                </Button>
              </div>

              {step === 'verifying' && (
                <p className="text-blue-600 flex items-center justify-center gap-2 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying onchain payment...
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-xs text-slate-400 px-8">
        This transaction is processed on Arc Testnet. USDC is used for both the payment and network gas fees.
      </div>
    </div>
  );
}
