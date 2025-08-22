'use client';

// Tip Creator component for HYPEYA mini-app
// Allows users to tip article authors with crypto

import { useState, useEffect } from 'react';
import { Transaction, TransactionButton, TransactionSponsor, TransactionStatus, TransactionStatusAction, TransactionStatusLabel } from '@coinbase/onchainkit/transaction';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, DollarSign } from 'lucide-react';
import { PAYMENT_CONFIG, TOKENS, mainChain } from '@/lib/web3';

interface TipCreatorProps {
  authorName: string;
  authorAddress?: string; // Author's wallet address
  className?: string;
}

export function TipCreator({ authorName, authorAddress, className }: TipCreatorProps) {
  const { isConnected } = useAccount();
  const [selectedAmount, setSelectedAmount] = useState('1');
  const [showTipOptions, setShowTipOptions] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button variant="outline" size="sm" disabled className="px-2 py-1 text-xs h-6">
          <Heart className="w-3 h-3 mr-1" />
          Loading...
        </Button>
      </div>
    );
  }

  // If no author address, show placeholder
  if (!authorAddress) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          disabled
          className="text-gray-500 px-2 py-1 text-xs h-6"
        >
          <Heart className="w-3 h-3 mr-1" />
          Tip
        </Button>
        <Badge variant="secondary" className="text-xs">
          Coming Soon
        </Badge>
      </div>
    );
  }

  // If wallet not connected, show connect prompt
  if (!isConnected) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowTipOptions(!showTipOptions);
          }}
          className="px-2 py-1 text-xs h-6"
        >
          <Heart className="w-3 h-3 mr-1" />
          Tip
        </Button>
        {showTipOptions && (
          <Badge variant="secondary" className="text-xs">
            Connect wallet to tip
          </Badge>
        )}
      </div>
    );
  }

  const usdcAddress = TOKENS.USDC[mainChain.id];

  // Build transaction calls for tipping
  const calls = [
    {
      to: usdcAddress as `0x${string}`,
      data: `0xa9059cbb${authorAddress.slice(2).padStart(64, '0')}${(parseFloat(selectedAmount) * 1e6).toString(16).padStart(64, '0')}` as `0x${string}`, // ERC20 transfer
      value: BigInt(0),
    },
  ];

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowTipOptions(!showTipOptions);
          }}
          className="px-2 py-1 text-xs h-6"
        >
          <Heart className="w-3 h-3 mr-1" />
          Tip
        </Button>
        {showTipOptions && (
          <Badge variant="default" className="text-xs bg-green-100 text-green-800">
            <DollarSign className="w-3 h-3 mr-1" />
            USDC
          </Badge>
        )}
      </div>

      {showTipOptions && (
        <div
          className="flex flex-col gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {/* Tip amount selection */}
          <div className="flex gap-2 flex-wrap">
            {PAYMENT_CONFIG.tipAmounts.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? "default" : "outline"}
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedAmount(amount);
                }}
                className="text-xs px-2 py-1 h-6"
              >
                ${amount}
              </Button>
            ))}
          </div>

          {/* Transaction component */}
          <Transaction
            calls={calls}
            className="w-full"
            chainId={mainChain.id}
          >
            <TransactionButton
              text={`Tip $${selectedAmount} USDC`}
              className="w-full bg-blue-600 hover:bg-blue-700"
            />
            <TransactionSponsor />
            <TransactionStatus>
              <TransactionStatusLabel />
              <TransactionStatusAction />
            </TransactionStatus>
          </Transaction>

          <p className="text-xs text-gray-500 text-center">
            Apoya a {authorName} por crear gran contenido
          </p>
        </div>
      )}
    </div>
  );
}

export default TipCreator;
