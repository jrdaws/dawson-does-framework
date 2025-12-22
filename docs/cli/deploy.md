# framework deploy

Deploy your application to production.

## Synopsis

```bash
framework deploy [options]
framework deploy:auth <command>
```

## Description

The `deploy` command deploys your application to Vercel, Netlify, or Railway. It automatically detects your deployment provider, validates credentials, and streams build logs in real-time.

## Arguments

None. The command works in the current directory.

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--prod` | Deploy to production (vs preview) | `false` |
| `--provider <name>` | Force provider (vercel, netlify, railway) | auto-detect |
| `--env <name>` | Target environment name | - |
| `--no-logs` | Disable build log streaming | logs enabled |
| `--dry-run` | Preview deployment without executing | `false` |

## Examples

### Basic Deployment

Deploy to preview environment:

```bash
framework deploy
```

**Output:**
```
🚀 Framework Deploy

🔍 Detecting deployment provider...
   ✓ Detected: vercel (from vercel.json)

📦 Loading provider...
   ✓ Provider loaded: deploy.vercel

🔐 Checking credentials...
   ✓ Credentials found (source: file)
   ✓ Credentials valid

📦 Detecting project...
   Project: my-app
   Framework: nextjs
   Build command: npm run build

🚀 Deploying to vercel (preview)...
   ✓ Deployment created: dpl_abc123

📋 Build logs:
   [2025-01-20 10:00:00] Installing dependencies...
   [2025-01-20 10:00:15] Building application...
   [2025-01-20 10:01:30] Build complete

⏳ Waiting for deployment...

✅ Deployment successful!
   URL: https://my-app-abc123.vercel.app
   Build time: 90s
```

### Production Deployment

Deploy to production:

```bash
framework deploy --prod
```

This deploys to your production URL (e.g., `my-app.vercel.app` or custom domain).

### Force Provider

Explicitly specify provider:

```bash
framework deploy --provider vercel
framework deploy --provider netlify
framework deploy --provider railway
```

### Target Environment

Deploy to specific environment:

```bash
framework deploy --env staging --prod
framework deploy --env production --prod
```

### Dry Run

Preview deployment without executing:

```bash
framework deploy --dry-run
```

**Output:**
```
📋 DRY RUN - Deployment Preview

Provider: vercel
Mode: preview
Project: my-app
Framework: nextjs
Build command: npm run build

Actions that would be performed:
  1. Validate credentials
  2. Prepare files for deployment
  3. Upload to provider
  4. Trigger build
  5. Stream build logs
  6. Wait for deployment to be ready
  7. Return live URL

Run without --dry-run to deploy
```

### Disable Log Streaming

Deploy without streaming logs:

```bash
framework deploy --no-logs
```

## Credential Management

### Save Credentials

Save deployment credentials:

```bash
framework deploy:auth save <provider> <token>
```

**Examples:**

```bash
# Vercel
framework deploy:auth save vercel v1_abc123...

# Netlify
framework deploy:auth save netlify nfp_abc123...

# Railway
framework deploy:auth save railway railway_abc123...
```

### List Credentials

View saved credentials:

```bash
framework deploy:auth list
```

**Output:**
```
📋 Saved credentials:

   vercel:
     Created: 1/15/2025
     Last used: 1/20/2025
     Token: v1_abc123d...

   netlify:
     Created: 1/10/2025
     Last used: 1/18/2025
     Token: nfp_abc123...
```

### Test Credentials

Validate credentials:

```bash
framework deploy:auth test <provider>
```

**Examples:**

```bash
# Test Vercel credentials
framework deploy:auth test vercel
```

**Output:**
```
🧪 Testing vercel credentials...

✅ Credentials valid for vercel
   Source: file
```

### Remove Credentials

Delete stored credentials:

```bash
framework deploy:auth remove <provider>
```

**Example:**

```bash
framework deploy:auth remove vercel
```

## Provider Detection

The framework automatically detects your deployment provider.

### Detection Priority

1. **Explicit config** - `.dd/config.json` with `deployment.provider`
2. **Config files** - `vercel.json`, `netlify.toml`, `railway.json`
3. **Package scripts** - `deploy:vercel`, `deploy:netlify`, etc.
4. **Manual flag** - `--provider` option

### Explicit Configuration

Set preferred provider in `.dd/config.json`:

```json
{
  "deployment": {
    "provider": "vercel"
  }
}
```

### Provider Config Files

**Vercel** - `vercel.json`:

```json
{
  "name": "my-app",
  "framework": "nextjs",
  "buildCommand": "npm run build"
}
```

**Netlify** - `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Railway** - `railway.json`:

```json
{
  "projectId": "your-project-id",
  "name": "my-app"
}
```

## Getting API Tokens

### Vercel Token

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name (e.g., "Framework Deploy")
4. Select scope (full access or limited)
5. Copy the token
6. Save: `framework deploy:auth save vercel YOUR_TOKEN`

### Netlify Token

1. Go to [app.netlify.com/user/applications](https://app.netlify.com/user/applications)
2. Click "New access token"
3. Give it a description
4. Copy the token
5. Save: `framework deploy:auth save netlify YOUR_TOKEN`

### Railway Token

1. Go to [railway.app/account/tokens](https://railway.app/account/tokens)
2. Click "Create New Token"
3. Give it a name
4. Copy the token
5. Save: `framework deploy:auth save railway YOUR_TOKEN`

## Environment Variables

### Credential Priority

1. **Environment variables** (highest priority)
2. **Credentials file** (`~/.dd/credentials.json`)
3. **Interactive prompt** (future feature)

### Variable Names

```bash
VERCEL_TOKEN=your_token_here
NETLIFY_TOKEN=your_token_here
RAILWAY_TOKEN=your_token_here
```

### CI/CD Usage

Use environment variables in CI/CD:

```yaml
# .github/workflows/deploy.yml
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

      - name: Deploy
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: framework deploy --prod --no-logs
```

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

## Deployment Workflow

### Complete Workflow

```bash
# 1. Setup credentials (one-time)
framework deploy:auth save vercel YOUR_TOKEN

# 2. Test locally
npm run build

# 3. Preview deployment
framework deploy --dry-run

# 4. Deploy to preview
framework deploy

# 5. Test preview URL
open <preview-url>

# 6. Deploy to production
framework deploy --prod
```

### First-Time Setup

```bash
# Get token from provider
# Visit: https://vercel.com/account/tokens

# Save credentials
framework deploy:auth save vercel YOUR_TOKEN

# Verify credentials
framework deploy:auth test vercel

# Deploy
cd my-app
framework deploy --prod
```

### Regular Deployment

```bash
# Make changes
git add .
git commit -m "Add new feature"

# Deploy to preview
framework deploy

# Test preview
# Visit preview URL

# Deploy to production
framework deploy --prod

# Push to git
git push
```

## Common Issues

### No Provider Detected

**Error:**
```
❌ No deployment provider detected
```

**Solutions:**

1. Add provider config file:
   ```bash
   echo '{"name":"my-app"}' > vercel.json
   ```

2. Specify provider explicitly:
   ```bash
   framework deploy --provider vercel
   ```

3. Set explicit preference:
   ```json
   // .dd/config.json
   {
     "deployment": {
       "provider": "vercel"
     }
   }
   ```

### Missing Credentials

**Error:**
```
❌ No VERCEL_TOKEN found
```

**Solutions:**

1. Save credentials:
   ```bash
   framework deploy:auth save vercel YOUR_TOKEN
   ```

2. Set environment variable:
   ```bash
   export VERCEL_TOKEN=YOUR_TOKEN
   framework deploy
   ```

3. Get new token from provider dashboard

### Invalid Credentials

**Error:**
```
❌ Invalid credentials: Unauthorized
```

**Solutions:**

1. Test credentials:
   ```bash
   framework deploy:auth test vercel
   ```

2. Token may have expired - create new token

3. Remove and re-save:
   ```bash
   framework deploy:auth remove vercel
   framework deploy:auth save vercel NEW_TOKEN
   ```

### Build Failures

**Error:**
```
❌ Deployment failed: Build command failed
```

**Solutions:**

1. Test build locally:
   ```bash
   npm run build
   ```

2. Check build logs for specific errors

3. Ensure all dependencies are in `dependencies`, not `devDependencies`

4. Verify environment variables are set in provider dashboard

### Deployment Timeout

**Error:**
```
❌ Deployment timeout (5 minutes)
```

**Solutions:**

1. Optimize build:
   - Remove unnecessary dependencies
   - Use build caching
   - Parallelize builds

2. Check for hanging processes in build

3. Contact provider support for timeout increase

## Provider-Specific Notes

### Vercel

- Supports Next.js with automatic configuration
- Edge functions and middleware supported
- Automatic preview deployments for PRs
- Custom domains with SSL

**Features:**
- Automatic HTTPS
- Global CDN
- Analytics
- Web Analytics
- Image optimization

### Netlify

- Works with any static site generator
- Powerful redirect and header rules
- Form handling
- Split testing

**Features:**
- Instant rollbacks
- Branch deploys
- Deploy previews
- Functions (serverless)

### Railway

- Full-stack deployments (frontend + backend)
- Database support
- Environment management
- Automatic HTTPS

**Features:**
- Container-based deploys
- PostgreSQL, MySQL, MongoDB, Redis
- Cron jobs
- Private networking

## Security

### Credential Storage

- Credentials stored in `~/.dd/credentials.json`
- File permissions set to `0600` (owner-only)
- Tokens never logged or displayed
- Environment variables take precedence

### Best Practices

1. **Never commit tokens** to git
2. **Use environment variables** in CI/CD
3. **Rotate tokens** periodically
4. **Use limited-scope tokens** when available
5. **Remove unused credentials**

## Performance Tips

### Optimize Build Time

1. **Use build cache:**
   - Vercel: Automatic
   - Netlify: Enable in settings
   - Railway: Automatic

2. **Parallelize builds:**
   ```json
   {
     "scripts": {
       "build": "npm-run-all --parallel build:*"
     }
   }
   ```

3. **Minimize dependencies:**
   ```bash
   npm prune --production
   ```

### Reduce Bundle Size

1. **Tree shake unused code**
2. **Use dynamic imports**
3. **Optimize images**
4. **Enable compression**

## Next Steps

After deploying:

1. **Set up custom domain** in provider dashboard
2. **Configure environment variables** for production
3. **Set up monitoring** and error tracking
4. **Enable analytics** to track usage
5. **Set up CI/CD** for automatic deployments

## Related Commands

- [`framework export`](export.md) - Create projects
- [`framework pull`](pull.md) - Pull from web
- [`framework doctor`](doctor.md) - Health checks

## See Also

- [Deployment Guide](../deploy/README.md) - Complete deployment guide
- [Vercel Guide](../deploy/vercel.md) - Vercel-specific guide
- [Netlify Guide](../deploy/netlify.md) - Netlify-specific guide
- [Railway Guide](../deploy/railway.md) - Railway-specific guide
- [Credential Management](../deploy/credentials.md) - Managing credentials
- [Troubleshooting](../deploy/troubleshooting.md) - Common issues
