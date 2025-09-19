import { MetadataRoute } from 'next';
import { fetchStablecoinsWithFallback } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://stableview.vercel.app';
  
  try {
    const stablecoins = await fetchStablecoinsWithFallback();
    
    const stablecoinPages = stablecoins.map((stablecoin) => ({
      url: `${baseUrl}/stablecoin/${stablecoin.slug}`,
      lastModified: new Date(stablecoin.updatedAt),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/stablecoins`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      ...stablecoinPages,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return basic sitemap if API fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/stablecoins`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];
  }
}
