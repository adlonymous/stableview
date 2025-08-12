// Configuration for different environments
export const config = {
  // Core API configuration
  core: {
    // Base URL for the core API
    baseUrl: process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:3004',

    // API endpoints
    endpoints: {
      stablecoins: '/api/stablecoins',
      stablecoin: (id: number) => `/api/stablecoins/${id}`,
      dashboardStats: '/api/dashboard/stats',
    },
  },

  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Ngrok detection (basic)
  isNgrok: typeof window !== 'undefined' && window.location.hostname.includes('ngrok'),

  // Helper function to get full API URL
  getApiUrl: (endpoint: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:3004';
    return endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  },
};

// Log configuration in development
if (typeof window !== 'undefined' && config.isDevelopment) {
  console.log('🔧 App Configuration:', {
    'Core API URL': config.core.baseUrl,
    Environment: process.env.NODE_ENV,
    'Is Ngrok': config.isNgrok,
    'Current Host': window.location.hostname,
  });
}
