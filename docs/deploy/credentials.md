# Credential Management

Securely manage deployment credentials for Vercel, Netlify, and Railway.

## Overview

The framework stores deployment credentials in `~/.dd/credentials.json` with strict file permissions (0600 on Unix systems). Environment variables take precedence over stored credentials, making them ideal for CI/CD pipelines.

## Storage Priority

1. **Environment variables** (highest priority)
2. **Credentials file** (`~/.dd/credentials.json`)
3. **Interactive prompt** (future feature)

## Commands

### Save Credentials

Store API tokens securely in the credentials file:

```bash
framework deploy:auth save <provider> <token>
```

**Examples:**

```bash
# Save Vercel token
framework deploy:auth save vercel v1_abc123def456...

# Save Netlify token
framework deploy:auth save netlify nfp_abc123def456...

# Save Railway token
framework deploy:auth save railway railway_abc123...
```

### List Credentials

View all saved credentials (tokens are masked):

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

Validate that credentials work:

```bash
framework deploy:auth test <provider>
```

**Examples:**

```bash
# Test Vercel credentials
framework deploy:auth test vercel

# Output:
# 🧪 Testing vercel credentials...
# ✅ Credentials valid for vercel
#    Source: file
```

### Remove Credentials

Delete stored credentials:

```bash
framework deploy:auth remove <provider>
```

**Examples:**

```bash
# Remove Vercel credentials
framework deploy:auth remove vercel

# Output:
# ✅ Credentials removed for vercel
```

## Getting API Tokens

### Vercel

1. Visit https://vercel.com/account/tokens
2. Click "Create Token"
3. Give it a name (e.g., "Framework Deploy")
4. Select scope (full access or limited)
5. Copy the token
6. Save: `framework deploy:auth save vercel YOUR_TOKEN`

### Netlify

1. Visit https://app.netlify.com/user/applications
2. Click "New access token"
3. Give it a description
4. Copy the token
5. Save: `framework deploy:auth save netlify YOUR_TOKEN`

### Railway

1. Visit https://railway.app/account/tokens
2. Click "Create New Token"
3. Give it a name
4. Copy the token
5. Save: `framework deploy:auth save railway YOUR_TOKEN`

## Environment Variables

For CI/CD pipelines, use environment variables instead of the credentials file:

### Variable Names

```bash
VERCEL_TOKEN=your_token_here
NETLIFY_TOKEN=your_token_here
RAILWAY_TOKEN=your_token_here
```

### GitHub Actions Example

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

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install framework
        run: npm install -g @jrdaws/framework

      - name: Deploy
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: framework deploy --prod
```

**Setup:**

1. Go to your GitHub repository settings
2. Navigate to Secrets and variables → Actions
3. Add secret: `VERCEL_TOKEN` with your token value
4. The workflow will use the environment variable automatically

### GitLab CI Example

```.gitlab-ci.yml
deploy:
  stage: deploy
  image: node:20
  script:
    - npm install -g @jrdaws/framework
    - framework deploy --prod
  variables:
    VERCEL_TOKEN: $VERCEL_TOKEN
  only:
    - main
```

**Setup:**

1. Go to Settings → CI/CD → Variables
2. Add variable: `VERCEL_TOKEN` (marked as protected and masked)
3. Save and the pipeline will use it

## Security Best Practices

### 1. Use Limited-Scope Tokens

When available, create tokens with minimal required permissions:

- **Vercel**: Scope to specific projects or teams
- **Netlify**: Use site-specific tokens when possible
- **Railway**: Limit to specific projects

### 2. Rotate Tokens Regularly

```bash
# Remove old token
framework deploy:auth remove vercel

# Save new token
framework deploy:auth save vercel NEW_TOKEN

# Test new token
framework deploy:auth test vercel
```

### 3. Never Commit Tokens

Add to `.gitignore`:

```gitignore
# Never commit these
.env
.env.local
*.env
.dd/credentials.json
```

### 4. Use Environment Variables in CI/CD

- Never hardcode tokens in CI/CD configs
- Use secret management features:
  - GitHub: Repository Secrets
  - GitLab: CI/CD Variables
  - CircleCI: Project Environment Variables
  - Jenkins: Credentials Store

### 5. Monitor Token Usage

Most providers show token usage in their dashboards:

- Check for unexpected activity
- Revoke compromised tokens immediately
- Create new tokens after security incidents

## Credential File Format

The credentials file at `~/.dd/credentials.json` has this structure:

```json
{
  "version": "1.0.0",
  "credentials": {
    "vercel": {
      "token": "v1_abc123...",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "lastUsed": "2025-01-20T14:22:00.000Z"
    },
    "netlify": {
      "token": "nfp_abc123...",
      "createdAt": "2025-01-10T09:15:00.000Z",
      "lastUsed": "2025-01-18T11:45:00.000Z"
    }
  }
}
```

**Important:**

- File permissions are automatically set to `0600` (owner-only read/write)
- Never manually edit this file - use `framework deploy:auth` commands
- Backup this file securely if needed

## Troubleshooting

### Issue: "VERCEL_TOKEN not found"

**Solutions:**

1. Save credentials: `framework deploy:auth save vercel YOUR_TOKEN`
2. Or set environment variable: `export VERCEL_TOKEN=YOUR_TOKEN`
3. Check if credentials file exists: `ls -la ~/.dd/credentials.json`

### Issue: "Invalid credentials"

**Solutions:**

1. Test credentials: `framework deploy:auth test vercel`
2. Token may have expired - create a new token
3. Token may have been revoked - check provider dashboard
4. Remove and re-save: `framework deploy:auth remove vercel && framework deploy:auth save vercel NEW_TOKEN`

### Issue: "Permission denied: ~/.dd/credentials.json"

**Solutions:**

1. Check file permissions: `ls -la ~/.dd/credentials.json`
2. Fix permissions: `chmod 600 ~/.dd/credentials.json`
3. Check directory permissions: `ls -la ~/.dd`
4. Recreate: `rm ~/.dd/credentials.json && framework deploy:auth save vercel YOUR_TOKEN`

### Issue: Environment variable not working

**Solutions:**

1. Verify variable is set: `echo $VERCEL_TOKEN`
2. Export in current shell: `export VERCEL_TOKEN=your_token`
3. Add to shell profile (~/.bashrc, ~/.zshrc)
4. Restart terminal or run `source ~/.zshrc`

### Issue: CI/CD deployment fails with auth error

**Solutions:**

1. Verify secret is set in CI/CD platform
2. Check secret name matches variable name exactly
3. Ensure secret is not masked/hidden in logs (for debugging only)
4. Test token locally first: `VERCEL_TOKEN=xxx framework deploy --dry-run`

## Migration

### Migrating from Other Tools

If you're migrating from Vercel CLI, Netlify CLI, or Railway CLI:

**Vercel:**
```bash
# Your existing Vercel token works!
# Find it in ~/.vercel or from Vercel dashboard
framework deploy:auth save vercel YOUR_EXISTING_TOKEN
```

**Netlify:**
```bash
# Use your existing Netlify token
# Find it in Netlify dashboard
framework deploy:auth save netlify YOUR_EXISTING_TOKEN
```

**Railway:**
```bash
# Use your existing Railway token
# Find it in Railway dashboard
framework deploy:auth save railway YOUR_EXISTING_TOKEN
```

## Next Steps

- [Deploy to Vercel →](vercel.md)
- [Deploy to Netlify →](netlify.md)
- [Deploy to Railway →](railway.md)
- [Troubleshooting →](troubleshooting.md)
- [Back to Deployment Overview →](README.md)
