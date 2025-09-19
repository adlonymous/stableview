# Vercel Cron Jobs Setup

This document explains how to set up and configure the Vercel cron jobs for the StableView application.

## Overview

The application includes three automated cron jobs:

1. **Daily Metrics Update** - Runs every day at midnight UTC
2. **Price Updates** - Runs every day at midnight UTC
3. **Peg Price Updates** - Runs every day at midnight UTC

## Setup Instructions

### 1. Environment Variables

Add the following environment variable to your Vercel project:

```bash
CRON_SECRET=your_secure_cron_secret_key
```

**Important**: Generate a strong, random secret key for security. This prevents unauthorized access to your cron endpoints.

### 2. Deploy to Vercel

The cron jobs are automatically configured in `vercel.json` and will be active once deployed:

```json
{
  "crons": [
    {
      "path": "/api/cron/update-metrics",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/update-prices",
      "schedule": "*/30 * * * *"
    },
    {
      "path": "/api/cron/update-peg-prices",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

### 3. Verify Deployment

After deployment, you can verify the cron jobs are working by:

1. **Check Vercel Dashboard**: Go to your project's Functions tab to see the cron job executions
2. **Monitor Logs**: Check the function logs for success/error messages
3. **Test Endpoints**: You can manually trigger the jobs (with proper authentication)

## Cron Job Details

### Daily Metrics Update (`/api/cron/update-metrics`)

- **Schedule**: `0 0 * * *` (Daily at midnight UTC)
- **Duration**: Up to 5 minutes
- **Purpose**: Updates stablecoin metrics including total supply, daily active users, and transaction data

### Price Updates (`/api/cron/update-prices`)

- **Schedule**: `0 0 * * *` (Daily at midnight UTC)
- **Duration**: Up to 5 minutes
- **Purpose**: Updates current market prices for all stablecoins

### Peg Price Updates (`/api/cron/update-peg-prices`)

- **Schedule**: `0 0 * * *` (Daily at midnight UTC)
- **Duration**: Up to 5 minutes
- **Purpose**: Updates peg prices for stablecoins based on their pegged assets

## Security

All cron endpoints are protected by:

- **Authentication**: Requires `CRON_SECRET` in Authorization header
- **Method Restriction**: Only accepts POST requests
- **Vercel Origin**: Only accessible from Vercel's cron system

## Monitoring

### Success Response

```json
{
  "success": true,
  "message": "Update completed successfully",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "result": {
    "total": 10,
    "successful": 9,
    "failed": 1
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Verify `CRON_SECRET` is set correctly
2. **Timeout Errors**: Check if the function duration limit is sufficient
3. **Import Errors**: Ensure all dependencies are properly installed
4. **Database Errors**: Verify Supabase connection and permissions

### Manual Testing

You can test the cron jobs manually using curl:

```bash
# Test metrics update
curl -X POST https://your-domain.vercel.app/api/cron/update-metrics \
  -H "Authorization: Bearer your_cron_secret"

# Test price update
curl -X POST https://your-domain.vercel.app/api/cron/update-prices \
  -H "Authorization: Bearer your_cron_secret"

# Test peg price update
curl -X POST https://your-domain.vercel.app/api/cron/update-peg-prices \
  -H "Authorization: Bearer your_cron_secret"
```

## Schedule Reference

| Job        | Schedule    | Description           |
| ---------- | ----------- | --------------------- |
| Metrics    | `0 0 * * *` | Daily at midnight UTC |
| Prices     | `0 0 * * *` | Daily at midnight UTC |
| Peg Prices | `0 0 * * *` | Daily at midnight UTC |

## Dependencies

The cron jobs require the following environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BIRDEYE_API_KEY`
- `EXCHANGE_RATE_API_KEY`
- `CRON_SECRET`
