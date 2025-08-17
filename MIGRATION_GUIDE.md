# Setup Guide: Supabase + Vercel

This guide will help you set up your StableView project with the modern Supabase + Vercel architecture.

## Why This Architecture?

### Benefits of Supabase + Vercel

- **Better Performance**: Vercel's edge network and Supabase's optimized PostgreSQL
- **Cost Effective**: Free tiers for both services
- **Real-time Features**: Supabase provides real-time subscriptions out of the box
- **Better Developer Experience**: Improved tooling and local development
- **Scalability**: Automatic scaling with Vercel's serverless functions

### What You'll Gain

- Real-time database subscriptions
- Better TypeScript support
- Improved local development workflow
- More deployment options
- Better monitoring and analytics

## Pre-Setup Checklist

- [ ] GitHub repository ready
- [ ] Supabase account created
- [ ] Vercel account created
- [ ] Local development environment ready
- [ ] Docker installed (for local Supabase)

## Step 1: Database Setup

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

## Step 2: Environment Variables Setup

### 2.1 Local Development

Create `.env.local` files in each package:

```bash
# packages/core/.env.local
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-key

# packages/app/.env.local
NEXT_PUBLIC_CORE_API_URL=http://localhost:3004
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key

# packages/admin/.env.local
NEXT_PUBLIC_CORE_API_URL=http://localhost:3004
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
```

### 2.2 Production Environment

Set these in your Vercel project settings:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
NEXT_PUBLIC_CORE_API_URL=https://your-api.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

## Step 3: Local Development

### 3.1 Start Supabase Locally

```bash
cd packages/core
./scripts/setup-supabase.sh
```

### 3.2 Run Development Servers

```bash
# Terminal 1: Core API
cd packages/core
pnpm dev:api

# Terminal 2: App Frontend
cd ../app
pnpm dev

# Terminal 3: Admin Frontend
cd ../admin
pnpm dev
```

## Step 4: Deploy to Production

### 4.1 Deploy Core API to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Node.js
   - **Root Directory**: `packages/core`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

5. Set environment variables and deploy

### 4.2 Deploy App Frontend to Vercel

1. Create another Vercel project
2. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `packages/app`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

3. Set environment variables and deploy

### 4.3 Deploy Admin Frontend to Vercel

1. Create another Vercel project
2. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `packages/admin`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

3. Set environment variables and deploy

## Step 5: Testing and Verification

### 5.1 Local Testing

- [ ] Supabase local instance running
- [ ] API server responding
- [ ] Frontend connecting to API
- [ ] Database operations working

### 5.2 Production Testing

- [ ] All Vercel deployments successful
- [ ] Environment variables loaded correctly
- [ ] API endpoints responding
- [ ] Frontend connecting to production API
- [ ] Database operations working in production

## Common Issues and Solutions

### Issue: Database Connection Errors

**Solution**: Verify Supabase credentials and RLS policies

### Issue: CORS Errors

**Solution**: Update CORS configuration in Vercel functions

### Issue: Environment Variables Not Loading

**Solution**: Check Vercel environment variable configuration

### Issue: Build Failures

**Solution**: Verify all dependencies are properly installed

## Post-Setup Tasks

### 1. Performance Optimization

- Monitor Vercel function execution times
- Optimize database queries
- Enable Supabase real-time features

### 2. Security Review

- Review RLS policies
- Verify API key permissions
- Check CORS settings

### 3. Monitoring Setup

- Set up Vercel analytics
- Configure Supabase monitoring
- Set up error tracking

## Support

### Vercel Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Discord](https://discord.gg/vercel)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Supabase Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)

### Community Support

- [GitHub Issues](https://github.com/your-repo/issues)
- [Discord Server](your-discord-link)

## Timeline Estimate

| Phase         | Duration     | Description                                    |
| ------------- | ------------ | ---------------------------------------------- |
| Planning      | 1 day        | Review requirements and plan setup             |
| Setup         | 1-2 days     | Create Supabase project and Vercel deployments |
| Configuration | 1-2 days     | Environment setup and local testing            |
| Deployment    | 1 day        | Deploy to Vercel and verify                    |
| **Total**     | **4-6 days** | Complete setup                                 |

## Success Metrics

- [ ] Supabase project created and configured
- [ ] Local development environment working
- [ ] Successful deployment to Vercel
- [ ] All functionality working correctly
- [ ] Real-time features operational
- [ ] Monitoring and analytics working

## Next Steps After Setup

1. **Explore Supabase Features**
   - Real-time subscriptions
   - Row Level Security
   - Database backups
   - API rate limiting

2. **Optimize Vercel Deployment**
   - Edge functions
   - Image optimization
   - Performance monitoring
   - Analytics

3. **Enhance Your Application**
   - Add real-time updates
   - Implement better caching
   - Add monitoring and alerts
   - Performance optimization

---

**Need Help?** Create an issue in your GitHub repository or reach out to the community for support.
