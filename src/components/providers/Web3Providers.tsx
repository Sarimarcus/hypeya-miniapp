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
import { useMiniKitAPI } from '@/hooks/useMiniKit';
import { OnchainKitReady } from '@/components/OnchainKitReady';

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
    // Initialize MiniKit API (safe on web and in MiniKit)
    useMiniKitAPI();

    // Always include MiniKitProvider so setFrameReady can be called
    // Nest OnchainKitProvider for standard web features
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <MiniKitProvider
                    apiKey={onchainKitConfig.apiKey}
                    chain={onchainKitConfig.chain}
                    schemaId={onchainKitConfig.schemaId as `0x${string}` | undefined}
                >
                    <OnchainKitProvider
                        apiKey={onchainKitConfig.apiKey}
                        chain={onchainKitConfig.chain}
                        schemaId={onchainKitConfig.schemaId as `0x${string}` | undefined}
                    >
                        <OnchainKitReady />
                        {children}
                    </OnchainKitProvider>
                </MiniKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default Web3Providers;
