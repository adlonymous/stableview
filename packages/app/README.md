# @stableview/app - Main StableView Application

The main StableView application is a Next.js 15-based dashboard that provides comprehensive analytics and insights for stablecoins on the Solana blockchain. This is the public-facing application that users interact with to explore stablecoin data.

## Features

- **Dashboard Overview**: Real-time statistics including total market cap, unique users, transaction volume, and stablecoin count
- **Stablecoin Discovery**: Browse and search through all available stablecoins with detailed information
- **Individual Stablecoin Pages**: Deep dive into specific stablecoin metrics and performance data
- **World Map Visualization**: Geographic distribution of stablecoin usage across the globe
- **Popular Stablecoins**: Curated list of top-performing stablecoins on the homepage
- **Responsive Design**: Mobile-first design that works across all devices
- **Real-time Data**: Live metrics from the core API with fallback to mock data

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: React hooks with custom API client
- **Data Fetching**: Server-side rendering with fallback mechanisms
- **Type Safety**: Full TypeScript support
- **Maps**: React Simple Maps for geographic visualizations

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── stablecoin/        # Individual stablecoin pages
│   ├── stablecoins/       # Stablecoin listing pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/             # Reusable UI components
│   ├── stablecoin/        # Stablecoin-specific components
│   ├── ui/                # Base UI components (shadcn/ui)
│   ├── footer.tsx         # Footer component
│   └── header.tsx         # Header component
├── lib/                    # Utility functions and configurations
│   ├── api.ts             # API client with fallback logic
│   ├── config.ts          # Application configuration
│   ├── mock-data.ts       # Fallback data when API is unavailable
│   └── utils.ts           # Helper functions
└── types/                  # TypeScript type definitions
    └── stablecoin.ts      # Stablecoin data structure
```

## Key Components

### Stablecoin Components

- **`StablecoinCard`**: Compact display of stablecoin information
- **`StablecoinDetail`**: Comprehensive view of individual stablecoin data
- **`StablecoinFilters`**: Search and filtering capabilities
- **`StablecoinSort`**: Sorting options for stablecoin lists
- **`StatsOverview`**: Dashboard statistics display

### UI Components

- **`WorldMap`**: Interactive world map showing stablecoin usage
- **`Card`**: Reusable card component for content display
- **`Dialog`**: Modal dialogs for detailed information
- **`Progress`**: Progress indicators for loading states
- **`Table`**: Data table for structured information display

## Data Flow

1. **Server-Side Rendering**: Pages fetch data during build time or on-demand
2. **API Integration**: Connects to the core API for real-time data
3. **Fallback System**: Uses mock data when the API is unavailable
4. **Client-Side Updates**: Real-time updates for dynamic content

## API Integration

The app integrates with the core API through the following endpoints:

- **Dashboard Stats**: `/api/stablecoins/by-currency-peg` for overview statistics
- **Stablecoin Lists**: `/api/stablecoins` for comprehensive stablecoin data
- **Individual Data**: `/api/stablecoins/[id]` for specific stablecoin details

## Environment Configuration

Copy the environment example file and configure your settings:

```bash
cp env.example .env.local
```

Required environment variables:

- `CORE_API_URL`: URL of the core API server
- `NEXT_PUBLIC_CORE_API_URL`: Public URL for client-side API calls

## Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linting
yarn lint

# Format code
yarn format

# Type checking
yarn type-check
```

## Port Configuration

- **Development**: Runs on port 3000 by default
- **Production**: Configured via environment variables

## Performance Features

- **Turbopack**: Fast development builds with Next.js 15
- **Server-Side Rendering**: Optimized for SEO and initial page load
- **Image Optimization**: Built-in Next.js image optimization
- **Code Splitting**: Automatic code splitting for optimal bundle sizes

## Browser Support

- Modern browsers with ES6+ support
- Mobile-first responsive design
- Progressive enhancement for older browsers

## Dependencies

### Core Dependencies

- `@stableview/core`: Core data layer and API client
- `next`: React framework for production
- `react`: UI library
- `tailwindcss`: Utility-first CSS framework

### UI Dependencies

- `@radix-ui/*`: Accessible UI primitives
- `lucide-react`: Icon library
- `react-simple-maps`: Geographic visualization
- `shadcn/ui`: Pre-built UI components

## Troubleshooting

1. **API Connection Issues**: Check if the core API is running and accessible
2. **Build Errors**: Ensure all dependencies are properly installed
3. **Styling Issues**: Verify Tailwind CSS is properly configured
4. **Type Errors**: Run `yarn type-check` to identify TypeScript issues

## Contributing

When contributing to the app package:

1. Follow the existing component structure
2. Use TypeScript for all new code
3. Ensure responsive design for mobile devices
4. Test with both real API data and mock data
5. Update types when adding new data structures
