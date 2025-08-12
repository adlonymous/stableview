'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to StableView Admin</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/stablecoins" className="block">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium text-gray-900">Stablecoins</h3>
            <p className="mt-2 text-gray-600">View and manage stablecoin data</p>
          </div>
        </Link>
        
        <Link href="/stablecoins/new" className="block">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium text-gray-900">Add Stablecoin</h3>
            <p className="mt-2 text-gray-600">Create a new stablecoin entry</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
