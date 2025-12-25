# Deploy to Vercel

> **Best For**: Next.js, React, static sites
> **Setup Time**: 2 minutes
> **Pricing**: Free tier available

---

## Quick Start

```bash
# Deploy to preview
framework deploy --provider vercel

# Deploy to production
framework deploy --provider vercel --prod
```

---

## Setup

### 1. Get API Token

1. Go to [Vercel Account Tokens](https://vercel.com/account/tokens)
2. Click "Create" → name it (e.g., "framework-cli")
3. Copy the token

### 2. Save Credentials

```bash
framework deploy:auth save vercel YOUR_TOKEN
```

### 3. Deploy

```bash
cd your-project
framework deploy
```

---

## Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

### Required

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `ANTHROPIC_API_KEY` | AI generation API key |

### Optional

| Variable | Description |
|----------|-------------|
| `UPSTASH_REDIS_REST_URL` | Rate limiting (recommended) |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiting token |
| `NEXT_PUBLIC_SITE_URL` | Your production URL |

---

## Vercel Project Settings

For monorepo deployments, verify these settings:

| Setting | Value |
|---------|-------|
| Root Directory | `website` (if deploying website) |
| Framework Preset | `Next.js` |
| Build Command | `npm run build` |
| Node.js Version | `20.x` |

---

## GitHub Integration

Vercel automatically deploys when you push to GitHub:

- **Push to `main`** → Production deployment
- **Push to branch/PR** → Preview deployment

### Manual Trigger

```bash
cd your-project
npx vercel --prod
```

---

## Common Issues

### "NEXT_PUBLIC_* not available"

Environment variables must be set in Vercel dashboard, not just `.env.local`.

### "Build failed"

```bash
# Test locally first
npm run build
```

### "API returning 500"

Check Vercel Functions logs in dashboard for detailed errors.

---

## Full Guide

For advanced configuration (monorepo patterns, security headers, monitoring):

→ See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

---

*See also: [Deployment Overview](README.md) | [Troubleshooting](troubleshooting.md)*

