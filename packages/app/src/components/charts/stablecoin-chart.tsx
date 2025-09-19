'use client';

import { useEffect, useRef, useState } from 'react';
// Dynamic import to avoid SSR issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let createChart: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let LineSeries: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ColorType: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let LineStyle: any;
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Check if we've already refreshed in this session
const hasRefreshedInSession = () => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('stablecoin-chart-refreshed') === 'true';
};

// Mark that we've refreshed in this session
const markRefreshedInSession = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('stablecoin-chart-refreshed', 'true');
};

interface ChartDataPoint {
  time: string;
  value: number;
}

interface StablecoinChartProps {
  supplyData: ChartDataPoint[];
  dauData: ChartDataPoint[];
  title?: string;
  stablecoinName?: string;
  onRangeChange?: (range: string) => void;
  currentRange?: string;
  loading?: boolean;
}

const RANGE_OPTIONS = [
  { value: '1M', label: '1 Month' },
  { value: '1Q', label: '1 Quarter' },
  { value: '1Y', label: '1 Year' },
  { value: 'ALL', label: 'All Time' },
];

const CHART_TYPES = [
  { value: 'supply', label: 'Total Supply' },
  { value: 'dau', label: 'Daily Active Users' },
];

export function StablecoinChart({
  supplyData,
  dauData,
  stablecoinName,
  onRangeChange,
  currentRange = '1M',
  loading = false,
}: StablecoinChartProps) {
  const [chartType, setChartType] = useState<'supply' | 'dau'>('supply');
  const chartContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seriesRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(loading);
  const [isChartReady, setIsChartReady] = useState(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get current data based on chart type
  const currentData = chartType === 'supply' ? supplyData : dauData;
  const currentTitle =
    chartType === 'supply' ? 'Total Supply Over Time' : 'Daily Active Users Over Time';

  // Chart theme matching the dashboard
  const getChartTheme = () => ({
    layout: {
      background: { type: ColorType?.Solid || 0, color: '#0a0a0a' },
      textColor: '#ffffff',
    },
    grid: {
      vertLines: {
        color: '#1a1a1a',
        style: 0, // Solid line
        visible: true,
      },
      horzLines: {
        color: '#1a1a1a',
        style: 0, // Solid line
        visible: true,
      },
    },
    crosshair: {
      mode: 0,
      vertLine: {
        color: '#3b82f6',
        width: 1,
        style: 0,
        labelBackgroundColor: '#1e293b',
      },
      horzLine: {
        color: '#3b82f6',
        width: 1,
        style: 0,
        labelBackgroundColor: '#1e293b',
      },
    },
    rightPriceScale: {
      borderColor: '#2d3748',
      textColor: '#e2e8f0',
      scaleMargins: {
        top: 0.05,
        bottom: 0.05,
      },
      autoScale: true,
      alignLabels: true,
      borderVisible: true,
      entireTextOnly: false,
      ticksVisible: true,
      mode: 1, // Use price scale mode 1 for better formatting
      invertScale: false,
    },
    timeScale: {
      borderColor: '#2d3748',
      textColor: '#e2e8f0',
      timeVisible: true,
      secondsVisible: false,
      rightOffset: 0,
      barSpacing: 6,
      minBarSpacing: 0.5,
      borderVisible: true,
      ticksVisible: true,
      // Disable scrolling
      shiftVisibleRangeOnNewBar: false,
      lockVisibleTimeRangeOnResize: true,
      rightBarStaysOnScroll: false,
      // Disable mouse wheel scrolling
      handleScroll: false,
      handleScale: false,
    },
  });

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const initializeChart = async () => {
      try {
        // Dynamically import the library
        const {
          createChart: createChartFn,
          LineSeries: LineSeriesClass,
          ColorType: ColorTypeEnum,
          LineStyle: LineStyleEnum,
        } = await import('lightweight-charts');

        createChart = createChartFn;
        LineSeries = LineSeriesClass;
        ColorType = ColorTypeEnum;
        LineStyle = LineStyleEnum;

        // Ensure container has proper dimensions with multiple retries
        const container = chartContainerRef.current;
        let retries = 0;
        const maxRetries = 10;

        const waitForContainer = () => {
          if (!container || container.clientWidth === 0 || container.clientHeight === 0) {
            retries++;
            if (retries < maxRetries) {
              setTimeout(waitForContainer, 50);
              return;
            }
          }

          // Force container dimensions
          if (container) {
            container.style.width = '100%';
            container.style.height = '400px';
            container.style.minHeight = '400px';
            container.style.maxHeight = '400px';
          }

          // Wait one more frame to ensure styles are applied
          requestAnimationFrame(() => {
            if (!container) return;
            const finalWidth = container.clientWidth || 800;

            const chart = createChart(container, {
              ...getChartTheme(),
              width: finalWidth,
              height: 400,
              autoSize: false,
              // Disable all mouse interactions for scrolling
              handleScroll: false,
              handleScale: false,
              layout: {
                ...getChartTheme().layout,
                padding: {
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                },
              },
              timeScale: {
                ...getChartTheme().timeScale,
                rightOffset: 0,
                barSpacing: 6,
                minBarSpacing: 0.5,
                // Disable scrolling
                shiftVisibleRangeOnNewBar: false,
                lockVisibleTimeRangeOnResize: true,
                rightBarStaysOnScroll: false,
                handleScroll: false,
                handleScale: false,
              },
            });

            // Set custom price formatter with better spacing
            chart.priceScale('right').applyOptions({
              priceFormat: {
                type: 'custom',
                formatter: (price: number) => {
                  if (price >= 1e9) {
                    return `${(price / 1e9).toFixed(2)}B`;
                  } else if (price >= 1e6) {
                    return `${(price / 1e6).toFixed(2)}M`;
                  } else if (price >= 1e3) {
                    return `${(price / 1e3).toFixed(2)}K`;
                  }
                  return price.toFixed(2);
                },
                minMove: 0.01,
                precision: 2,
              },
              autoScale: true,
              alignLabels: true,
              borderVisible: false,
              entireTextOnly: false,
              ticksVisible: true,
            });

            const series = chart.addSeries(LineSeries, {
              color: chartType === 'supply' ? '#3b82f6' : '#10b981', // Blue for supply, green for DAU
              lineWidth: 3,
              lineStyle: LineStyle.Solid,
              crosshairMarkerVisible: true,
              crosshairMarkerRadius: 8,
              crosshairMarkerBorderColor: '#ffffff',
              crosshairMarkerBackgroundColor: chartType === 'supply' ? '#3b82f6' : '#10b981',
              crosshairMarkerBorderWidth: 2,
              priceLineVisible: false, // Hide price line initially
              lastValueVisible: false, // Hide last value initially
              pointMarkersVisible: false,
              lastPriceAnimation: 0, // Disable animation for better performance
            });

            chartRef.current = chart;
            seriesRef.current = series;

            // Force a final resize and fit after a short delay
            setTimeout(() => {
              if (chartRef.current && chartContainerRef.current) {
                const containerWidth = chartContainerRef.current.clientWidth;
                chartRef.current.resize(containerWidth, 400);
                chartRef.current.timeScale().fitContent();
              }
              setIsChartReady(true);
            }, 150);
          });
        };

        waitForContainer();
      } catch (error) {
        // Error initializing chart
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      initializeChart();
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
        setIsChartReady(false);
      }

      // Chart cleanup complete
    };
  }, [chartType]);

  // One-time page refresh effect
  useEffect(() => {
    if (!hasRefreshedInSession()) {
      markRefreshedInSession();
      refreshTimeoutRef.current = setTimeout(() => {
        // Smooth page refresh with a subtle fade
        document.body.style.transition = 'opacity 0.3s ease-out';
        document.body.style.opacity = '0.95';

        setTimeout(() => {
          window.location.reload();
        }, 200);
      }, 1000); // Refresh after 1 second
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.clientWidth;

        // Use resize method for better performance
        chartRef.current.resize(containerWidth, 400);
      }
    };

    // Use ResizeObserver for better performance
    let resizeObserver: ResizeObserver | null = null;

    if (chartContainerRef.current && isChartReady) {
      resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (chartRef.current) {
            const { width } = entry.contentRect;
            chartRef.current.resize(width, 400);
          }
        }
      });

      resizeObserver.observe(chartContainerRef.current);
    }

    // Fallback to window resize
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [isChartReady]);

  // Handle visibility change and intersection observer for proper sizing
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (chartRef.current && chartContainerRef.current && !document.hidden) {
        // Chart becomes visible, ensure proper sizing
        setTimeout(() => {
          if (chartRef.current && chartContainerRef.current) {
            const containerWidth = chartContainerRef.current.clientWidth;
            chartRef.current.resize(containerWidth, 400);
            chartRef.current.timeScale().fitContent();
          }
        }, 100);
      }
    };

    // Intersection observer to handle when chart comes into view
    let intersectionObserver: IntersectionObserver | null = null;

    if (chartContainerRef.current) {
      intersectionObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && chartRef.current && chartContainerRef.current) {
              // Chart is now visible, ensure proper sizing
              setTimeout(() => {
                if (chartRef.current && chartContainerRef.current) {
                  const containerWidth = chartContainerRef.current.clientWidth;
                  chartRef.current.resize(containerWidth, 400);
                  chartRef.current.timeScale().fitContent();
                }
              }, 50);
            }
          });
        },
        { threshold: 0.1 }
      );

      intersectionObserver.observe(chartContainerRef.current);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
    };
  }, []);

  // Update chart data when chart type or data changes
  useEffect(() => {
    if (!isChartReady || !seriesRef.current || !currentData.length) {
      return;
    }

    setIsLoading(true);

    // Transform data for TradingView format - convert date string to timestamp
    const chartData = currentData.map(point => {
      // Convert date string to timestamp (TradingView expects number)
      const date = new Date(point.time);
      const timestamp = Math.floor(date.getTime() / 1000); // Convert to seconds

      return {
        time: timestamp,
        value: point.value,
      };
    });

    try {
      // Update series color based on chart type
      seriesRef.current.applyOptions({
        color: chartType === 'supply' ? '#3b82f6' : '#10b981',
        crosshairMarkerBackgroundColor: chartType === 'supply' ? '#3b82f6' : '#10b981',
      });

      seriesRef.current.setData(chartData);

      // Wait for chart to process data and ensure proper sizing
      setTimeout(() => {
        if (chartRef.current && chartContainerRef.current) {
          // Ensure proper sizing
          const containerWidth = chartContainerRef.current.clientWidth;
          const containerHeight = 400;

          // Force resize multiple times to ensure proper layout
          chartRef.current.resize(containerWidth, containerHeight);

          // Wait a bit more and resize again
          setTimeout(() => {
            if (chartRef.current) {
              chartRef.current.resize(containerWidth, containerHeight);
              chartRef.current.timeScale().fitContent();

              // Enable price line and last value after data is loaded
              seriesRef.current?.applyOptions({
                priceLineVisible: true,
                lastValueVisible: true,
              });
            }
          }, 100);
        }
      }, 300); // Increased timeout for better stability
    } catch (error) {
      // Error setting chart data
    }

    setIsLoading(false);
  }, [currentData, isChartReady, chartType]);

  // Format value for display
  const formatValue = (value: number) => {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  // Get current value (last data point)
  const currentValue = currentData.length > 0 ? currentData[currentData.length - 1].value : 0;

  return (
    <Card className="w-full bg-gradient-to-br from-neutral-900/80 to-neutral-800/60 border-neutral-700/60 shadow-2xl backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white">{currentTitle}</CardTitle>
            {stablecoinName && (
              <p className="text-sm text-neutral-400 mt-1">{stablecoinName} Metrics</p>
            )}
          </div>

          <div className="flex gap-3">
            {/* Chart Type Switcher */}
            <div className="flex gap-1 bg-neutral-800/70 rounded-xl p-1.5 border border-neutral-700/50">
              {CHART_TYPES.map(type => (
                <Button
                  key={type.value}
                  variant={chartType === type.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType(type.value as 'supply' | 'dau')}
                  className={`text-xs px-4 py-2 h-8 font-medium transition-all duration-200 ${
                    chartType === type.value
                      ? type.value === 'supply'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
                        : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-700/60'
                  }`}
                >
                  {type.label}
                </Button>
              ))}
            </div>

            {/* Range Switcher */}
            {onRangeChange && (
              <div className="flex gap-1 bg-neutral-800/70 rounded-xl p-1.5 border border-neutral-700/50">
                {RANGE_OPTIONS.map(option => (
                  <Button
                    key={option.value}
                    variant={currentRange === option.value ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onRangeChange(option.value)}
                    className={`text-xs px-4 py-2 h-8 font-medium transition-all duration-200 ${
                      currentRange === option.value
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-700/60'
                    }`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Current Value Display */}
        {currentData.length > 0 && (
          <div className="flex items-center gap-6 mt-6">
            <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
              <p className="text-3xl font-bold text-white mb-1">{formatValue(currentValue)}</p>
              <p className="text-sm text-neutral-300 font-medium">
                Current {chartType === 'supply' ? 'Supply' : 'Daily Active Users'}
              </p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
              <div className="flex flex-col items-center gap-3 text-white">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Loading chart data...</span>
              </div>
            </div>
          )}

          <div
            ref={chartContainerRef}
            className="w-full h-[400px] rounded-lg overflow-hidden border border-neutral-600/50 bg-neutral-900/30 backdrop-blur-sm"
            style={{
              minHeight: '400px',
              maxHeight: '400px',
              height: '400px',
              width: '100%',
              position: 'relative',
              visibility: currentData.length > 0 ? 'visible' : 'hidden',
              display: 'block',
            }}
          />

          {!isLoading && currentData.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800/50 flex items-center justify-center border border-neutral-700/50">
                  <svg
                    className="w-8 h-8 text-neutral-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-neutral-300 mb-2">No data available</p>
                <p className="text-sm text-neutral-500">Try selecting a different time range</p>
              </div>
            </div>
          )}
        </div>

        {/* Chart Info */}
        {currentData.length > 0 && (
          <div className="mt-6 pt-4 border-t border-neutral-700/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-neutral-400">
                <span className="bg-neutral-800/50 px-3 py-1.5 rounded-lg border border-neutral-700/50">
                  {currentData.length} data points
                </span>
                <span className="text-neutral-500">
                  {currentData[0]?.time} to {currentData[currentData.length - 1]?.time}
                </span>
              </div>
              <div
                className={`px-3 py-1.5 rounded-lg border ${
                  chartType === 'supply'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                }`}
              >
                {chartType === 'supply' ? 'Supply' : 'DAU'} •{' '}
                {RANGE_OPTIONS.find(opt => opt.value === currentRange)?.label}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
