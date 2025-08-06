'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-6 md:py-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:h-16 md:flex-row md:items-center max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-400">StableView</span>
          </Link>
          <Separator orientation="vertical" className="mx-4 hidden h-4 bg-neutral-800 md:block" />
          <p className="text-xs text-neutral-500 md:text-sm">
            © {new Date().getFullYear()} StableView. All rights reserved.
          </p>
        </div>
        <div className="mt-4 flex gap-4 md:ml-auto md:mt-0">
          <Link href="#" className="text-xs text-neutral-500 hover:text-neutral-300 md:text-sm">
            Terms
          </Link>
          <Link href="#" className="text-xs text-neutral-500 hover:text-neutral-300 md:text-sm">
            Privacy
          </Link>
          <Link href="#" className="text-xs text-neutral-500 hover:text-neutral-300 md:text-sm">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
