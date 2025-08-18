# Vercel Deployment Quick Reference

## Quick Start

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Login to Vercel**: `vercel login`
3. **Run deployment script**: `./deploy.sh`

## Manual Deployment Steps

### 1. Deploy Core API

```bash
cd packages/core
vercel
```

### 2. Deploy App (Frontend)

```bash
cd packages/app
vercel
```

### 3. Deploy Admin

```bash
cd packages/admin
vercel
```

## Environment Variables

### Core API Project

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### App & Admin Projects

```
NEXT_PUBLIC_CORE_API_URL=https://your-core-api-url.vercel.app
```

## API Endpoints

After deployment, your Core API will have these endpoints:

- `GET /api/health` - Health check
- `GET /api/stablecoins` - Get all stablecoins
- `POST /api/stablecoins` - Create new stablecoin
- `GET /api/stablecoins/[id]` - Get specific stablecoin
- `PUT /api/stablecoins/[id]` - Update stablecoin
- `DELETE /api/stablecoins/[id]` - Delete stablecoin
- `GET /api/stablecoins/by-currency-peg` - Get stablecoins grouped by currency

## Testing Deployment

```bash
# Test Core API
curl https://your-core-api-url.vercel.app/api/health
curl https://your-core-api-url.vercel.app/api/stablecoins

# Test Frontend
open https://your-app-url.vercel.app

# Test Admin
open https://your-admin-url.vercel.app
```

## Useful Commands

```bash
# List all projects
vercel ls

# View deployment logs
vercel logs

# Redeploy specific project
vercel --prod

# Remove project
vercel remove
```

## Troubleshooting

- **Build fails**: Check build logs in Vercel dashboard
- **API not working**: Verify environment variables are set
- **CORS issues**: Check CORS configuration in core API
- **Database connection**: Verify Supabase credentials
