# Deployment Troubleshooting

Common issues and solutions for framework deployments.

## Provider Detection Issues

### "No deployment provider detected"

**Symptom:** Framework can't determine which provider to use

**Solutions:**

1. **Add a config file:**
   ```bash
   # For Vercel
   echo '{"name":"my-project"}' > vercel.json

   # For Netlify
   echo '[build]' > netlify.toml
   echo '  command = "npm run build"' >> netlify.toml

   # For Railway
   echo '{"projectId":"your-project-id"}' > railway.json
   ```

2. **Specify provider explicitly:**
   ```bash
   framework deploy --provider vercel
   ```

3. **Add explicit preference in `.dd/config.json`:**
   ```json
   {
     "deployment": {
       "provider": "vercel"
     }
   }
   ```

## Credential Issues

### "VERCEL_TOKEN not found"

**Symptom:** Deployment fails with missing token error

**Solutions:**

1. **Save credentials:**
   ```bash
   framework deploy:auth save vercel YOUR_TOKEN
   ```

2. **Set environment variable:**
   ```bash
   export VERCEL_TOKEN=YOUR_TOKEN
   framework deploy
   ```

3. **Get a new token:**
   - Visit https://vercel.com/account/tokens
   - Create a new token
   - Save it: `framework deploy:auth save vercel NEW_TOKEN`

### "Invalid credentials"

**Symptom:** Credentials exist but are rejected by the provider

**Solutions:**

1. **Test credentials:**
   ```bash
   framework deploy:auth test vercel
   ```

2. **Token expired or revoked:**
   - Check provider dashboard for token status
   - Create a new token
   - Update: `framework deploy:auth save vercel NEW_TOKEN`

3. **Wrong provider:**
   - Verify you're using the correct provider
   - Check: `framework deploy:auth list`
   - Remove incorrect: `framework deploy:auth remove wrong-provider`

## Build Failures

### "Build command failed"

**Symptom:** Deployment starts but build fails

**Solutions:**

1. **Test build locally:**
   ```bash
   npm run build
   ```

2. **Check build command:**
   - Verify `package.json` has correct build script
   - Update build command if needed

3. **Install dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

4. **Check environment variables:**
   - Ensure all required env vars are set
   - Add to provider dashboard (Vercel/Netlify/Railway)

### "Module not found" during build

**Symptom:** Build fails with missing module errors

**Solutions:**

1. **Install missing dependencies:**
   ```bash
   npm install missing-package
   ```

2. **Check for dev dependencies:**
   - Build-time deps should be in `dependencies`, not `devDependencies`
   - Move if needed: `npm install -P package-name`

3. **Clear cache and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json .next
   npm install
   ```

## Framework-Specific Issues

### Next.js Issues

**"Error: Failed to load next.config.js"**

Solutions:
1. Check `next.config.js` syntax
2. Ensure all imported modules are installed
3. Test locally: `npm run build`

**"Static page generation timed out"**

Solutions:
1. Increase build timeout in provider settings
2. Optimize data fetching in `getStaticProps`
3. Use Incremental Static Regeneration (ISR)

### Vite Issues

**"Failed to resolve import"**

Solutions:
1. Check import paths are correct
2. Verify `vite.config.js` alias configuration
3. Ensure imported files exist

## Project Type Detection

### "Wrong framework detected"

**Symptom:** Framework detects wrong project type

**Solutions:**

1. **Check dependencies:**
   ```bash
   cat package.json | grep dependencies
   ```

2. **Ensure framework is in dependencies:**
   - Next.js needs `next` in dependencies
   - Vite needs `vite` in dependencies
   - etc.

3. **Override detection:**
   - Add explicit config in provider settings

## Deployment Timeout

### "Deployment timeout (5 minutes)"

**Symptom:** Deployment takes too long and times out

**Solutions:**

1. **Optimize build:**
   - Remove unnecessary dependencies
   - Use build caching
   - Parallelize builds if possible

2. **Check build logs:**
   - Look for hanging processes
   - Check for infinite loops
   - Verify API calls aren't blocking

3. **Increase timeout:**
   - Configure provider-specific timeout settings
   - Contact provider support for limit increases

## Network Issues

### "Failed to connect to API"

**Symptom:** Can't reach deployment provider API

**Solutions:**

1. **Check internet connection:**
   ```bash
   ping api.vercel.com
   ```

2. **Verify API endpoints:**
   - Vercel: https://api.vercel.com
   - Netlify: https://api.netlify.com
   - Railway: https://backboard.railway.app

3. **Check firewall:**
   - Ensure outbound HTTPS is allowed
   - Check corporate proxy settings

4. **Try again later:**
   - Provider may be experiencing outages
   - Check status pages:
     - https://www.vercel-status.com
     - https://www.netlifystatus.com
     - https://status.railway.app

## Permission Issues

### "Permission denied: ~/.dd/credentials.json"

**Symptom:** Can't read or write credentials file

**Solutions:**

1. **Fix permissions:**
   ```bash
   chmod 600 ~/.dd/credentials.json
   chown $USER ~/.dd/credentials.json
   ```

2. **Recreate credentials directory:**
   ```bash
   rm -rf ~/.dd
   mkdir ~/.dd
   framework deploy:auth save vercel YOUR_TOKEN
   ```

3. **Check disk space:**
   ```bash
   df -h ~
   ```

## CI/CD Issues

### GitHub Actions: "VERCEL_TOKEN not set"

**Symptom:** Deployment works locally but fails in GitHub Actions

**Solutions:**

1. **Add secret to repository:**
   - Go to Settings → Secrets and variables → Actions
   - Add secret: `VERCEL_TOKEN`

2. **Reference secret in workflow:**
   ```yaml
   env:
     VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
   ```

3. **Verify secret name matches:**
   - Secret name must match exactly
   - Case-sensitive

### GitLab CI: Token not working

**Solutions:**

1. **Add CI/CD variable:**
   - Settings → CI/CD → Variables
   - Add `VERCEL_TOKEN`
   - Mark as protected and masked

2. **Reference in `.gitlab-ci.yml`:**
   ```yaml
   variables:
     VERCEL_TOKEN: $VERCEL_TOKEN
   ```

## Provider-Specific Issues

### Vercel: "Project not found"

**Solutions:**

1. **Link project:**
   - Create `vercel.json` with project name
   - Or use `.vercel/project.json` from `vercel link`

2. **Create new project:**
   - Let framework create new project on first deploy
   - Or create manually in Vercel dashboard

### Netlify: "Site locked"

**Solutions:**

1. **Check site settings:**
   - Unlock site in Netlify dashboard
   - Verify you have deploy permissions

2. **Use site ID:**
   - Create `.netlify/state.json` with site ID

### Railway: "GraphQL error"

**Solutions:**

1. **Check token permissions:**
   - Token may not have required permissions
   - Create new token with full access

2. **Verify project exists:**
   - Check Railway dashboard
   - Create project if missing

## Debugging Tips

### Enable Verbose Logging

Currently not implemented, but coming soon:
```bash
framework deploy --verbose
```

### Dry Run Mode

Preview deployment without executing:
```bash
framework deploy --dry-run
```

This shows:
- Detected provider
- Project configuration
- Build command
- Planned actions

### Test Credentials

Before deploying, test credentials:
```bash
framework deploy:auth test vercel
```

### Check Project Detection

View what the framework detects:
```bash
# Shows detected framework and build command
framework deploy --dry-run
```

## Getting Help

### 1. Check Documentation

- [Deployment Overview](README.md)
- [Vercel Guide](vercel.md)
- [Netlify Guide](netlify.md)
- [Railway Guide](railway.md)
- [Credential Management](credentials.md)

### 2. Search Existing Issues

GitHub: https://github.com/jrdaws/framework/issues

### 3. Create an Issue

If you can't find a solution:

1. Go to https://github.com/jrdaws/framework/issues/new
2. Provide:
   - Framework version (`framework version`)
   - Provider (Vercel/Netlify/Railway)
   - Error message (sanitize tokens!)
   - Steps to reproduce
   - Project type (Next.js, Vite, etc.)

### 4. Community Support

- Discussions: https://github.com/jrdaws/framework/discussions
- Discord: [Coming soon]

## Common Error Messages

| Error | Likely Cause | Solution Link |
|-------|--------------|---------------|
| "No deployment provider detected" | Missing config files | [Provider Detection](#no-deployment-provider-detected) |
| "VERCEL_TOKEN not found" | Missing credentials | [Credential Issues](#vercel_token-not-found) |
| "Invalid credentials" | Expired/wrong token | [Invalid Credentials](#invalid-credentials) |
| "Build command failed" | Build errors | [Build Failures](#build-command-failed) |
| "Deployment timeout" | Build too slow | [Timeout Issues](#deployment-timeout-5-minutes) |
| "Permission denied" | File permissions | [Permission Issues](#permission-denied-ddcredentialsjson) |
| "Failed to connect" | Network issues | [Network Issues](#failed-to-connect-to-api) |

## Prevention Best Practices

1. **Test locally first:** Always run `npm run build` locally
2. **Use dry run:** Preview with `framework deploy --dry-run`
3. **Keep tokens secure:** Never commit to git
4. **Monitor deployments:** Check provider dashboards
5. **Keep dependencies updated:** Run `npm audit` and `npm update`
6. **Use environment variables:** Especially in CI/CD
7. **Document your setup:** Note which env vars are needed

## Next Steps

- [Back to Deployment Overview →](README.md)
- [Credential Management →](credentials.md)
- [Vercel Guide →](vercel.md)
- [Netlify Guide →](netlify.md)
- [Railway Guide →](railway.md)
