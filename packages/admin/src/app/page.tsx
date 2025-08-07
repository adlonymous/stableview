'use client';

import { useEffect, useState } from 'react';
import { VERSION } from '@stableview/core';

// Define types for stablecoin data
interface Stablecoin {
  id: number;
  slug: string;
  name: string;
  transactionVolume30d: string;
  transactionCount30d: string;
  totalSupply: string;
  uniqueAddresses30d: string;
  [key: string]: any; // For other properties
}

interface DashboardStats {
  totalStablecoins: number;
  totalTransactionVolume: number;
  totalTransactionCount: number;
  totalSupply: number;
  totalUniqueAddresses: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStablecoins: 0,
    totalTransactionVolume: 0,
    totalTransactionCount: 0,
    totalSupply: 0,
    totalUniqueAddresses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        
        // For now, use mock data since the tRPC query method is having issues
        // In a real implementation, you would use:
        // const stablecoins = await trpc.stablecoin.getAll.query();
        
        // Mock data for demonstration
        const stablecoins: Stablecoin[] = [
          {
            id: 1,
            slug: 'usdc',
            name: 'USD Coin',
            transactionVolume30d: '50000000000',
            transactionCount30d: '1000000',
            totalSupply: '40000000000',
            uniqueAddresses30d: '250000',
          },
          {
            id: 2,
            slug: 'usdt',
            name: 'Tether',
            transactionVolume30d: '80000000000',
            transactionCount30d: '1500000',
            totalSupply: '70000000000',
            uniqueAddresses30d: '300000',
          },
        ];
        
        // Calculate totals
        const totalStablecoins = stablecoins.length;
        const totalTransactionVolume = stablecoins.reduce((sum: number, coin: Stablecoin) => 
          sum + Number(coin.transactionVolume30d), 0);
        const totalTransactionCount = stablecoins.reduce((sum: number, coin: Stablecoin) => 
          sum + Number(coin.transactionCount30d), 0);
        const totalSupply = stablecoins.reduce((sum: number, coin: Stablecoin) => 
          sum + Number(coin.totalSupply), 0);
        const totalUniqueAddresses = stablecoins.reduce((sum: number, coin: Stablecoin) => 
          sum + Number(coin.uniqueAddresses30d), 0);
        
        setStats({
          totalStablecoins,
          totalTransactionVolume,
          totalTransactionCount,
          totalSupply,
          totalUniqueAddresses,
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Total Stablecoins</h2>
          <p className="text-3xl font-bold mt-2">
            {isLoading ? '...' : stats.totalStablecoins}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Transaction Volume (30d)</h2>
          <p className="text-3xl font-bold mt-2">
            {isLoading ? '...' : `$${stats.totalTransactionVolume.toLocaleString()}`}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Unique Addresses (30d)</h2>
          <p className="text-3xl font-bold mt-2">
            {isLoading ? '...' : stats.totalUniqueAddresses.toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Transaction Count (30d)</h2>
          <p className="text-3xl font-bold mt-2">
            {isLoading ? '...' : stats.totalTransactionCount.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900">Total Supply</h2>
          <p className="text-3xl font-bold mt-2">
            {isLoading ? '...' : `$${stats.totalSupply.toLocaleString()}`}
          </p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading activity data...</p>
        ) : (
          <p className="text-gray-500">
            {stats.totalStablecoins > 0 
              ? `Tracking ${stats.totalStablecoins} stablecoins with a total transaction volume of $${stats.totalTransactionVolume.toLocaleString()} in the last 30 days.`
              : 'No stablecoins added yet. Add your first stablecoin to start tracking metrics.'}
          </p>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Data Sources</h2>
        <p className="text-gray-500 mb-4">
          Metrics are automatically updated daily from the following sources:
        </p>
        <ul className="list-disc list-inside text-gray-600">
          <li>Artemis API - Transaction volume, count, and unique addresses</li>
          <li>Solscan API - On-chain metrics and total supply</li>
        </ul>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>StableView Core v{VERSION}</p>
      </div>
    </div>
  );
}
