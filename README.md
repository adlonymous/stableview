# StableView - Solana Stablecoin Analytics Platform

StableView is a comprehensive analytics and monitoring platform for stablecoins built on the Solana blockchain. This platform provides real-time insights into stablecoin performance, transaction metrics, and market dynamics, helping users make informed decisions about stablecoin investments and usage.

## What is StableView?

StableView is designed to be the go-to platform for understanding stablecoin activity on Solana. It aggregates data from multiple sources including on-chain transactions, Artemis API metrics, and provides a unified dashboard for:

- **Real-time stablecoin metrics** (transaction volume, user activity, supply)
- **Comparative analysis** across different stablecoins
- **Geographic distribution** of stablecoin usage
- **Performance tracking** and historical trends
- **Administrative tools** for managing stablecoin data

## Key Features

- 🚀 **Real-time Data**: Live metrics from Solana blockchain and Artemis API
- 📊 **Comprehensive Analytics**: Transaction volume, user counts, supply data
- 🌍 **Global Insights**: World map visualization of stablecoin usage
- 🎯 **Popular Stablecoins**: Curated list of top-performing stablecoins
- 🔧 **Admin Dashboard**: Full CRUD operations for stablecoin management
- 📱 **Responsive Design**: Modern UI built with Next.js and Tailwind CSS
- 🗄️ **Robust Backend**: Fastify API with PostgreSQL database
- 🔒 **Type Safety**: Full TypeScript support with tRPC integration

## Project Architecture

This is a monorepo containing three main packages:

- **`packages/app`**: Main StableView application (Next.js 15) - The public-facing dashboard
- **`packages/core`**: Core data layer with Fastify API, database access, and business logic
- **`packages/admin`**: Administrative dashboard for managing stablecoin data

## Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Fastify, tRPC, PostgreSQL (via Supabase)
- **Data Sources**: Solana blockchain, Artemis API
- **Package Manager**: pnpm with workspace management
- **Language**: TypeScript throughout

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/) (v10.14.0 or later)
- PostgreSQL database (via Supabase)
- Artemis API access for metrics

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd stableview

# Install dependencies
pnpm install
```

### Environment Setup

1. Copy environment files and configure your credentials:

   ```bash
   cp packages/core/env.example packages/core/.env
   cp packages/app/env.example packages/app/.env
   ```

2. Configure your Supabase and Artemis API credentials in the core package

### Development

```bash
# Run the main StableView application
pnpm dev

# Run the admin dashboard
pnpm dev:admin

# Run the core API server
pnpm dev:core

# Run all services concurrently
pnpm dev:all
```

### Building

```bash
# Build all packages
pnpm build

# Build specific packages
pnpm --filter @stableview/core build
pnpm --filter @stableview/app build
pnpm --filter @stableview/admin build
```

## Available Scripts

- **`pnpm dev`** - Start the main app
- **`pnpm dev:admin`** - Start the admin dashboard
- **`pnpm dev:core`** - Start the core API server
- **`pnpm dev:all`** - Start all services concurrently
- **`pnpm build`** - Build all packages
- **`pnpm lint`** - Run linting across all packages
- **`pnpm format`** - Format code with Prettier
- **`pnpm type-check`** - Run TypeScript type checking

## Data Sources & Metrics

StableView integrates with multiple data sources to provide comprehensive stablecoin insights:

- **Solana Blockchain**: Direct on-chain data for transaction details
- **Artemis API**: Real-time metrics including:
  - 30-day transaction volume
  - Daily transaction counts
  - Total supply data
  - Daily active users
- **Internal Database**: Curated stablecoin metadata and summaries

## Contributing

This project uses a monorepo structure with pnpm workspaces. When contributing:

1. Make changes in the appropriate package directory
2. Ensure all packages build successfully
3. Run linting and type checking
4. Test your changes across the full stack

## License

This project is proprietary and confidential.

## Support

For questions or support, please refer to the individual package READMEs or contact the development team.

# StableView Monorepo

A monorepo for the StableView application built with Next.js, Fastify, and TypeScript.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev          # Start the main app
pnpm dev:admin    # Start the admin panel
pnpm dev:core     # Start the core API in watch mode
pnpm dev:api      # Start the core API server
```

## 🏗️ Turborepo Commands

This monorepo uses Turborepo for fast, incremental builds and task orchestration.

### Development
```bash
pnpm dev          # Start the main app in development mode
pnpm dev:admin    # Start the admin panel in development mode
pnpm dev:core     # Start the core package in watch mode
pnpm dev:api      # Start the API server in development mode
```

### Building
```bash
pnpm build        # Build all packages
pnpm start        # Start the main app (requires build first)
pnpm start:api    # Start the API server (requires build first)
```

### Code Quality
```bash
pnpm lint         # Lint all packages
pnpm lint:fix     # Fix linting issues across all packages
pnpm format       # Format code across all packages
pnpm format:check # Check code formatting across all packages
pnpm type-check   # Run TypeScript type checking across all packages
```

### Maintenance
```bash
pnpm clean        # Clean all build outputs and node_modules
pnpm db:generate  # Generate database schemas (placeholder)
pnpm db:push      # Push database changes (placeholder)
```

## 📦 Package Structure

- **`packages/app`** - Main Next.js application
- **`packages/admin`** - Admin panel application
- **`packages/core`** - Core API and shared utilities

## 🔧 Turborepo Features

- **Incremental Builds**: Only rebuilds what changed
- **Task Caching**: Caches build outputs for faster subsequent builds
- **Parallel Execution**: Runs independent tasks in parallel
- **Task Dependencies**: Ensures proper build order across packages

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.
