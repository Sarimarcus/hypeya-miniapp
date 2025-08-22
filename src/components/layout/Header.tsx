'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';

const WalletConnect = dynamic(
  () => import('@/components/web3').then(mod => ({ default: mod.WalletConnect })),
  {
    ssr: false,
    loading: () => (
      <Button variant="outline" size="sm" disabled className="min-w-[120px]">
        Loading...
      </Button>
    )
  }
);

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/hypeya-logo.png"
                alt="HYPEYA Logo"
                width={120}
                height={48}
                className="h-8 md:h-10 w-auto cursor-pointer"
                priority
              />
            </Link>
          </div>

          {/* Navigation & Wallet */}
          <div className="flex items-center gap-4">
            {/* Navigation Links (optional - can be added later) */}
            <nav className="hidden md:flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-hypeya-600 transition-colors font-content"
              >
                Inicio
              </Link>
              <Link
                href="/search"
                className="text-gray-600 hover:text-hypeya-600 transition-colors font-content"
              >
                Buscar
              </Link>
            </nav>

            {/* Wallet Connect */}
            <div className="flex items-center">
              <WalletConnect />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
