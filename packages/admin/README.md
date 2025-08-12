# Admin Dashboard

This is the admin dashboard for the StableView platform, built with Next.js and connected to the core Fastify API.

## Features

- View all stablecoins from the database
- View individual stablecoin details
- Create new stablecoins
- Real-time data from the core API
- Fallback to mock data if API is unavailable

## Prerequisites

- Node.js 18+ and pnpm
- Core API running on port 3004
- PostgreSQL database (configured in core package)

## Getting Started

1. **Start the Core API** (from root directory):

   ```bash
   pnpm start:api
   # or for development
   pnpm dev:api
   ```

2. **Start the Admin Dashboard**:

   ```bash
   pnpm dev:admin
   ```

3. **Access the dashboard** at `http://localhost:3003`

## Configuration

The admin dashboard automatically connects to the core API at `http://localhost:3004`. You can override this by setting environment variables:

- `CORE_API_URL` - Core API base URL
- `NEXT_PUBLIC_CORE_API_URL` - Public core API URL (for client-side)

## API Endpoints

The admin dashboard uses the following core API endpoints:

- `GET /api/stablecoins` - List all stablecoins
- `GET /api/stablecoins/:id` - Get stablecoin by ID
- `POST /api/stablecoins` - Create new stablecoin
- `PUT /api/stablecoins/:id` - Update stablecoin
- `DELETE /api/stablecoins/:id` - Delete stablecoin

## Data Schema

The stablecoin data structure matches the core database schema:

```typescript
interface Stablecoin {
  id: number;
  slug: string;
  name: string;
  token: string;
  peggedAsset: string;
  issuer: string;
  tokenProgram: string;
  tokenAddress: string;
  mintAuthority: string;
  transactionVolume30d: string;
  transactionCountDaily: string;
  totalSupply: string;
  dailyActiveUsers: string;
  price: string;
  executiveSummary?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Development

- **Port**: 3003
- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **State Management**: React hooks with custom API client
- **API Client**: Fetch API with timeout and error handling

## Troubleshooting

1. **Core API not responding**: Check if the core API is running on port 3004
2. **Database connection issues**: Verify PostgreSQL is running and configured in core package
3. **CORS issues**: The core API has CORS enabled for all origins in development
4. **Fallback behavior**: If the core API is unavailable, the dashboard will use mock data
