'use client';

import React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fetchStablecoinsByCurrencyPegWithFallback } from '@/lib/api';
import type { CurrencyPegStablecoins } from '@/lib/api';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface WorldMapProps {
  className?: string;
}

interface GeographyData {
  rsmKey: string;
  properties: Record<string, unknown>;
}

// Function to determine shading based on region and available currency pegs
const getRegionShading = (geo: GeographyData, stablecoinData: CurrencyPegStablecoins) => {
  const name = geo.properties?.NAME || geo.properties?.name || '';
  const admin = geo.properties?.ADMIN || geo.properties?.admin || '';

  // US states and territories - maximum shading for USD
  if (admin === 'United States of America' || name === 'United States of America') {
    return stablecoinData.USD ? '#1e40af' : '#1f2937'; // Dark blue if USD exists, dark gray if not
  }

  // European Union member countries - medium shading for EUR
  const euCountries = [
    'Austria',
    'Belgium',
    'Bulgaria',
    'Croatia',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Estonia',
    'Finland',
    'France',
    'Germany',
    'Greece',
    'Hungary',
    'Ireland',
    'Italy',
    'Latvia',
    'Lithuania',
    'Luxembourg',
    'Malta',
    'Netherlands',
    'Poland',
    'Portugal',
    'Romania',
    'Slovakia',
    'Slovenia',
    'Spain',
    'Sweden',
  ];

  if (euCountries.includes(name as string)) {
    return stablecoinData.EUR ? '#3b82f6' : '#1f2937'; // Medium blue if EUR exists, dark gray if not
  }

  // All other regions - no shading
  return '#1f2937'; // Dark gray (same as background)
};

// Function to get region type and currency for tooltip
const getRegionInfo = (
  geo: GeographyData,
  stablecoinData: CurrencyPegStablecoins
): { type: string; currency: string; hasStablecoins: boolean } => {
  const name = geo.properties?.NAME || geo.properties?.name || '';
  const admin = geo.properties?.ADMIN || geo.properties?.admin || '';

  if (admin === 'United States of America' || name === 'United States of America') {
    return { type: 'us', currency: 'USD', hasStablecoins: !!stablecoinData.USD };
  }

  const euCountries = [
    'Austria',
    'Belgium',
    'Bulgaria',
    'Croatia',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Estonia',
    'Finland',
    'France',
    'Germany',
    'Greece',
    'Hungary',
    'Ireland',
    'Italy',
    'Latvia',
    'Lithuania',
    'Luxembourg',
    'Malta',
    'Netherlands',
    'Poland',
    'Portugal',
    'Romania',
    'Slovakia',
    'Slovenia',
    'Spain',
    'Sweden',
  ];

  if (euCountries.includes(name as string)) {
    return { type: 'eu', currency: 'EUR', hasStablecoins: !!stablecoinData.EUR };
  }

  return { type: 'other', currency: '', hasStablecoins: false };
};

// Function to get region name for display
const getRegionDisplayName = (type: string): string => {
  switch (type) {
    case 'us':
      return 'United States';
    case 'eu':
      return 'European Union';
    default:
      return 'Other Region';
  }
};

export function WorldMap({ className }: WorldMapProps) {
  const [stablecoinData, setStablecoinData] = React.useState<CurrencyPegStablecoins>({});

  // Fetch stablecoin data on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🌍 WorldMap: Starting to fetch stablecoin data...');
        console.log(
          '🌍 WorldMap: API URL will be:',
          process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:3004'
        );

        const data = await fetchStablecoinsByCurrencyPegWithFallback();
        console.log('🌍 WorldMap: Received stablecoin data:', data);
        console.log('🌍 WorldMap: Data keys:', Object.keys(data));
        console.log('🌍 WorldMap: USD stablecoins count:', data.USD?.length || 0);
        console.log('🌍 WorldMap: EUR stablecoins count:', data.EUR?.length || 0);

        setStablecoinData(data);
      } catch (error) {
        console.error('🌍 WorldMap: Failed to fetch stablecoin data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <TooltipProvider>
      <div className={`relative ${className}`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Global Stablecoin Adoption</h3>
          <p className="text-sm text-neutral-400">
            Regional adoption levels based on market activity and regulatory environment. Hover over
            regions to see stablecoins pegged to their currencies.
          </p>
        </div>

        <div className="relative">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 120,
              center: [0, 20],
            }}
            className="w-full h-[400px] rounded-lg border border-neutral-700"
          >
            <ZoomableGroup zoom={1} maxZoom={3}>
              <Geographies geography={geoUrl}>
                {({ geographies }: { geographies: GeographyData[] }) =>
                  geographies.map((geo: GeographyData) => {
                    const regionInfo = getRegionInfo(geo, stablecoinData);
                    const hasStablecoins = regionInfo.hasStablecoins;

                    return (
                      <Tooltip key={geo.rsmKey}>
                        <TooltipTrigger asChild>
                          <Geography
                            geography={geo}
                            fill={getRegionShading(geo, stablecoinData)}
                            stroke="#374151"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: 'none' },
                              hover: {
                                fill: hasStablecoins
                                  ? getRegionShading(geo, stablecoinData) === '#1f2937'
                                    ? '#374151'
                                    : getRegionShading(geo, stablecoinData)
                                  : '#374151',
                                outline: 'none',
                              },
                              pressed: { outline: 'none' },
                            }}
                            className={hasStablecoins ? 'cursor-pointer' : 'cursor-default'}
                          />
                        </TooltipTrigger>
                        {hasStablecoins && (
                          <TooltipContent className="max-w-xs bg-neutral-800 border border-neutral-600 rounded-lg shadow-xl p-3">
                            <div className="max-w-xs">
                              <h4 className="font-semibold text-white mb-2">
                                {regionInfo.currency} Stablecoins (
                                {getRegionDisplayName(regionInfo.type)})
                              </h4>
                              <div className="space-y-1 max-h-32 overflow-y-auto">
                                {stablecoinData[regionInfo.currency]
                                  ?.sort((a, b) => {
                                    const supplyA = parseFloat(a.totalSupply || '0');
                                    const supplyB = parseFloat(b.totalSupply || '0');
                                    return supplyB - supplyA; // Descending order (highest first)
                                  })
                                  .map(stablecoin => (
                                    <div
                                      key={stablecoin.slug}
                                      className="flex justify-between items-center text-xs"
                                    >
                                      <span className="text-neutral-300">{stablecoin.name}</span>
                                      <span className="text-neutral-400 text-right">
                                        {stablecoin.token || stablecoin.slug}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                              <div className="text-xs text-neutral-500 mt-2">
                                {stablecoinData[regionInfo.currency]?.length || 0} stablecoin
                                {(stablecoinData[regionInfo.currency]?.length || 0) !== 1
                                  ? 's'
                                  : ''}
                              </div>
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            {stablecoinData.USD && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[#1e40af] rounded"></div>
                <span className="text-white">USD Stablecoins (US)</span>
              </div>
            )}
            {stablecoinData.EUR && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[#3b82f6] rounded"></div>
                <span className="text-white">EUR Stablecoins (EU)</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#1f2937] rounded border border-neutral-600"></div>
              <span className="text-white">Emerging Markets</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-neutral-500 text-center">
          Chloropleth map showing regional stablecoin adoption levels. Hover over colored regions to
          see stablecoins pegged to their currencies.
        </div>
      </div>
    </TooltipProvider>
  );
}
