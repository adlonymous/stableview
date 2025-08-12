# StableView Core

Core backend services for StableView, providing data access and API functionality.

## Features

- tRPC API for type-safe API calls
- Drizzle ORM for PostgreSQL database access
- Zod for input validation
- ESM modules for modern JavaScript

## Getting Started

### Environment Setup

Create a `.env` file in the `packages/core` directory with the following variables:

```env
# Database connection string
DATABASE_URL=postgres://postgres:postgres@localhost:5432/stableview

# Environment (development, production, test)
NODE_ENV=development

# Optional: API base URL for tRPC client
API_BASE_URL=http://localhost:3000/api/trpc
```

### Development

```bash
# Install dependencies
pnpm install

# Start development mode
pnpm dev

# Run database migrations
pnpm db:push

# Generate migration files
pnpm db:generate

# Open Drizzle Studio
pnpm db:studio
```

## Usage

### Direct Import

```typescript
import { createDb, stablecoins } from '@stableview/core';
import { eq } from 'drizzle-orm';

// Create database connection
const db = createDb();

// Query stablecoins
const allStablecoins = await db.select().from(stablecoins);
const usdcStablecoin = await db
  .select()
  .from(stablecoins)
  .where(eq(stablecoins.slug, 'usdc'))
  .limit(1);
```

### Using tRPC Client

```typescript
import { createClient } from '@stableview/core/client';

// Create tRPC client
const client = createClient({
  url: 'http://localhost:3000/api/trpc',
});

// Query stablecoins
const stablecoins = await client.stablecoin.getAll.query({
  limit: 10,
  offset: 0,
});

// Get a specific stablecoin
const usdc = await client.stablecoin.getBySlug.query('usdc');

// Create a new stablecoin (requires authentication)
const authenticatedClient = createAuthenticatedClient({
  url: 'http://localhost:3000/api/trpc',
  token: 'your-auth-token',
});

const newStablecoin = await authenticatedClient.stablecoin.create.mutate({
  slug: 'usdt',
  name: 'Tether',
  token: 'USDT',
  peggedAsset: 'USD',
  issuer: 'Tether Limited',
  tokenProgram: 'SPL Token',
  tokenAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  mintAuthority: 'Tether Limited',
});
```

### Setting Up HTTP Server

To expose the tRPC API over HTTP, you can use Express or Fastify:

```typescript
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter, createExpressContext } from '@stableview/core/server';

const app = express();

app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: createExpressContext,
  })
);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## Database Schema

The core package includes a Drizzle ORM schema for stablecoins with the following fields:

- Basic info: id, slug, name, token, peggedAsset, issuer, tokenProgram, etc.
- Arrays: bridgingMechanisms, networksLiveOn, redemptionMechanisms
- Links: solscanLink, artemisLink, assetReservesLink
- Quantitative data: marketCap, uniqueAddresses, volumes
- Other: executiveSummary, logoUrl

## API Routes

The tRPC API includes the following routes:

- `stablecoin.getAll`: Get all stablecoins with filtering and pagination
- `stablecoin.getById`: Get a stablecoin by ID
- `stablecoin.getBySlug`: Get a stablecoin by slug
- `stablecoin.create`: Create a new stablecoin (protected)
- `stablecoin.update`: Update an existing stablecoin (protected)
- `stablecoin.delete`: Delete a stablecoin (protected)
