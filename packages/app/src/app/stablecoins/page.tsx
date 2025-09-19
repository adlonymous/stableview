import { StablecoinsClient } from './stablecoins-client';
import { generateStablecoinsListMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generateStablecoinsListMetadata();

export default function StablecoinsPage() {
  return <StablecoinsClient />;
}