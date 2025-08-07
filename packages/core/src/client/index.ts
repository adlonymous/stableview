import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';
import type { AppRouter } from '../server/router.js';
import superjson from 'superjson';

/**
 * Configuration options for creating a tRPC client
 */
interface CreateClientOptions {
  /**
   * URL for the tRPC API endpoint
   * @example 'http://localhost:3001/api/trpc'
   */
  url: string;
  
  /**
   * Optional request headers
   */
  headers?: Record<string, string>;
  
  /**
   * Optional transformer for serialization
   * Default: superjson
   */
  transformer?: any;
}

/**
 * Creates a tRPC client for use in browser or Node.js environments
 */
export function createClient(options: CreateClientOptions) {
  const { url, headers = {}, transformer = superjson } = options;
  
  return createTRPCProxyClient<AppRouter>({
    transformer,
    links: [
      loggerLink({
        enabled: (opts) => 
          process.env.NODE_ENV === 'development' || 
          (opts.direction === 'down' && opts.result instanceof Error),
      }),
      httpBatchLink({
        url,
        headers() {
          return {
            ...headers,
          };
        },
      }),
    ],
  });
}

/**
 * Creates a tRPC client with authentication token
 */
export function createAuthenticatedClient(options: CreateClientOptions & { token: string }) {
  const { token, ...rest } = options;
  
  return createClient({
    ...rest,
    headers: {
      ...rest.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

// Export types from server
export type { AppRouter } from '../server/router.js'; 