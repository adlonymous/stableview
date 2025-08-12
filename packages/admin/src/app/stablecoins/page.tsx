'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useStablecoins } from '../../hooks/useStablecoins';

export default function StablecoinsPage() {
  const { stablecoins, isLoading, error, fetchStablecoins } = useStablecoins();

  useEffect(() => {
    fetchStablecoins();
  }, [fetchStablecoins]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Stablecoins</h1>
          <Link
            href="/stablecoins/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Stablecoin
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-500">Loading stablecoins...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Stablecoins</h1>
          <Link
            href="/stablecoins/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Stablecoin
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Stablecoins</h1>
        <Link
          href="/stablecoins/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Stablecoin
        </Link>
      </div>

      {stablecoins.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">No stablecoins found</div>
          <Link
            href="/stablecoins/new"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            Add your first stablecoin
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {stablecoins.map(stablecoin => (
              <li key={stablecoin.id}>
                <Link href={`/stablecoins/${stablecoin.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {stablecoin.logoUrl ? (
                            <img
                              src={stablecoin.logoUrl}
                              alt={`${stablecoin.name} logo`}
                              className="h-10 w-10 rounded-full object-cover"
                              onError={e => {
                                // Fallback to placeholder if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className={`h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center ${stablecoin.logoUrl ? 'hidden' : ''}`}
                          >
                            <span className="text-blue-600 font-medium text-sm">
                              {stablecoin.slug.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{stablecoin.name}</div>
                          <div className="text-sm text-gray-500">{stablecoin.slug}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">${stablecoin.price}</div>
                        <div className="text-sm text-gray-500">
                          {stablecoin.token} • ${Number(stablecoin.totalSupply).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
