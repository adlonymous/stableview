'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function APIProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// API utility functions for data fetching
export const api = {
  // Base URL for API calls
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  
  // Generic fetch wrapper with error handling
  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  },
  
  // GET request
  async get<T>(endpoint: string): Promise<T> {
    console.log(`API GET request to: ${this.baseUrl}/${endpoint}`);
    return this.fetch<T>(endpoint, { method: 'GET' });
  },
  
  // POST request
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // PUT request
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'DELETE' });
  },
}; 