import { StablecoinDetail } from '@/components/stablecoin/stablecoin-detail';
import { mockStablecoins } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

interface StablecoinPageProps {
  params: {
    id: string;
  };
}

export default function StablecoinPage({ params }: StablecoinPageProps) {
  const stablecoin = mockStablecoins.find(coin => coin.id === params.id);

  if (!stablecoin) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <StablecoinDetail stablecoin={stablecoin} />
    </div>
  );
}

export function generateStaticParams() {
  return mockStablecoins.map(stablecoin => ({
    id: stablecoin.id,
  }));
}
