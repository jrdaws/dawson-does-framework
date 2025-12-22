# Deployment Guide

Deploy your framework projects to production with a single command. The framework supports automatic deployment to Vercel, Netlify, and Railway.

## Quick Start

```bash
# Auto-detect provider and deploy
framework deploy

# Deploy to production
framework deploy --prod

# Force a specific provider
framework deploy --provider vercel
```

## Supported Providers

| Provider | Best For | Pricing | Setup Time |
|----------|----------|---------|------------|
| [Vercel](vercel.md) | Next.js, React, Static | Free tier available | 2 minutes |
| [Netlify](netlify.md) | Static sites, JAMstack | Free tier available | 2 minutes |
| [Railway](railway.md) | Full-stack, Databases | Pay-as-you-go | 3 minutes |

## How It Works

The framework deployment system:

1. **Auto-detects** your deployment provider from config files
2. **Validates** your credentials securely
3. **Prepares** your project for deployment
4. **Uploads** and triggers the build
5. **Streams** real-time build logs
6. **Returns** your live URL

## Features

- **One-Command Deploy** - `framework deploy` handles everything
- **Auto-Detection** - Automatically detects Vercel, Netlify, or Railway
- **Secure Credentials** - Stored in `~/.dd/credentials.json` with strict permissions
- **Environment Support** - Deploy to preview, staging, or production
- **Real-Time Logs** - Watch your build progress live
- **Dry Run Mode** - Preview deployment without executing

## Setup

### 1. Get API Token

Choose your provider and get an API token:

- **Vercel**: https://vercel.com/account/tokens
- **Netlify**: https://app.netlify.com/user/applications
- **Railway**: https://railway.app/account/tokens

### 2. Save Credentials

```bash
# Save token to ~/.dd/credentials.json
framework deploy:auth save vercel YOUR_TOKEN

# Or use environment variable (for CI/CD)
export VERCEL_TOKEN=YOUR_TOKEN
```

### 3. Deploy

```bash
# Deploy preview
framework deploy

# Deploy production
framework deploy --prod
```

## Command Reference

### Deploy

```bash
framework deploy [options]
```

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `--prod` | Deploy to production | preview |
| `--provider <name>` | Force provider (vercel, netlify, railway) | auto-detect |
| `--env <name>` | Target environment | none |
| `--no-logs` | Disable log streaming | logs enabled |
| `--dry-run` | Preview without deploying | false |

**Examples:**

```bash
# Deploy to preview
framework deploy

# Deploy to production
framework deploy --prod

# Deploy with specific provider
framework deploy --provider vercel

# Deploy to staging environment
framework deploy --env staging --prod

# Preview deployment plan
framework deploy --dry-run
```

### Credential Management

```bash
framework deploy:auth <command>
```

**Commands:**

| Command | Description |
|---------|-------------|
| `save <provider> <token>` | Save credentials |
| `list` | List saved credentials |
| `remove <provider>` | Remove credentials |
| `test <provider>` | Test credentials |

**Examples:**

```bash
# Save Vercel token
framework deploy:auth save vercel YOUR_TOKEN

# List all credentials
framework deploy:auth list

# Test credentials
framework deploy:auth test vercel

# Remove credentials
framework deploy:auth remove netlify
```

## Provider Detection

The framework automatically detects your deployment provider:

### Detection Priority

1. **Explicit config** - `.dd/config.json` with `deployment.provider`
2. **Config files** - `vercel.json`, `netlify.toml`, `railway.json`
3. **Package scripts** - `deploy:vercel`, `deploy:netlify`, etc.
4. **Manual flag** - `--provider` flag

### Example: Explicit Configuration

Create `.dd/config.json`:

```json
{
  "deployment": {
    "provider": "vercel"
  }
}
```

## Environment Variables

Deployment credentials can be provided via environment variables:

```bash
# Vercel
export VERCEL_TOKEN=your_token_here

# Netlify
export NETLIFY_TOKEN=your_token_here

# Railway
export RAILWAY_TOKEN=your_token_here
```

**CI/CD**: Environment variables take precedence over stored credentials, making them perfect for continuous deployment pipelines.

## Project Type Detection

The framework automatically detects your project type:

| Framework | Detection | Build Command |
|-----------|-----------|---------------|
| Next.js | `next` in dependencies | `npm run build` |
| Vite | `vite` in dependencies | `npm run build` |
| Create React App | `react-scripts` | `npm run build` |
| SvelteKit | `@sveltejs/kit` | `npm run build` |
| Nuxt | `nuxt` in dependencies | `npm run build` |
| Static | No framework | none |

## Workflow Examples

### First Time Setup

```bash
# 1. Get your token
# Visit https://vercel.com/account/tokens

# 2. Save credentials
framework deploy:auth save vercel v1_abc123...

# 3. Deploy
cd my-project
framework deploy

#   🔍 Detecting deployment provider...
#      ✓ Detected: vercel (from vercel.json)
#
#   📦 Loading provider...
#      ✓ Provider loaded: deploy.vercel
#
#   🔐 Checking credentials...
#      ✓ Credentials found (source: file)
#      ✓ Credentials valid
#
#   📦 Detecting project...
#      Project: my-project
#      Framework: nextjs
#      Build command: npm run build
#
#   🚀 Deploying to vercel (preview)...
#      ✓ Deployment created: dpl_abc123
#
#   📋 Build logs:
#      [log output...]
#
#   ✅ Deployment successful!
#      URL: https://my-project-abc123.vercel.app
```

### CI/CD Pipeline

```.github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install framework
        run: npm install -g @jrdaws/framework

      - name: Deploy to production
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: framework deploy --prod --no-logs
```

### Multi-Environment Deployment

```bash
# Deploy to preview (development)
framework deploy

# Deploy to staging
framework deploy --env staging --prod

# Deploy to production
framework deploy --prod
```

## Troubleshooting

### Common Issues

**Issue: "No deployment provider detected"**

Solution: Add a config file or specify provider:
```bash
framework deploy --provider vercel
```

**Issue: "VERCEL_TOKEN not found"**

Solution: Save your credentials:
```bash
framework deploy:auth save vercel YOUR_TOKEN
```

**Issue: "Invalid credentials"**

Solution: Test and re-save credentials:
```bash
# Test credentials
framework deploy:auth test vercel

# Remove old credentials
framework deploy:auth remove vercel

# Save new credentials
framework deploy:auth save vercel NEW_TOKEN
```

See [Troubleshooting Guide](troubleshooting.md) for more solutions.

## Provider-Specific Guides

- [Vercel Deployment Guide](vercel.md)
- [Netlify Deployment Guide](netlify.md)
- [Railway Deployment Guide](railway.md)
- [Credential Management](credentials.md)
- [Troubleshooting](troubleshooting.md)

## Security

### Credential Storage

- Credentials are stored in `~/.dd/credentials.json`
- File permissions are set to `0600` (owner read/write only)
- Tokens are never logged or displayed
- Environment variables take precedence for CI/CD

### Best Practices

1. **Never commit tokens** to version control
2. **Use environment variables** in CI/CD
3. **Rotate tokens** periodically
4. **Use limited-scope tokens** when available
5. **Remove unused credentials** with `framework deploy:auth remove`

## Next Steps

- [Deploy to Vercel →](vercel.md)
- [Deploy to Netlify →](netlify.md)
- [Deploy to Railway →](railway.md)
- [Manage Credentials →](credentials.md)
- [Troubleshooting →](troubleshooting.md)
