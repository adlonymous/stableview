'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStablecoinBySlug } from '../../../hooks/useStablecoins';

export default function StablecoinDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const { stablecoin, isLoading, error, fetchStablecoin } = useStablecoinBySlug(slug || '');

  useEffect(() => {
    async function getParams() {
      const { slug: paramSlug } = await params;
      setSlug(paramSlug);
    }
    getParams();
  }, [params]);

  useEffect(() => {
    if (slug) {
      fetchStablecoin();
    }
  }, [slug, fetchStablecoin]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/stablecoins" className="text-blue-600 hover:text-blue-800">
            ← Back to Stablecoins
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-500">Loading stablecoin...</div>
        </div>
      </div>
    );
  }

  if (error || !stablecoin) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/stablecoins" className="text-blue-600 hover:text-blue-800">
            ← Back to Stablecoins
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Stablecoin not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/stablecoins" className="text-blue-600 hover:text-blue-800">
          ← Back to Stablecoins
        </Link>
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {stablecoin.logoUrl ? (
              <img
                src={stablecoin.logoUrl}
                alt={`${stablecoin.name} logo`}
                className="h-12 w-12 rounded-full object-cover"
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
              className={`h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center ${stablecoin.logoUrl ? 'hidden' : ''}`}
            >
              <span className="text-blue-600 font-medium text-lg">
                {stablecoin.slug.slice(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{stablecoin.name}</h1>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Stablecoin Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Details about {stablecoin.name} ({stablecoin.slug})
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Slug</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {stablecoin.slug}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {stablecoin.name}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Logo URL</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {stablecoin.logoUrl ? (
                  <a
                    href={stablecoin.logoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-all"
                  >
                    {stablecoin.logoUrl}
                  </a>
                ) : (
                  <span className="text-gray-400">No logo URL provided</span>
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Price (USD)</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                ${stablecoin.price}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total Supply</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                ${Number(stablecoin.totalSupply).toLocaleString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Transaction Volume (30d)</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                ${Number(stablecoin.transactionVolume30d).toLocaleString()}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Transaction Count (Daily)</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {Number(stablecoin.transactionCountDaily).toLocaleString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Daily Active Users</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {Number(stablecoin.dailyActiveUsers).toLocaleString()}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {new Date(stablecoin.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {new Date(stablecoin.updatedAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
