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

// Currency to country mapping based on database currency pegs
const CURRENCY_COUNTRY_MAP: Record<string, { countries: string[]; color: string; displayName: string }> = {
  USD: {
    countries: ['United States of America', 'United States'],
    color: '#1e40af', // Dark blue
    displayName: 'United States'
  },
  EUR: {
    countries: [
      'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
      'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
      'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg',
      'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
      'Slovenia', 'Spain', 'Sweden',
      // Alternative names that might appear in map data
      'Federal Republic of Germany', 'Deutschland'
    ],
    color: '#3b82f6', // Medium blue
    displayName: 'European Union'
  },
  GBP: {
    countries: ['United Kingdom', 'Great Britain', 'UK'],
    color: '#059669', // Green
    displayName: 'United Kingdom'
  },
  JPY: {
    countries: ['Japan', 'Nippon'],
    color: '#dc2626', // Red
    displayName: 'Japan'
  },
  CHF: {
    countries: ['Switzerland', 'Swiss Confederation', 'Schweiz'],
    color: '#7c3aed', // Purple
    displayName: 'Switzerland'
  },
  BRL: {
    countries: ['Brazil', 'Brasil', 'Federative Republic of Brazil'],
    color: '#ea580c', // Orange
    displayName: 'Brazil'
  },
  TRY: {
    countries: ['Turkey', 'Republic of Turkey', 'Türkiye'],
    color: '#0891b2', // Cyan
    displayName: 'Turkey'
  },
  MXN: {
    countries: ['Mexico', 'United Mexican States', 'México'],
    color: '#be185d', // Pink
    displayName: 'Mexico'
  },
  NGN: {
    countries: ['Nigeria', 'Federal Republic of Nigeria'],
    color: '#65a30d', // Lime
    displayName: 'Nigeria'
  },
  ZAR: {
    countries: ['South Africa', 'Republic of South Africa'],
    color: '#ca8a04', // Yellow
    displayName: 'South Africa'
  }
};

// Function to determine shading based on region and available currency pegs
const getRegionShading = (geo: GeographyData, stablecoinData: CurrencyPegStablecoins) => {
  const name = geo.properties?.NAME || geo.properties?.name || '';
  const admin = geo.properties?.ADMIN || geo.properties?.admin || '';

  // Check each currency to see if this country has stablecoins
  for (const [currency, config] of Object.entries(CURRENCY_COUNTRY_MAP)) {
    if (stablecoinData[currency]) {
      // Check if this specific country matches this currency's countries
      const isMatch = config.countries.some(configCountry => 
        configCountry.toLowerCase() === String(name || '').toLowerCase() || 
        configCountry.toLowerCase() === String(admin || '').toLowerCase()
      );
      
      if (isMatch) {
        // Calculate brightness based on number of stablecoins
        const stablecoinCount = stablecoinData[currency].length;
        const maxCount = Math.max(...Object.values(stablecoinData).map(arr => arr.length));
        
        // Normalize count to 0-1 range, with minimum brightness of 0.3
        const normalizedCount = Math.max(0.3, stablecoinCount / maxCount);
        
        // Convert to HSL and adjust lightness
        const baseHue = 217; // Blue hue
        const baseSaturation = 91; // Blue saturation
        const lightness = Math.round(30 + (normalizedCount * 40)); // Range from 30% to 70% lightness
        
        return `hsl(${baseHue}, ${baseSaturation}%, ${lightness}%)`;
      }
    }
  }

  // No stablecoins for this region
  return '#1f2937'; // Dark gray (same as background)
};

// Function to get region type and currency for tooltip
const getRegionInfo = (
  geo: GeographyData,
  stablecoinData: CurrencyPegStablecoins
): { type: string; currency: string; hasStablecoins: boolean; displayName: string } => {
  const name = geo.properties?.NAME || geo.properties?.name || '';
  const admin = geo.properties?.ADMIN || geo.properties?.admin || '';

  // Check each currency to see if this country has stablecoins
  for (const [currency, config] of Object.entries(CURRENCY_COUNTRY_MAP)) {
    if (stablecoinData[currency]) {
      // Check if this specific country matches this currency's countries
      const isMatch = config.countries.some(configCountry => 
        configCountry.toLowerCase() === String(name || '').toLowerCase() || 
        configCountry.toLowerCase() === String(admin || '').toLowerCase()
      );
      
      if (isMatch) {
        return { 
          type: currency.toLowerCase(), 
          currency, 
          hasStablecoins: true,
          displayName: config.displayName
        };
      }
    }
  }

  return { type: 'other', currency: '', hasStablecoins: false, displayName: 'Other Region' };
};

// Function to get region name for display
const getRegionDisplayName = (type: string, currency: string): string => {
  if (type === 'other') return 'Other Region';
  
  // Find the display name from our currency map
  const config = CURRENCY_COUNTRY_MAP[currency];
  return config ? config.displayName : currency;
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
          <h3 className="text-lg font-semibold text-white mb-2">Global Stablecoin Coverage</h3>
          <p className="text-sm text-neutral-400">
            Countries and regions with stablecoins pegged to their currencies. 
            Brighter blue indicates more stablecoins pegged to that region's currency.
            Hover over regions to explore available stablecoins and their market data.
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
                                  ? (() => {
                                      const regionInfo = getRegionInfo(geo, stablecoinData);
                                      if (regionInfo.hasStablecoins && stablecoinData[regionInfo.currency]) {
                                        const stablecoinCount = stablecoinData[regionInfo.currency].length;
                                        const maxCount = Math.max(...Object.values(stablecoinData).map(arr => arr.length));
                                        const normalizedCount = Math.max(0.3, stablecoinCount / maxCount);
                                        const lightness = Math.round(20 + (normalizedCount * 50)); // Darker on hover
                                        return `hsl(217, 91%, ${lightness}%)`;
                                      }
                                      return '#374151';
                                    })()
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
                                {regionInfo.currency} Stablecoins ({regionInfo.displayName})
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
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: 'hsl(217, 91%, 30%)' }}
              ></div>
              <span className="text-white">Fewer Stablecoins</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: 'hsl(217, 91%, 50%)' }}
              ></div>
              <span className="text-white">More Stablecoins</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: 'hsl(217, 91%, 70%)' }}
              ></div>
              <span className="text-white">Most Stablecoins</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#1f2937] rounded border border-neutral-600"></div>
              <span className="text-white">No Stablecoins</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-neutral-500 text-center">
          Interactive map showing countries with stablecoins pegged to their currencies. 
          Hover over colored regions to see available stablecoins and their details.
        </div>
      </div>
    </TooltipProvider>
  );
}
