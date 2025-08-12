'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateStablecoin } from '../../../hooks/useStablecoins';

interface NewStablecoin {
  slug: string;
  name: string;
  token: string;
  peggedAsset: string;
  issuer: string;
  tokenProgram: string;
  tokenAddress: string;
  mintAuthority: string;
  transactionVolume30d: string;
  transactionCountDaily: string;
  totalSupply: string;
  dailyActiveUsers: string;
  price: string;
  executiveSummary?: string;
  logoUrl?: string;
}

export default function NewStablecoinPage() {
  const router = useRouter();
  const { createStablecoin, isSubmitting, error } = useCreateStablecoin();
  const [formData, setFormData] = useState<NewStablecoin>({
    slug: '',
    name: '',
    token: '',
    peggedAsset: 'USD',
    issuer: '',
    tokenProgram: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    tokenAddress: '',
    mintAuthority: '',
    transactionVolume30d: '',
    transactionCountDaily: '',
    totalSupply: '',
    dailyActiveUsers: '',
    price: '1.00',
    executiveSummary: '',
    logoUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createStablecoin(formData);
      router.push('/stablecoins');
    } catch (err) {
      console.error('Error creating stablecoin:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/stablecoins" className="text-blue-600 hover:text-blue-800">
          ← Back to Stablecoins
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Stablecoin</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                id="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., usdc"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., USD Coin"
              />
            </div>

            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                Token Symbol
              </label>
              <input
                type="text"
                name="token"
                id="token"
                required
                value={formData.token}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., USDC"
              />
            </div>

            <div>
              <label htmlFor="peggedAsset" className="block text-sm font-medium text-gray-700">
                Pegged Asset
              </label>
              <input
                type="text"
                name="peggedAsset"
                id="peggedAsset"
                required
                value={formData.peggedAsset}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., USD"
              />
            </div>

            <div>
              <label htmlFor="issuer" className="block text-sm font-medium text-gray-700">
                Issuer
              </label>
              <input
                type="text"
                name="issuer"
                id="issuer"
                required
                value={formData.issuer}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Circle"
              />
            </div>

            <div>
              <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-700">
                Token Address
              </label>
              <input
                type="text"
                name="tokenAddress"
                id="tokenAddress"
                required
                value={formData.tokenAddress}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
              />
            </div>

            <div>
              <label htmlFor="mintAuthority" className="block text-sm font-medium text-gray-700">
                Mint Authority
              </label>
              <input
                type="text"
                name="mintAuthority"
                id="mintAuthority"
                required
                value={formData.mintAuthority}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                id="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="1.00"
              />
            </div>

            <div>
              <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-700">
                Total Supply
              </label>
              <input
                type="text"
                name="totalSupply"
                id="totalSupply"
                required
                value={formData.totalSupply}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 40000000000"
              />
            </div>

            <div>
              <label
                htmlFor="transactionVolume30d"
                className="block text-sm font-medium text-gray-700"
              >
                Transaction Volume (30d)
              </label>
              <input
                type="text"
                name="transactionVolume30d"
                id="transactionVolume30d"
                required
                value={formData.transactionVolume30d}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 50000000000"
              />
            </div>

            <div>
              <label
                htmlFor="transactionCountDaily"
                className="block text-sm font-medium text-gray-700"
              >
                Transaction Count (Daily)
              </label>
              <input
                type="text"
                name="transactionCountDaily"
                id="transactionCountDaily"
                required
                value={formData.transactionCountDaily}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 1000000"
              />
            </div>

            <div>
              <label htmlFor="dailyActiveUsers" className="block text-sm font-medium text-gray-700">
                Daily Active Users
              </label>
              <input
                type="text"
                name="dailyActiveUsers"
                id="dailyActiveUsers"
                required
                value={formData.dailyActiveUsers}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 250000"
              />
            </div>

            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                Logo URL
              </label>
              <input
                type="url"
                name="logoUrl"
                id="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., https://example.com/logo.png"
              />
              {formData.logoUrl && (
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Preview:</span>
                  <div className="flex-shrink-0">
                    <img
                      src={formData.logoUrl}
                      alt="Logo preview"
                      className="h-8 w-8 rounded-full object-cover"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="executiveSummary" className="block text-sm font-medium text-gray-700">
                Executive Summary
              </label>
              <textarea
                name="executiveSummary"
                id="executiveSummary"
                rows={3}
                value={formData.executiveSummary}
                onChange={e => setFormData(prev => ({ ...prev, executiveSummary: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Brief description of the stablecoin..."
              />
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <Link
            href="/stablecoins"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Stablecoin'}
          </button>
        </div>
      </form>
    </div>
  );
}
