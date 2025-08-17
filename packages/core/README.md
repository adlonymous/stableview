# @stableview/core

Core package for the StableView application, providing database access, API endpoints, and business logic.

## Features

- **Database Access**: Direct Supabase client for PostgreSQL database operations
- **API Server**: Fastify-based REST API server
- **tRPC Integration**: Type-safe API endpoints with tRPC
- **Stablecoin Management**: CRUD operations for stablecoin data
- **Metrics Updates**: Automated metrics fetching from Artemis API using original client

## Prerequisites

- Node.js 18+
- pnpm package manager
- Supabase project with PostgreSQL database

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
```

## Metrics Updates

Update stablecoin metrics from the Artemis API using the original client implementation:

```bash
# Update all configured stablecoins
pnpm update-metrics

# Update a specific stablecoin
pnpm update-metrics --slug USDC

# List configured stablecoins
pnpm update-metrics --list

# Test Artemis API connection
pnpm update-metrics --test USDC

# Development mode
pnpm update-metrics:dev
```

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

## API Endpoints

The core API provides the following endpoints:

- `GET /api/stablecoins` - List all stablecoins
- `GET /api/stablecoins/:id` - Get stablecoin by ID
- `POST /api/stablecoins` - Create new stablecoin
- `PUT /api/stablecoins/:id` - Update stablecoin
- `DELETE /api/stablecoins/:id` - Delete stablecoin
- `GET /api/stablecoins/by-currency-peg` - Group stablecoins by currency peg
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /health` - Health check

## Architecture

- **Database Layer**: Direct Supabase client with PostgreSQL
- **API Layer**: Fastify server with REST endpoints
- **Business Logic**: tRPC routers for type-safe operations
- **Data Model**: Stablecoin data with snake_case field naming
- **Metrics**: Automated updates from Artemis API using original client

## Building for Production

```bash
pnpm build
```

The built files will be available in the `dist/` directory.
