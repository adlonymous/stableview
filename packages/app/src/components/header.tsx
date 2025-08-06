'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
          <span className="text-lg font-semibold font-mono text-white">StableView</span>
        </Link>
        <Separator orientation="vertical" className="mx-4 h-6 bg-neutral-800" />
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-neutral-300 hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/stablecoins" className="text-neutral-300 hover:text-white transition-colors">
            All Stablecoins
          </Link>
        </nav>
      </div>
    </header>
  );
}
