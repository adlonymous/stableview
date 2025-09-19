import { StablecoinDetail } from '@/components/stablecoin/stablecoin-detail';
import { fetchStablecoinBySlugWithFallback } from '@/lib/api';
import { generateStablecoinMetadata, generateStablecoinStructuredData } from '@/lib/metadata';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface StablecoinPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: StablecoinPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const stablecoin = await fetchStablecoinBySlugWithFallback(slug);
    return generateStablecoinMetadata(stablecoin);
  } catch (error) {
    console.error(`Failed to generate metadata for stablecoin ${slug}:`, error);
    return {
      title: 'Stablecoin Not Found - StableView',
      description: 'The requested stablecoin could not be found.',
    };
  }
}

export default async function StablecoinPage({ params }: StablecoinPageProps) {
  const { slug } = await params;

  try {
    const stablecoin = await fetchStablecoinBySlugWithFallback(slug);
    const structuredData = generateStablecoinStructuredData(stablecoin);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <StablecoinDetail stablecoin={stablecoin} />
        </div>
      </>
    );
  } catch (error) {
    console.error(`Failed to load stablecoin ${slug}:`, error);
    notFound();
  }
}

export async function generateStaticParams() {
  try {
    const { fetchStablecoins } = await import('@/lib/api');
    const stablecoins = await fetchStablecoins();
    return stablecoins.map(stablecoin => ({
      slug: stablecoin.slug,
    }));
  } catch (error) {
    console.warn('Failed to generate static params, falling back to mock data:', error);
    const { mockStablecoins } = await import('@/lib/mock-data');
    return mockStablecoins.map(stablecoin => ({
      slug: stablecoin.slug,
    }));
  }
}
