# Deploy to Netlify

> **Best For**: Static sites, JAMstack
> **Setup Time**: 2 minutes
> **Pricing**: Free tier available

---

## Quick Start

```bash
# Deploy to preview
framework deploy --provider netlify

# Deploy to production
framework deploy --provider netlify --prod
```

---

## Setup

### 1. Get API Token

1. Go to [Netlify Applications](https://app.netlify.com/user/applications)
2. Click "New access token"
3. Name it (e.g., "framework-cli")
4. Copy the token

### 2. Save Credentials

```bash
framework deploy:auth save netlify YOUR_TOKEN
```

### 3. Deploy

```bash
cd your-project
framework deploy
```

---

## Environment Variables

Add these in Netlify Dashboard → Site Settings → Environment Variables:

### Required

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

### Optional

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | AI generation (if using) |
| `NEXT_PUBLIC_SITE_URL` | Your production URL |

---

## Configuration

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"

# Redirect www to non-www
[[redirects]]
  from = "https://www.example.com/*"
  to = "https://example.com/:splat"
  status = 301
  force = true
```

---

## GitHub Integration

1. Go to Netlify Dashboard → Add new site
2. Select "Import from Git"
3. Choose your repository
4. Configure build settings:
   - **Base directory**: Leave blank (or `website` for monorepo)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

---

## Common Issues

### "Build failed: Command not found"

Ensure `package.json` has a `build` script:

```json
{
  "scripts": {
    "build": "next build"
  }
}
```

### "Functions timing out"

Netlify Functions have a 10-second timeout on free tier. Consider:
- Edge Functions for faster cold starts
- Pro tier for 26-second timeout

### "Next.js not working correctly"

Add the Next.js plugin:

```bash
npm install -D @netlify/plugin-nextjs
```

---

## Netlify CLI

For advanced usage:

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Link to existing site
netlify link

# Deploy preview
netlify deploy

# Deploy production
netlify deploy --prod
```

---

*See also: [Deployment Overview](README.md) | [Troubleshooting](troubleshooting.md)*

