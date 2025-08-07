'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateStablecoin } from '../../../hooks/useTrpc';

export default function NewStablecoinPage() {
  const router = useRouter();
  const { createStablecoin, isSubmitting, error } = useCreateStablecoin();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const data = {
        slug: formData.get('slug') as string,
        name: formData.get('name') as string,
        token: formData.get('token') as string,
        peggedAsset: formData.get('peggedAsset') as string,
        issuer: formData.get('issuer') as string,
        tokenProgram: formData.get('tokenProgram') as string,
        tokenAddress: formData.get('tokenAddress') as string,
        mintAuthority: formData.get('mintAuthority') as string,
        solscanLink: formData.get('solscanLink') as string || undefined,
        artemisLink: formData.get('artemisLink') as string || undefined,
        assetReservesLink: formData.get('assetReservesLink') as string || undefined,
        executiveSummary: formData.get('executiveSummary') as string || undefined,
        logoUrl: formData.get('logoUrl') as string || undefined,
        marketCap: parseFloat(formData.get('marketCap') as string) || 0,
        uniqueAddresses: parseInt(formData.get('uniqueAddresses') as string) || 0,
        dailyVolume: parseFloat(formData.get('dailyVolume') as string) || 0,
        monthlyVolume: parseFloat(formData.get('monthlyVolume') as string) || 0,
        yearlyVolume: parseFloat(formData.get('yearlyVolume') as string) || 0,
        bridgingMechanisms: formData.get('bridgingMechanisms') ? 
          (formData.get('bridgingMechanisms') as string).split(',').map(s => s.trim()) : 
          [],
        networksLiveOn: formData.get('networksLiveOn') ? 
          (formData.get('networksLiveOn') as string).split(',').map(s => s.trim()) : 
          [],
        redemptionMechanisms: formData.get('redemptionMechanisms') ? 
          (formData.get('redemptionMechanisms') as string).split(',').map(s => s.trim()) : 
          [],
      };
      
      // Use the custom hook to create the stablecoin
      await createStablecoin(data);
      
      // Redirect to stablecoins list
      router.push('/stablecoins');
      router.refresh();
    } catch (err) {
      console.error('Error creating stablecoin:', err);
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Stablecoin</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                  Token Symbol <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="token"
                  name="token"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="peggedAsset" className="block text-sm font-medium text-gray-700">
                  Pegged Asset <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="peggedAsset"
                  name="peggedAsset"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="issuer" className="block text-sm font-medium text-gray-700">
                  Issuer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="issuer"
                  name="issuer"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Technical Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Technical Information</h2>
              
              <div>
                <label htmlFor="tokenProgram" className="block text-sm font-medium text-gray-700">
                  Token Program <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="tokenProgram"
                  name="tokenProgram"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-700">
                  Token Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="tokenAddress"
                  name="tokenAddress"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="mintAuthority" className="block text-sm font-medium text-gray-700">
                  Mint Authority <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="mintAuthority"
                  name="mintAuthority"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="bridgingMechanisms" className="block text-sm font-medium text-gray-700">
                  Bridging Mechanisms (comma separated)
                </label>
                <input
                  type="text"
                  id="bridgingMechanisms"
                  name="bridgingMechanisms"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="networksLiveOn" className="block text-sm font-medium text-gray-700">
                  Networks Live On (comma separated)
                </label>
                <input
                  type="text"
                  id="networksLiveOn"
                  name="networksLiveOn"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="redemptionMechanisms" className="block text-sm font-medium text-gray-700">
                  Redemption Mechanisms (comma separated)
                </label>
                <input
                  type="text"
                  id="redemptionMechanisms"
                  name="redemptionMechanisms"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Links */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="solscanLink" className="block text-sm font-medium text-gray-700">
                  Solscan Link
                </label>
                <input
                  type="url"
                  id="solscanLink"
                  name="solscanLink"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="artemisLink" className="block text-sm font-medium text-gray-700">
                  Artemis Link
                </label>
                <input
                  type="url"
                  id="artemisLink"
                  name="artemisLink"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="assetReservesLink" className="block text-sm font-medium text-gray-700">
                  Asset Reserves Link
                </label>
                <input
                  type="url"
                  id="assetReservesLink"
                  name="assetReservesLink"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Metrics */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Metrics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="marketCap" className="block text-sm font-medium text-gray-700">
                  Market Cap
                </label>
                <input
                  type="number"
                  id="marketCap"
                  name="marketCap"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="uniqueAddresses" className="block text-sm font-medium text-gray-700">
                  Unique Addresses
                </label>
                <input
                  type="number"
                  id="uniqueAddresses"
                  name="uniqueAddresses"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="dailyVolume" className="block text-sm font-medium text-gray-700">
                  Daily Volume
                </label>
                <input
                  type="number"
                  id="dailyVolume"
                  name="dailyVolume"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="monthlyVolume" className="block text-sm font-medium text-gray-700">
                  Monthly Volume
                </label>
                <input
                  type="number"
                  id="monthlyVolume"
                  name="monthlyVolume"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="yearlyVolume" className="block text-sm font-medium text-gray-700">
                  Yearly Volume
                </label>
                <input
                  type="number"
                  id="yearlyVolume"
                  name="yearlyVolume"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Additional Information</h2>
            
            <div>
              <label htmlFor="executiveSummary" className="block text-sm font-medium text-gray-700">
                Executive Summary
              </label>
              <textarea
                id="executiveSummary"
                name="executiveSummary"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                Logo URL
              </label>
              <input
                type="url"
                id="logoUrl"
                name="logoUrl"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-5">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 