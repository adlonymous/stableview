# StableView Deployment Guide: Supabase + Vercel

This guide explains how to deploy the StableView monorepo using **Supabase** for the database and **Vercel** for hosting.

## Architecture Overview

- **Database**: Supabase (PostgreSQL with real-time features)
- **API**: Vercel Serverless Functions (Core package) - connects to Supabase
- **Frontend**: Vercel (App and Admin packages) - only calls the API, no direct database access
- **Authentication**: Supabase Auth (optional, through API)

## Prerequisites

1. **Supabase Account** (https://supabase.com)
2. **Vercel Account** (https://vercel.com)
3. **GitHub Repository** connected to both services

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `stableview`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 1.2 Configure Database

1. **Wait for project setup** (usually 2-3 minutes)
2. Go to **SQL Editor** in your project
3. Run the migration script from `packages/core/supabase/migrations/20241201000000_initial_schema.sql`
4. Verify tables are created in **Table Editor**

### 1.3 Get API Keys

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-ref.supabase.co`)
   - **Anon public key**
   - **Service role key** (keep this secret!)

## Step 2: Deploy Core API to Vercel

### 2.1 Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Node.js
   - **Root Directory**: `packages/core`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

### 2.2 Production Environment

Set these in your Vercel project settings:

**Core API (packages/core):**

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
NODE_ENV=production
```

**App Frontend (packages/app):**

```bash
NEXT_PUBLIC_CORE_API_URL=https://your-api.vercel.app
NODE_ENV=production
```

**Admin Frontend (packages/admin):**

```bash
NEXT_PUBLIC_CORE_API_URL=https://your-api.vercel.app
NODE_ENV=production
```

### 2.3 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Note your API URL (e.g., `https://your-api.vercel.app`)

## Step 3: Deploy App Frontend to Vercel

### 3.1 Create New Project

1. In Vercel Dashboard, click "New Project"
2. Import the same GitHub repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `packages/app`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

### 3.2 Set Environment Variables

```bash
NEXT_PUBLIC_CORE_API_URL=https://your-api.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3.3 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Note your app URL

## Step 4: Deploy Admin Frontend to Vercel

### 4.1 Create New Project

1. In Vercel Dashboard, click "New Project"
2. Import the same GitHub repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `packages/admin`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

### 4.2 Set Environment Variables

```bash
NEXT_PUBLIC_CORE_API_URL=https://your-api.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4.3 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Note your admin URL

## Step 5: Configure CORS

### 5.1 Update Core API CORS

In your core package, ensure CORS is configured to allow your frontend domains:

```typescript
// In packages/core/src/server/api.ts
app.register(cors, {
  origin: ['http://localhost:3000', 'https://your-app.vercel.app', 'https://your-admin.vercel.app'],
  credentials: true,
});
```

### 5.2 Update Supabase RLS Policies

If you need to allow specific domains for authentication, update the RLS policies in Supabase.

## Environment Variables Reference

### Core Package (API)

| Variable                    | Description               | Required | Example                      |
| --------------------------- | ------------------------- | -------- | ---------------------------- |
| `SUPABASE_URL`              | Supabase project URL      | Yes      | `https://abc123.supabase.co` |
| `SUPABASE_ANON_KEY`         | Supabase anonymous key    | Yes      | `eyJhbGciOiJIUzI1NiIs...`    |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes      | `eyJhbGciOiJIUzI1NiIs...`    |
| `NODE_ENV`                  | Environment               | No       | `production`                 |

### App Package (Frontend)

| Variable                   | Description  | Required | Example                  |
| -------------------------- | ------------ | -------- | ------------------------ |
| `NEXT_PUBLIC_CORE_API_URL` | Core API URL | Yes      | `https://api.vercel.app` |

### Admin Package (Admin Frontend)

| Variable                   | Description  | Required | Example                  |
| -------------------------- | ------------ | -------- | ------------------------ |
| `NEXT_PUBLIC_CORE_API_URL` | Core API URL | Yes      | `https://api.vercel.app` |

## Local Development

### 1. Start Supabase Local

```bash
cd packages/core
pnpm supabase:start
```

### 2. Set Local Environment Variables

Create `.env.local` files in each package:

```bash
# packages/core/.env.local (API - connects to Supabase)
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-key

# packages/app/.env.local (Frontend - only calls API)
NEXT_PUBLIC_CORE_API_URL=http://localhost:3004

# packages/admin/.env.local (Admin - only calls API)
NEXT_PUBLIC_CORE_API_URL=http://localhost:3004
```

### 3. Run Development Servers

```bash
# Terminal 1: Core API
cd packages/core
pnpm dev:api

# Terminal 2: App Frontend
cd packages/app
pnpm dev

# Terminal 3: Admin Frontend
cd packages/admin
pnpm dev
```

## Database Management

### Generate Types

```bash
cd packages/core
pnpm db:types
```

### Run Migrations

```bash
cd packages/core
pnpm supabase:db:reset  # Reset local database
pnpm supabase:db:push   # Push schema changes
```

## Monitoring & Analytics

### Vercel Analytics

- Built-in performance monitoring
- Function execution metrics
- Edge network analytics

### Supabase Monitoring

- Database performance
- API usage statistics
- Real-time connection monitoring

## Security Best Practices

1. **Never commit environment variables**
2. **Use Vercel's secret management**
3. **Enable Supabase RLS policies**
4. **Regular security updates**
5. **Monitor API usage and limits**

## Troubleshooting

### Build Failures

- Check Node.js version compatibility
- Verify all dependencies are installed
- Check TypeScript compilation errors

### Database Connection Issues

- Verify Supabase credentials
- Check network connectivity
- Verify RLS policies

### CORS Errors

- Update CORS configuration in core API
- Check frontend URLs in CORS settings
- Verify environment variables

### Vercel Deployment Issues

- Check build logs for errors
- Verify environment variables are set
- Check function timeout settings

## Cost Optimization

### Vercel

- **Hobby Plan**: Free for personal projects
- **Pro Plan**: $20/month for team projects
- **Enterprise**: Custom pricing

### Supabase

- **Free Tier**: 500MB database, 2GB bandwidth
- **Pro Plan**: $25/month for production use
- **Team Plan**: $599/month for larger teams

## Getting Started

If you're new to this setup:

1. **Follow the setup guide** in `MIGRATION_GUIDE.md`
2. **Create Supabase project** and get API keys
3. **Set up local development** environment
4. **Deploy to Vercel** step by step
5. **Test thoroughly** before going live

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Supabase Documentation**: https://supabase.com/docs
- **GitHub Issues**: Report bugs in your repository
- **Community**: Join Vercel and Supabase Discord servers
