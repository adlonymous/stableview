# Railway Deployment Guide

This guide explains how to deploy the StableView monorepo to Railway.

## Prerequisites

1. Railway account (https://railway.app)
2. GitHub repository connected to Railway
3. PostgreSQL database (can be created in Railway)

## Deployment Strategy

We'll deploy each package as a separate service in Railway:

### 1. Core Package Service
- **Service Name**: `stableview-core`
- **Working Directory**: `packages/core`
- **Port**: 3004 (auto-assigned by Railway)
- **Purpose**: API server and database

### 2. App Package Service  
- **Service Name**: `stableview-app`
- **Working Directory**: `packages/app`
- **Port**: 3000 (auto-assigned by Railway)
- **Purpose**: Main user-facing application

### 3. Admin Package Service
- **Service Name**: `stableview-admin`
- **Working Directory**: `packages/admin`
- **Port**: 3003 (auto-assigned by Railway)
- **Purpose**: Admin interface

## Step-by-Step Deployment

### Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your `stableview` repository
5. Click "Deploy Now"

### Step 2: Set Up Core Service

1. **Create Core Service**:
   - Click "New Service" → "GitHub Repo"
   - Select your repository
   - Set **Working Directory** to `packages/core`
   - Click "Deploy"

2. **Configure Environment Variables**:
   ```bash
   DATABASE_URL=postgresql://username:password@host:port/database_name
   PORT=3004
   NODE_ENV=production
   ```

3. **Add PostgreSQL Database**:
   - Click "New Service" → "Database" → "PostgreSQL"
   - Copy the connection string to `DATABASE_URL`

### Step 3: Set Up App Service

1. **Create App Service**:
   - Click "New Service" → "GitHub Repo"
   - Select your repository
   - Set **Working Directory** to `packages/app`
   - Click "Deploy"

2. **Configure Environment Variables**:
   ```bash
   NEXT_PUBLIC_CORE_API_URL=https://your-core-service-name.railway.app
   NODE_ENV=production
   ```

### Step 4: Set Up Admin Service

1. **Create Admin Service**:
   - Click "New Service" → "GitHub Repo"
   - Select your repository
   - Set **Working Directory** to `packages/admin`
   - Click "Deploy"

2. **Configure Environment Variables**:
   ```bash
   NEXT_PUBLIC_CORE_API_URL=https://your-core-service-name.railway.app
   NODE_ENV=production
   ```

## Environment Variables Reference

### Core Package
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `PORT` | Server port | No | 3004 |
| `NODE_ENV` | Environment | No | production |

### App Package
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_CORE_API_URL` | Core API URL | Yes | - |
| `NODE_ENV` | Environment | No | production |

### Admin Package
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_CORE_API_URL` | Core API URL | Yes | - |
| `NODE_ENV` | Environment | No | production |

## Service Dependencies

Ensure services start in this order:
1. **PostgreSQL Database** (if using Railway's database)
2. **Core Service** (API server)
3. **App Service** (frontend)
4. **Admin Service** (admin interface)

## Troubleshooting

### "No Start Command Could be Found"
- Ensure the working directory is set correctly
- Check that `package.json` has a `start` script
- Verify the `railway.toml` file exists in the package directory

### Build Failures
- Check that all dependencies are in `package.json`
- Ensure TypeScript compilation succeeds locally
- Verify environment variables are set correctly

### Database Connection Issues
- Check `DATABASE_URL` format
- Ensure database is accessible from Railway
- Verify database credentials

### API Connection Issues
- Check `NEXT_PUBLIC_CORE_API_URL` points to correct service
- Ensure core service is running and healthy
- Verify CORS settings in core service

## Monitoring

- Use Railway's built-in logs to monitor services
- Set up health checks for each service
- Monitor database connections and API response times

## Scaling

- Core service can be scaled horizontally for API load
- App and Admin services can be scaled for user load
- Database can be upgraded for larger datasets

## Security

- Never commit `.env` files
- Use Railway's secret management for sensitive data
- Enable HTTPS (automatic in Railway)
- Set appropriate CORS policies in core service 