import { StablecoinDetail } from '@/components/stablecoin/stablecoin-detail';
import { fetchStablecoinByIdWithFallback } from '@/lib/api';
import { notFound } from 'next/navigation';

interface StablecoinPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StablecoinPage({ params }: StablecoinPageProps) {
  const { id } = await params;
  const numericId = Number(id);
  
  try {
    const stablecoin = await fetchStablecoinByIdWithFallback(numericId);
    
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <StablecoinDetail stablecoin={stablecoin} />
      </div>
    );
  } catch (error) {
    console.error(`Failed to load stablecoin ${numericId}:`, error);
    notFound();
  }
}

export async function generateStaticParams() {
  try {
    const { fetchStablecoins } = await import('@/lib/api');
    const stablecoins = await fetchStablecoins();
    return stablecoins.map(stablecoin => ({
      id: stablecoin.id.toString(),
    }));
  } catch (error) {
    console.warn('Failed to generate static params, falling back to mock data:', error);
    const { mockStablecoins } = await import('@/lib/mock-data');
    return mockStablecoins.map(stablecoin => ({
      id: stablecoin.id.toString(),
    }));
  }
}
