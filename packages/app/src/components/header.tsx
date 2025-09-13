'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Coins, TrendingUp, Calendar } from 'lucide-react';
import { useLatestDataDate } from '@/hooks/useLatestDataDate';

export function Header() {
  const pathname = usePathname();
  const { data: latestDataDate, loading: dateLoading, error: dateError } = useLatestDataDate();
  
  console.log('Header latestDataDate:', { latestDataDate, dateLoading, dateError });

  const navItems = [
    {
      href: '/',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Overview & Analytics'
    },
    {
      href: '/stablecoins',
      label: 'All Stablecoins',
      icon: Coins,
      description: 'Browse & Compare'
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800/50 bg-neutral-950/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="group flex items-center gap-3 transition-all duration-200 hover:scale-105">
            <div className="relative">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-0.5">
                <div className="h-full w-full rounded-lg bg-neutral-950 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                </div>
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                StableView
              </span>
              <span className="text-xs text-neutral-400 font-medium -mt-1">
                Solana Stablecoins
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-neutral-800/50 text-white'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800/30'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-neutral-400 group-hover:text-blue-400'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:flex items-center gap-1.5 bg-neutral-800/50 text-neutral-300 border-neutral-700/50">
              <Calendar className="h-3 w-3" />
              <span className="text-xs font-medium">
                {dateLoading ? 'Loading...' : latestDataDate?.formattedDate || 'No data'}
              </span>
            </Badge>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-neutral-800/50 py-3">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-neutral-800/50 text-white'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800/30'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-neutral-400 group-hover:text-blue-400'
                  }`} />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-neutral-500">{item.description}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
