'use client';

// Wallet connect component for HYPEYA mini-app
// Provides seamless wallet connection with OnchainKit

import { useState, useEffect } from 'react';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownLink, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity, EthBalance } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';

export function WalletConnect() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          Loading...
        </Button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2">
        <ConnectWallet className="min-w-[140px]">
          <span className="sr-only">Connect your wallet to access Web3 features</span>
        </ConnectWallet>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Wallet>
        <ConnectWallet>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Avatar className="h-6 w-6" />
            <div className="flex flex-col text-left">
              <Name className="text-sm font-medium" />
              <EthBalance className="text-xs text-gray-500" />
            </div>
          </div>
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownLink
            icon="wallet"
            href="https://wallet.coinbase.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to Wallet
          </WalletDropdownLink>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}

export default WalletConnect;
