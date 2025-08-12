import { router } from './trpc.js';
import { stablecoinRouter } from './routers/stablecoin.js';

/**
 * Main application router
 * Combines all sub-routers
 */
export const appRouter = router({
  stablecoin: stablecoinRouter,
  // Add more routers here as needed
});

// Export type definition of API
export type AppRouter = typeof appRouter;
