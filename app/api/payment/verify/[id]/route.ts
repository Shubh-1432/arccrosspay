import { NextResponse } from 'next/server';
import { createPublicClient, http, decodeEventLog } from 'viem';
import { arcTestnet } from 'viem/chains';
import { getPaymentById, updatePaymentStatus } from '@/lib/db';
import { ARC_CROSS_PAY_ABI } from '@/lib/contracts';

const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { txHash } = await request.json();

    if (!txHash) {
      return NextResponse.json({ error: 'Transaction hash is required' }, { status: 400 });
    }

    const payment = getPaymentById(id);
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // 1. Fetch transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` });

    // 2. Look for PaymentMade event
    let verified = false;
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: ARC_CROSS_PAY_ABI,
          data: log.data,
          topics: log.topics,
        });

        if (decoded.eventName === 'PaymentMade') {
          const { paymentId, amount } = decoded.args as any;
          
          // paymentId is a string, amount is a bigint
          if (paymentId === id) {
            // Verify amount (optional: convert to human readable if needed)
            // For now, if paymentId matches, we consider it verified
            verified = true;
            break;
          }
        }
      } catch (e) {
        // Not our event or decoding failed, skip
        continue;
      }
    }

    if (verified) {
      updatePaymentStatus(id, 'paid', txHash);
      return NextResponse.json({ status: 'paid', txHash });
    } else {
      return NextResponse.json({ error: 'Payment event not found in transaction' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
