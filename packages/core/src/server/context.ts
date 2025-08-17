import { inferAsyncReturnType } from '@trpc/server';

/**
 * Inner context creation function - used by both HTTP and direct API access
 */
export async function createContextInner() {
  return {
    // Add any additional context properties here
  };
}

/**
 * Context for Express adapter
 */
export async function createExpressContext(): Promise<
  inferAsyncReturnType<typeof createContextInner>
> {
  // For API handlers, we can access the request and response objects
  // const { req, res } = opts;

  // You can add authentication logic here
  // const session = await getSession(req);

  return await createContextInner();
}

/**
 * Context for Fastify adapter
 */
export async function createFastifyContext(): Promise<
  inferAsyncReturnType<typeof createContextInner>
> {
  // For API handlers, we can access the request and reply objects
  // const { req, res } = opts;

  // You can add authentication logic here
  // const session = await getSession(req);

  return await createContextInner();
}

/**
 * Context for direct API access (no HTTP)
 */
export async function createDirectContext() {
  return await createContextInner();
}

/**
 * Type helper for context
 */
export type Context = inferAsyncReturnType<typeof createContextInner>;
