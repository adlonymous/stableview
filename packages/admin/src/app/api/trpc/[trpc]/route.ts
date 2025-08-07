import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter, createContextInner } from '@stableview/core';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => {
      // Create context for each request
      return await createContextInner();
    },
  });

export { handler as GET, handler as POST }; 