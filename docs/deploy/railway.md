# Deploy to Railway

> **Best For**: Full-stack apps, databases, backend services
> **Setup Time**: 3 minutes
> **Pricing**: Pay-as-you-go (free $5/month starter credit)

---

## Quick Start

```bash
# Deploy to preview
framework deploy --provider railway

# Deploy to production
framework deploy --provider railway --prod
```

---

## Setup

### 1. Get API Token

1. Go to [Railway Account Tokens](https://railway.app/account/tokens)
2. Click "Create Token"
3. Name it (e.g., "framework-cli")
4. Copy the token

### 2. Save Credentials

```bash
framework deploy:auth save railway YOUR_TOKEN
```

### 3. Deploy

```bash
cd your-project
framework deploy
```

---

## Why Railway?

Railway is ideal when you need:

- **Built-in databases**: PostgreSQL, MySQL, Redis with one click
- **Background workers**: Cron jobs, queues, long-running processes
- **Multiple services**: Frontend + API + database in one project
- **Persistent storage**: Volumes for file uploads
- **Private networking**: Services communicate securely

---

## Environment Variables

Add these in Railway Dashboard → Project → Service → Variables:

### Required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Auto-provided if using Railway Postgres |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

### Optional

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | AI generation |
| `PORT` | Auto-set by Railway |
| `RAILWAY_ENVIRONMENT` | Auto-set (production/staging) |

---

## Configuration

Create `railway.json` in your project root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 30,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

## Database Setup

### PostgreSQL

```bash
# In Railway dashboard:
# 1. Click "+ New" → Database → PostgreSQL
# 2. DATABASE_URL is auto-added to your service

# Or via CLI:
railway add -d postgres
```

### Redis

```bash
# In Railway dashboard:
# Click "+ New" → Database → Redis
# REDIS_URL is auto-added

# Or via CLI:
railway add -d redis
```

---

## GitHub Integration

1. Go to Railway Dashboard → New Project
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway auto-detects and configures the build

### Branch Deployments

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment (optional)

---

## Multi-Service Setup

Railway excels at multi-service architectures:

```
┌─────────────────────────────────────┐
│           Railway Project            │
├──────────┬──────────┬───────────────┤
│ Frontend │   API    │   Database    │
│ (Next.js)│ (Node)   │ (PostgreSQL)  │
├──────────┼──────────┼───────────────┤
│ Port 3000│ Port 4000│  Port 5432    │
└──────────┴──────────┴───────────────┘
        ↓ Private Network ↓
     Services connect via internal URLs
```

### Linking Services

In your frontend service, reference API via Railway's private network:

```bash
# Railway auto-provides these
API_URL=${{api.RAILWAY_PRIVATE_DOMAIN}}:4000
```

---

## Common Issues

### "Build failed: Memory exceeded"

Railway has 8GB build memory. For large builds:

```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS",
    "nixpacksConfigPath": "nixpacks.toml"
  }
}
```

### "Health check failing"

Ensure your `/api/health` endpoint returns 200:

```typescript
// app/api/health/route.ts
export function GET() {
  return Response.json({ status: 'ok' });
}
```

### "Cold starts slow"

Railway sleeps inactive services. Keep them warm with:

```bash
# Use Railway's always-on feature (paid)
# Or set up an external health check ping
```

---

## Railway CLI

For advanced usage:

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up

# View logs
railway logs

# Open shell in service
railway shell
```

---

## Pricing Tips

- **Free tier**: $5/month credit (covers small projects)
- **Usage-based**: Pay for what you use
- **Databases**: Charged by storage + compute time

Monitor usage: Railway Dashboard → Usage

---

*See also: [Deployment Overview](README.md) | [Troubleshooting](troubleshooting.md)*

