# Quick Start: Supabase + Vercel

Get your StableView project running with Supabase and Vercel in minutes!

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
# Install Supabase CLI globally
npm install -g supabase

# Install project dependencies
pnpm install
```

### 2. Start Local Development

```bash
# Start Supabase locally
cd packages/core
./scripts/setup-supabase.sh

# In another terminal, start the API
pnpm dev:api

# In another terminal, start the frontend
cd ../app
pnpm dev
```

### 3. Deploy to Production

```bash
# Deploy API to Vercel
cd packages/core
vercel --prod

# Deploy frontend to Vercel
cd ../app
vercel --prod
```

## 🔑 Environment Variables

### Local Development (.env.local)

```bash
# packages/core/.env.local (API - connects to Supabase)
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-key

# packages/app/.env.local (Frontend - only calls API)
NEXT_PUBLIC_CORE_API_URL=http://localhost:3004
```

### Production (Vercel)

Set these in your Vercel project settings:

**Core API:**

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
```

**Frontend:**

```bash
NEXT_PUBLIC_CORE_API_URL=https://your-api.vercel.app
```

## 📚 What's New

- **Supabase Database**: PostgreSQL with real-time features
- **Vercel Hosting**: Serverless functions and edge deployment
- **Better Local Dev**: Supabase CLI for local development
- **Type Safety**: Auto-generated TypeScript types
- **Real-time**: Built-in real-time subscriptions

## 🆘 Need Help?

- **Full Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Migration**: See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- **Issues**: Create a GitHub issue
- **Community**: Join our Discord

## 🎯 Next Steps

1. **Explore Supabase Dashboard**: http://localhost:54323
2. **Test Real-time Features**: Enable subscriptions in your app
3. **Deploy to Production**: Use Vercel for hosting
4. **Monitor Performance**: Use Vercel Analytics and Supabase Monitoring

---

**Happy Coding! 🎉**
