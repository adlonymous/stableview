// Configuration for the admin dashboard
export const config = {
  // Core API configuration
  coreApi: {
    url:
      process.env.CORE_API_URL || process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:3004',
    timeout: 10000, // 10 seconds
  },

  // Admin dashboard configuration
  admin: {
    port: process.env.ADMIN_PORT || 3003,
  },
};

// Validate configuration
if (!config.coreApi.url) {
  console.warn('CORE_API_URL not set, using default: http://localhost:3004');
}
