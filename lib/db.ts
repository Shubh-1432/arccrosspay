import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'payments.json');

export interface PaymentRequest {
  id: string;
  amount: string; // Human readable USDC amount
  description: string;
  recipient: string;
  status: 'pending' | 'paid';
  createdAt: string;
  txHash?: string;
}

function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
  }
}

export function getAllPayments(): PaymentRequest[] {
  ensureDb();
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

export function getPaymentById(id: string): PaymentRequest | undefined {
  return getAllPayments().find(p => p.id === id);
}

export function savePayment(payment: PaymentRequest) {
  const payments = getAllPayments();
  const index = payments.findIndex(p => p.id === payment.id);
  if (index !== -1) {
    payments[index] = payment;
  } else {
    payments.push(payment);
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(payments, null, 2));
}

export function updatePaymentStatus(id: string, status: 'pending' | 'paid', txHash?: string) {
  const payment = getPaymentById(id);
  if (payment) {
    payment.status = status;
    if (txHash) payment.txHash = txHash;
    savePayment(payment);
  }
}
