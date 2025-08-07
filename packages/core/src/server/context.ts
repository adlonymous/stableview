import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { createDb } from '../db/index.js';

/**
 * Creates context for tRPC procedures
 * This can be used with any HTTP adapter (Express, Fastify, etc.)
 */
interface CreateContextOptions {
  // Add any additional context options here
  // For example, authentication data
}

/**
 * Inner context creation function - used by both HTTP and direct API access
 */
export async function createContextInner(opts: CreateContextOptions = {}) {
  // Create database connection
  const db = createDb();

  return {
    db,
    // Add any additional context properties here
  };
}

/**
 * Context for Express adapter
 */
export async function createExpressContext(
  opts: CreateExpressContextOptions,
): Promise<inferAsyncReturnType<typeof createContextInner>> {
  // For API handlers, we can access the request and response objects
  const { req, res } = opts;

  // You can add authentication logic here
  // const session = await getSession(req);

  return await createContextInner({
    // session,
  });
}

/**
 * Context for Fastify adapter
 */
export async function createFastifyContext(
  opts: CreateFastifyContextOptions,
): Promise<inferAsyncReturnType<typeof createContextInner>> {
  // For API handlers, we can access the request and reply objects
  const { req, res } = opts;

  // You can add authentication logic here
  // const session = await getSession(req);

  return await createContextInner({
    // session,
  });
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