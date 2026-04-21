import { NextResponse } from 'next/server';
import { scpClient, walletsClient } from '@/lib/circle';
import { ARC_CROSS_PAY_ABI, ARC_CROSS_PAY_BYTECODE } from '@/lib/contracts';
import crypto from 'node:crypto';

export async function POST() {
  try {
    // 1. Check if we have a wallet set
    const walletSets = await walletsClient.listWalletSets();
    let walletSetId = walletSets.data?.walletSets?.[0]?.id;

    if (!walletSetId) {
      const wsRes = await walletsClient.createWalletSet({ name: "ArcCrossPay Deployer Set" });
      walletSetId = wsRes.data?.walletSet?.id;
    }

    if (!walletSetId) throw new Error("Failed to get wallet set ID");

    // 2. Check for a wallet on ARC-TESTNET
    const wallets = await walletsClient.listWallets({ walletSetId });
    let wallet = wallets.data?.wallets?.find(w => w.blockchain === 'ARC-TESTNET');

    if (!wallet) {
      const wRes = await walletsClient.createWallets({
        walletSetId,
        blockchains: ["ARC-TESTNET"],
        count: 1,
        idempotencyKey: crypto.randomUUID(),
      });
      wallet = wRes.data?.wallets?.[0];
    }

    if (!wallet) throw new Error("Failed to get wallet");

    // 3. Deploy contract
    const deployRes = await scpClient.deployContract({
      name: "ArcCrossPay",
      description: "Payment tool for freelancers on Arc",
      blockchain: "ARC-TESTNET",
      walletId: wallet.id,
      abiJson: JSON.stringify(ARC_CROSS_PAY_ABI),
      bytecode: ARC_CROSS_PAY_BYTECODE,
      idempotencyKey: crypto.randomUUID(),
      fee: {
        type: 'level',
        config: { feeLevel: 'MEDIUM' }
      }
    });

    return NextResponse.json({
      message: "Deployment initiated",
      contractId: deployRes.data?.contractId,
      transactionId: deployRes.data?.transactionId,
      deployerWallet: wallet.address
    });
  } catch (error: any) {
    console.error('Error deploying contract:', error);
    return NextResponse.json({ error: error.message || 'Failed to deploy contract' }, { status: 500 });
  }
}
