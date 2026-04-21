'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { arcTestnet } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const config = createConfig({
  chains: [arcTestnet],
  transports: {
    [arcTestnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-slate-50">
              <nav className="bg-white border-b border-slate-200 py-4 px-6 mb-8">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                  <h1 className="text-xl font-bold text-blue-600">ArcCrossPay</h1>
                  <p className="text-sm text-slate-500">Cross-border USDC payments on Arc</p>
                </div>
              </nav>
              <main className="max-w-5xl mx-auto px-6 pb-12">
                {children}
              </main>
            </div>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
