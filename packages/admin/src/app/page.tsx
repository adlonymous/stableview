import { VERSION } from '@stableview/core';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">StableView Admin Dashboard</h1>
      <p>Core version: {VERSION}</p>
      <p className="text-gray-500">This is a placeholder for the admin dashboard.</p>
    </div>
  );
}
