import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { APIProvider } from '../lib/trpc';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StableView Admin',
  description: 'Admin dashboard for StableView',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <APIProvider>
          <div className="flex min-h-screen">
            {/* Sidebar navigation */}
            <div className="w-64 bg-gray-900 text-white p-4">
              <div className="text-xl font-bold mb-8 p-2">StableView Admin</div>
              <nav>
                <ul className="space-y-2">
                  <li><Link href="/" className="block py-2 px-4 rounded hover:bg-gray-800">Dashboard</Link></li>
                  <li><Link href="/stablecoins" className="block py-2 px-4 rounded hover:bg-gray-800">Stablecoins</Link></li>
                  <li><Link href="/stablecoins/new" className="block py-2 px-4 rounded hover:bg-gray-800">Add Stablecoin</Link></li>
                </ul>
              </nav>
            </div>
            {/* Main content area */}
            <main className="flex-1 bg-gray-50 p-8">
              {children}
            </main>
          </div>
        </APIProvider>
      </body>
    </html>
  );
}
