import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { savePayment, PaymentRequest } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { amount, description, recipient } = await request.json();

    if (!amount || !recipient) {
      return NextResponse.json({ error: 'Amount and recipient are required' }, { status: 400 });
    }

    const newPayment: PaymentRequest = {
      id: uuidv4(),
      amount,
      description: description || 'USDC Payment',
      recipient,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    savePayment(newPayment);

    return NextResponse.json(newPayment);
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
