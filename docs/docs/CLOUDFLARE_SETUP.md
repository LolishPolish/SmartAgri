# Cloudflare Workers Deployment Guide

This guide explains how to deploy the Smart Agriculture Dashboard backend to Cloudflare Workers with D1 database.

## Why Cloudflare Workers?

- **100% Free**: Free tier includes 100,000 requests/day, 10ms CPU time per request
- **Edge Runtime**: Deployed to 300+ data centers worldwide for ultra-low latency
- **No Server Management**: Fully managed, auto-scaling
- **D1 Database**: SQLite-compatible database with 5GB storage, 5M reads/day, 100k writes/day free

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Node.js 20+**: For Wrangler CLI
3. **GitHub Repository**: Code pushed to GitHub

## Step 1: Install Wrangler

```bash
npm install -g wrangler
```

## Step 2: Login to Cloudflare

```bash
wrangler login
```

This opens a browser window to authorize Wrangler with your Cloudflare account.

## Step 3: Create D1 Database

```bash
wrangler d1 create smart-agri-db
```

You'll see output like:
```
✅ Successfully created DB 'smart-agri-db'
database_name: "smart-agri-db"
database_id: "YOUR_DATABASE_ID_HERE"
```

## Step 4: Update wrangler.toml

Edit `wrangler.toml` and replace `REPLACE_WITH_DATABASE_ID` with your actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "smart-agri-db"
database_id = "YOUR_ACTUAL_DATABASE_ID"
```

## Step 5: Apply Database Schema

```bash
# Local development
wrangler d1 migrations apply smart-agri-db --local

# Production
wrangler d1 migrations apply smart-agri-db --remote
```

The schema is defined in `worker.js` under the `migration` function and includes:
- `devices` table
- `crop_zones` table
- `alerts` table
- `irrigation_schedules` table
- `sensor_readings` table
- Indexes for performance

## Step 6: Test Locally

```bash
# Start local development server
wrangler dev

# In another terminal, test the API
curl http://localhost:8787/api/health
curl http://localhost:8787/api/devices
```

## Step 7: Deploy to Cloudflare Workers

```bash
wrangler deploy
```

You'll see output like:
```
✨ Success! Deployed to https://smart-agri-worker.YOUR-SUBDOMAIN.workers.dev
```

## Step 8: Configure GitHub Actions

1. Go to GitHub → Settings → Secrets and variables → Actions
2. Add the following secrets:

| Secret | Value | Where to find it |
|--------|-------|------------------|
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API token | Cloudflare Dashboard → My Profile → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID | Cloudflare Dashboard → Overview → Account ID |
| `VERCEL_TOKEN` | Your Vercel token | Vercel Dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Your Vercel Org ID | Vercel Dashboard → Settings → General |
| `VERCEL_PROJECT_ID` | Your Vercel Project ID | Vercel project settings |
| `VITE_API_URL` | Your Cloudflare Worker URL | `https://smart-agri-worker.YOUR-SUBDOMAIN.workers.dev` |

### Creating Cloudflare API Token

1. Go to [Cloudflare Dashboard → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use **Edit Cloudflare Workers** template
4. Set permissions to **Account** level
5. Create token and copy it

## Step 9: Push to GitHub

Push your code to the `main` branch. GitHub Actions will automatically:
1. Run tests
2. Deploy backend to Cloudflare Workers
3. Deploy frontend to Vercel

## Database Management

### View Data

```bash
wrangler d1 execute smart-agri-db --local --command "SELECT * FROM devices"
```

### Reset Database

```bash
wrangler d1 migrations apply smart-agri-db --local --force
```

### Production Database

```bash
# Query production database
wrangler d1 execute smart-agri-db --remote --command "SELECT COUNT(*) FROM devices"

# Apply migrations to production
wrangler d1 migrations apply smart-agri-db --remote
```

## Cost Estimate

| Resource | Free Tier | Paid Tier |
|----------|-----------|-----------|
| Cloudflare Workers | 100,000 requests/day | $0.50/million requests |
| D1 Database | 5GB storage, 5M reads/day, 100k writes/day | $0.75/GB/month, $1/million reads |
| Vercel | 100GB bandwidth, 125k serverless function invocations | $20/month Pro |

**For this project**: Likely stays within free tier indefinitely.

## Troubleshooting

### "D1_ERROR: no such table"
Run `wrangler d1 migrations apply smart-agri-db --local`

### "Worker not found"
Make sure you ran `wrangler deploy` and the Worker name matches `wrangler.toml`

### "CORS errors"
The Worker includes CORS headers for all responses. Make sure your frontend `VITE_API_URL` matches the Worker URL exactly.

### "Database not found"
Make sure you created the database with `wrangler d1 create smart-agri-db` and updated `wrangler.toml` with the correct `database_id`.