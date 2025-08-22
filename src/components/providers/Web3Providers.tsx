'use client';

// Web3 providers for HYPEYA mini-app
// Combines OnchainKit + Wagmi for complete Web3 functionality
// Supports both regular web app and MiniKit environments

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { ReactNode } from 'react';

import { wagmiConfig, onchainKitConfig } from '@/lib/web3';
import { useMiniKit } from '@/hooks/useMiniKit';

// Create a client for React Query (required by Wagmi)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 2,
    },
  },
});

interface Web3ProvidersProps {
  children: ReactNode;
}

export function Web3Providers({ children }: Web3ProvidersProps) {
  const isMiniKit = useMiniKit();

  // If we're in MiniKit environment, use MiniKitProvider
  if (isMiniKit) {
    return (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider
            apiKey={onchainKitConfig.apiKey}
            chain={onchainKitConfig.chain}
            schemaId={onchainKitConfig.schemaId as `0x${string}` | undefined}
          >
            {children}
          </MiniKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    );
  }

  // Otherwise, use regular OnchainKitProvider
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={onchainKitConfig.apiKey}
          chain={onchainKitConfig.chain}
          schemaId={onchainKitConfig.schemaId as `0x${string}` | undefined}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Web3Providers;
