# @stableview/admin - Admin Dashboard

The admin dashboard for the StableView platform, built with Next.js 15 and connected to the core Fastify API. This dashboard provides administrative tools for managing stablecoin data, viewing analytics, and maintaining the platform.

## Features

- **Stablecoin Management**: Full CRUD operations for stablecoin data
- **Real-time Data**: Live data from the core API with automatic fallback to mock data
- **Responsive Design**: Mobile-first design that works across all devices
- **Data Visualization**: Clean, organized display of stablecoin information
- **User-friendly Interface**: Intuitive design for administrative tasks
- **Error Handling**: Graceful fallback when core API is unavailable

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS with custom components
- **State Management**: React hooks with custom API client
- **API Integration**: Direct connection to core API
- **Type Safety**: Full TypeScript support

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (if any)
│   ├── stablecoins/       # Stablecoin management pages
│   │   ├── [id]/          # Individual stablecoin editing
│   │   └── new/           # Create new stablecoin
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard homepage
├── hooks/                  # Custom React hooks
│   ├── useStablecoins.ts  # Stablecoin data management
│   └── useTrpc.ts         # tRPC client integration
├── lib/                    # Utility functions and configurations
│   ├── config.ts          # Application configuration
│   └── db.ts              # Database utilities
└── components/             # Reusable UI components
```

## Prerequisites

- Node.js 18+ and pnpm
- Core API running on port 3004
- PostgreSQL database (configured in core package)
- Access to stablecoin data management

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

## API Integration

The admin dashboard uses the following core API endpoints:

### Stablecoin Management

- `GET /api/stablecoins` - List all stablecoins
- `GET /api/stablecoins/:id` - Get stablecoin by ID
- `POST /api/stablecoins` - Create new stablecoin
- `PUT /api/stablecoins/:id` - Update stablecoin
- `DELETE /api/stablecoins/:id` - Delete stablecoin

### Data Flow

1. **API Connection**: Dashboard connects to core API for real-time data
2. **Fallback System**: Uses mock data when API is unavailable
3. **State Management**: React hooks manage stablecoin data state
4. **Real-time Updates**: Automatic refresh of data when changes occur

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

## Key Features

### Dashboard Overview

- **Stablecoin List**: Comprehensive view of all stablecoins
- **Quick Actions**: Create, edit, and delete stablecoins
- **Data Display**: Organized presentation of stablecoin information

### Stablecoin Management

- **Create New**: Add new stablecoins to the system
- **Edit Existing**: Modify stablecoin details and metadata
- **Delete**: Remove stablecoins from the platform
- **View Details**: Comprehensive stablecoin information display

### User Experience

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Intuitive Navigation**: Easy-to-use interface for administrative tasks
- **Error Handling**: Clear feedback for successful operations and errors

## Development

- **Port**: 3003 (configurable)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom components
- **State Management**: React hooks with custom API client
- **API Client**: Direct integration with core API

## Available Scripts

```bash
# Development
pnpm dev              # Start development server on port 3003

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
```

## Port Configuration

The admin dashboard runs on port 3003 by default to avoid conflicts with other services:

- **Main App**: Port 3000
- **Core API**: Port 3004
- **Admin Dashboard**: Port 3003

## Dependencies

### Core Dependencies

- `next`: React framework for production
- `react`: UI library
- `@stableview/core`: Core data layer integration

### Development Dependencies

- `typescript`: Type safety
- `tailwindcss`: Utility-first CSS framework
- `eslint`: Code quality
- `autoprefixer`: CSS vendor prefixing

## Troubleshooting

1. **Core API Connection**:
   - Verify the core API is running on port 3004
   - Check network connectivity and firewall settings
   - Ensure CORS is properly configured in the core API

2. **Database Issues**:
   - Verify PostgreSQL is running and accessible
   - Check Supabase configuration in the core package
   - Ensure proper database permissions

3. **Port Conflicts**:
   - Change the admin dashboard port if 3003 is occupied
   - Update the `dev` script in package.json

4. **Fallback Behavior**:
   - If the core API is unavailable, the dashboard will use mock data
   - Check browser console for connection errors
   - Verify environment variables are correctly set

## Security Considerations

- **Admin Access**: This dashboard should only be accessible to authorized users
- **API Security**: Ensure the core API has proper authentication
- **Data Validation**: All input data is validated before processing
- **Error Handling**: Sensitive information is not exposed in error messages

## Contributing

When contributing to the admin package:

1. **Follow Patterns**: Maintain consistency with existing component structure
2. **Type Safety**: Use TypeScript for all new code
3. **Responsive Design**: Ensure all new features work on mobile devices
4. **Error Handling**: Implement proper error handling and user feedback
5. **Testing**: Test with both real API data and mock data scenarios

## Future Enhancements

Potential improvements for the admin dashboard:

- **User Authentication**: Secure login system for admin access
- **Audit Logging**: Track changes made through the dashboard
- **Bulk Operations**: Mass edit and delete capabilities
- **Advanced Filtering**: Enhanced search and filter options
- **Data Export**: Export stablecoin data in various formats
- **Real-time Notifications**: Alerts for system events and data changes
