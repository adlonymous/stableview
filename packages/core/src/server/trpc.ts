import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context.js';
import { ZodError } from 'zod';

/**
 * Initialize tRPC backend
 * This is where we configure tRPC and integrate with other libraries
 */
const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Create middleware to check if user is authenticated
 * This is a placeholder for future authentication logic
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  // In a real app, you would check if the user is authenticated
  // For now, we'll just assume they are
  const user = { id: '1', name: 'Admin' };

  return next({
    ctx: {
      // Add authenticated user to context
      user,
    },
  });
});

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure.use(isAuthed); 