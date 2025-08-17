# @stableview/core

Core package for the StableView application, providing database access, API endpoints, and business logic. This package serves as the central data layer and API server for the entire StableView ecosystem.

## Features

- **Database Access**: Direct Supabase client for PostgreSQL database operations
- **API Server**: Fastify-based REST API server with CORS support
- **tRPC Integration**: Type-safe API endpoints with tRPC for internal communication
- **Stablecoin Management**: Full CRUD operations for stablecoin data
- **Metrics Updates**: Automated metrics fetching from Artemis API
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Modular Architecture**: Clean separation between client, server, and database layers

## Architecture Overview

```
src/
├── client/                  # Browser-safe exports and utilities
├── db/                      # Database layer with Supabase integration
├── server/                  # API server and business logic
│   ├── api.ts              # Fastify server setup
│   ├── context.ts          # tRPC context configuration
│   ├── router.ts           # Main tRPC router
│   └── routers/            # Feature-specific routers
│       └── stablecoin.ts   # Stablecoin CRUD operations
├── scripts/                 # Utility scripts
│   └── update-metrics.ts   # Artemis API metrics updater
└── index.ts                 # Main package entry point
```

## Prerequisites

- Node.js 18+
- pnpm package manager
- Supabase project with PostgreSQL database
- Artemis API access for stablecoin metrics

## Environment Setup

Copy the environment example file and configure your Supabase credentials:

```bash
cp env.example .env
```

Required environment variables:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Core API Configuration
CORE_API_PORT=3004
```

## Installation

```bash
pnpm install
```

## Development

```bash
# Start development server with hot reload
pnpm dev:api

# Build the project
pnpm build

# Start production server
pnpm start

# Watch mode for TypeScript compilation
pnpm dev
```

## API Endpoints

The core API provides the following REST endpoints:

### Stablecoin Management
- `GET /api/stablecoins` - List all stablecoins with pagination
- `GET /api/stablecoins/:id` - Get stablecoin by ID
- `POST /api/stablecoins` - Create new stablecoin
- `PUT /api/stablecoins/:id` - Update stablecoin
- `DELETE /api/stablecoins/:id` - Delete stablecoin

### Analytics & Grouping
- `GET /api/stablecoins/by-currency-peg` - Group stablecoins by currency peg
- `GET /api/dashboard/stats` - Get dashboard statistics

### System
- `GET /health` - Health check endpoint

## tRPC Integration

The package exports tRPC routers for type-safe internal communication:

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@stableview/core/server';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3004/trpc',
    }),
  ],
});
```

## Metrics Updates

Update stablecoin metrics from the Artemis API using the built-in script:

```bash
# Update all configured stablecoins
pnpm update-metrics

# Update a specific stablecoin
pnpm update-metrics --slug USDC

# List configured stablecoins
pnpm update-metrics --list

# Test Artemis API connection
pnpm update-metrics --test USDC

# Development mode with TypeScript
pnpm update-metrics:dev
```

### Artemis API Integration

The script fetches real metrics data from Artemis including:

- **Transaction Volume**: 30-day transfer volume (sum of daily values)
- **Transaction Count**: Daily transaction count (latest non-null value)
- **Total Supply**: Current total supply in USD (latest non-null value)
- **Daily Active Users**: Daily active users count (latest non-null value)

**Artemis API Endpoints Used:**
- `STABLECOIN_TRANSFER_VOLUME` - For 30-day volume calculation
- `STABLECOIN_DAILY_TXNS` - For daily transaction count
- `STABLECOIN_SUPPLY` - For total supply
- `STABLECOIN_DAU` - For daily active users

**Symbol Convention:** USDC → `usdc-sol`, USDT → `usdt-sol`, etc.

## Database Schema

The package works with a PostgreSQL database containing stablecoin data with the following key fields:

- **Basic Info**: id, slug, name, token, peggedAsset, issuer
- **Technical Details**: tokenProgram, tokenAddress, mintAuthority
- **Metrics**: transactionVolume30d, transactionCountDaily, totalSupply, dailyActiveUsers
- **Metadata**: price, executiveSummary, logoUrl, createdAt, updatedAt

## Package Exports

The package provides multiple entry points:

```typescript
// Main package
import { VERSION, isBrowser } from '@stableview/core';

// Database client
import { supabase, createSupabaseClient } from '@stableview/core/client';

// Server functions
import { createTRPCRouter } from '@stableview/core/server';
```

## Building for Production

```bash
pnpm build
```

The built files will be available in the `dist/` directory with the following structure:

```
dist/
├── index.js                 # Main package entry
├── client/                  # Client-side exports
├── server/                  # Server-side exports
└── scripts/                 # Built utility scripts
```

## Development Workflow

1. **Local Development**: Use `pnpm dev:api` for hot reload
2. **Database Changes**: Update schema in Supabase and regenerate types
3. **API Changes**: Modify routers and update tRPC types
4. **Testing**: Use the update-metrics script to test Artemis integration
5. **Building**: Run `pnpm build` before deployment

## Dependencies

### Core Dependencies
- `fastify`: High-performance web framework
- `@supabase/supabase-js`: PostgreSQL client
- `@trpc/server`: Type-safe API framework
- `zod`: Schema validation

### Development Dependencies
- `typescript`: Type safety
- `tsx`: TypeScript execution for development
- `eslint`: Code quality
- `prettier`: Code formatting

## Troubleshooting

1. **Database Connection**: Verify Supabase credentials and network access
2. **Port Conflicts**: Ensure port 3004 is available for the API server
3. **Build Errors**: Check TypeScript compilation with `pnpm type-check`
4. **Artemis API**: Verify API keys and rate limits for metrics updates

## Contributing

When contributing to the core package:

1. Maintain type safety throughout
2. Follow the existing architecture patterns
3. Update tRPC routers for new endpoints
4. Test database operations thoroughly
5. Ensure proper error handling and validation
