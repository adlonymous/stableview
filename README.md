# StableView Monorepo

This is a monorepo for the StableView project, containing the main app, core data layer, and admin dashboard.

## Project Structure

- `packages/app`: The main StableView application (Next.js)
- `packages/core`: Core data layer with caching functionality
- `packages/admin`: Admin dashboard for managing stablecoin data

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/) (v8 or later)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Run the main app
pnpm dev

# Run the admin dashboard
pnpm dev:admin

# Run the core package in watch mode
pnpm dev:core
```

### Building

```bash
# Build all packages
pnpm build
```

### Code Quality

```bash
# Run linting on all packages
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check

# Type checking
pnpm type-check
```

## License

This project is proprietary and confidential.
