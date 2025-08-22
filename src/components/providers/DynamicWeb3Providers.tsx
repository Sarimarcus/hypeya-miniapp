'use client';

// Dynamic Web3 provider wrapper
// Prevents SSR issues with OnchainKit

import { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Web3Providers = dynamic(
  () => import('./Web3Providers').then(mod => ({ default: mod.Web3Providers })),
  {
    ssr: false,
    loading: () => <div>Loading Web3...</div>
  }
);

interface DynamicWeb3ProvidersProps {
  children: ReactNode;
}

export function DynamicWeb3Providers({ children }: DynamicWeb3ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <Web3Providers>
      {children}
    </Web3Providers>
  );
}

export default DynamicWeb3Providers;
