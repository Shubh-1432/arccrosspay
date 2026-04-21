# ArcCrossPay: Cross-Border USDC Payment Tool on Arc Testnet

ArcCrossPay is a cross-border USDC payment tool designed for freelancers and SMEs, built on Circle's Arc Testnet. It allows users to create payment requests and share simple payment links with payers.

## Features
- **USDC-Native Gas**: Built on Arc, where USDC is used for both the payment and the transaction fees.
- **Trackable Payments**: Each payment request generates a unique ID tracked via an onchain wrapper contract.
- **Onchain Verification**: The system automatically verifies payments by fetching transaction receipts and decoding events.

## Prerequisites
- Node.js installed
- A Circle Console account (https://console.circle.com/)
- A browser wallet with Arc Testnet support (e.g., MetaMask, Rabby)
- Arc Testnet USDC (Get from https://faucet.circle.com/)

## Setup

1. **Clone and install dependencies**:
   ```bash
   cd arccrosspay
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.local.example` to `.env.local` and fill in your Circle API Key and Entity Secret.
   ```bash
   cp .env.local.example .env.local
   ```

3. **Deploy the Smart Contract**:
   This tool requires an onchain contract to track payments. Use the built-in admin route to deploy it using Circle's Smart Contract Platform:
   ```bash
   # Run the server
   npm run dev
   # In another terminal or browser, call the deploy API
   curl -X POST http://localhost:3000/api/admin/deploy
   ```
   **Note**: Copy the `contractAddress` from the response and update `CROSS_PAY_ADDRESS` in `app/pay/[id]/page.tsx`.

4. **Fund your Deployer Wallet**:
   The `api/admin/deploy` response will provide a `deployerWallet` address. Fund this address with Arc Testnet USDC from the faucet to pay for contract deployment.

## Usage

1. **Freelancer**: Visit `/` to create a new payment request.
2. **Share**: Copy the generated link and send it to the payer.
3. **Payer**: Open the link, connect wallet, and complete the 2-step process (Approve & Pay).
4. **Verified**: The system will automatically verify the transaction onchain and update the status to "Paid".

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS, Lucide icons
- **Blockchain**: Arc Testnet (EVM)
- **Web3**: viem, wagmi, TanStack Query
- **Circle SDKs**: Smart Contract Platform, Developer-Controlled Wallets
