# Deploy StableView Monorepo to Vercel

This guide will help you deploy your StableView monorepo to Vercel with Supabase integration.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Project**: Set up your Supabase database
3. **Vercel CLI**: Install with `npm i -g vercel`

## Step 1: Set up Supabase Environment Variables

First, get your Supabase credentials from your Supabase project dashboard:

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following values:
   - Project URL
   - `anon` public key
   - `service_role` secret key

## Step 2: Deploy Core API Package

The core package contains your Fastify API server converted to Vercel serverless functions.

### 2.1 Deploy Core Package

```bash
cd packages/core
vercel
```

When prompted:

- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: `stableview-core-api` (or your preferred name)
- **Directory**: `./` (current directory)
- **Override settings**: No

### 2.2 Configure Environment Variables

After deployment, go to your Vercel dashboard and add these environment variables:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2.3 Get Core API URL

After deployment, note your core API URL (e.g., `https://stableview-core-api.vercel.app`)

## Step 3: Deploy App Package (Frontend)

The app package is your Next.js frontend application.

### 3.1 Deploy App Package

```bash
cd packages/app
vercel
```

When prompted:

- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: `stableview-app` (or your preferred name)
- **Directory**: `./` (current directory)
- **Override settings**: No

### 3.2 Configure Environment Variables

Add this environment variable:

```
NEXT_PUBLIC_CORE_API_URL=https://your-core-api-url.vercel.app
```

Replace `your-core-api-url` with your actual core API URL from step 2.3.

## Step 4: Deploy Admin Package

The admin package is your Next.js admin interface.

### 4.1 Deploy Admin Package

```bash
cd packages/admin
vercel
```

When prompted:

- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: `stableview-admin` (or your preferred name)
- **Directory**: `./` (current directory)
- **Override settings**: No

### 4.2 Configure Environment Variables

Add this environment variable:

```
NEXT_PUBLIC_CORE_API_URL=https://your-core-api-url.vercel.app
```

## Step 5: Verify Deployment

### 5.1 Test Core API

Test your core API endpoints:

```bash
# Health check
curl https://your-core-api-url.vercel.app/api/health

# Get all stablecoins
curl https://your-core-api-url.vercel.app/api/stablecoins

# Get stablecoins by currency peg
curl https://your-core-api-url.vercel.app/api/stablecoins/by-currency-peg
```

### 5.2 Test Frontend

Visit your deployed frontend URL and verify:

- Stablecoin list loads correctly
- Individual stablecoin pages work
- API calls are successful

### 5.3 Test Admin Interface

Visit your deployed admin URL and verify:

- Admin interface loads
- Can create/edit/delete stablecoins
- API integration works

## Step 6: Set up Custom Domains (Optional)

### 6.1 Core API Domain

1. Go to your core API project in Vercel dashboard
2. Navigate to Settings > Domains
3. Add your custom domain (e.g., `api.stableview.com`)
4. Update DNS records as instructed

### 6.2 Frontend Domain

1. Go to your app project in Vercel dashboard
2. Navigate to Settings > Domains
3. Add your custom domain (e.g., `stableview.com`)
4. Update DNS records as instructed

### 6.3 Admin Domain

1. Go to your admin project in Vercel dashboard
2. Navigate to Settings > Domains
3. Add your custom domain (e.g., `admin.stableview.com`)
4. Update DNS records as instructed

## Step 7: Update Environment Variables

After setting up custom domains, update the `NEXT_PUBLIC_CORE_API_URL` environment variables in both app and admin projects to use your custom API domain.

## Step 8: Continuous Deployment

### 8.1 Connect Git Repository

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. In each Vercel project dashboard, go to Settings > Git
3. Connect your repository
4. Configure deployment settings

### 8.2 Automatic Deployments

- **Core API**: Deploy on changes to `packages/core/`
- **App**: Deploy on changes to `packages/app/`
- **Admin**: Deploy on changes to `packages/admin/`

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Ensure all required environment variables are set in Vercel dashboard
   - Check that variable names match exactly

2. **API Connection Issues**
   - Verify `NEXT_PUBLIC_CORE_API_URL` is correct
   - Check CORS settings in your core API
   - Test API endpoints directly

3. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are properly installed
   - Verify TypeScript compilation

4. **Database Connection Issues**
   - Verify Supabase credentials are correct
   - Check Supabase project is active
   - Ensure database tables exist

### Debug Commands

```bash
# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs

# Redeploy specific project
vercel --prod
```

## Security Considerations

1. **Environment Variables**: Never commit sensitive environment variables to Git
2. **API Keys**: Use service role key only in backend, anon key for frontend
3. **CORS**: Configure CORS properly for production domains
4. **Rate Limiting**: Consider implementing rate limiting for API endpoints

## Performance Optimization

1. **Caching**: Implement caching strategies for API responses
2. **CDN**: Vercel automatically provides CDN for static assets
3. **Database**: Optimize database queries and indexes
4. **Images**: Use Next.js Image component for optimized image loading

## Monitoring

1. **Vercel Analytics**: Enable Vercel Analytics for performance monitoring
2. **Error Tracking**: Set up error tracking (Sentry, etc.)
3. **Database Monitoring**: Monitor Supabase usage and performance
4. **API Monitoring**: Track API response times and errors

## Support

If you encounter issues:

1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
3. Review deployment logs in Vercel dashboard
4. Test locally with `vercel dev` command
