# framework doctor

Run health checks on your project.

## Synopsis

```bash
framework doctor [project-dir]
```

## Description

Runs comprehensive health checks on your project to detect issues with configuration, dependencies, integrations, and more.

## Arguments

| Argument | Description | Required | Default |
|----------|-------------|----------|---------|
| `project-dir` | Project directory | No | Current directory |

## Example

```bash
framework doctor
```

### Output (Healthy Project)

```
🏥 Framework Doctor

Running health checks...

✅ Project structure
   All required files present

✅ Dependencies
   All dependencies installed
   No security vulnerabilities

✅ Configuration
   Valid .dd/config.json
   Valid package.json
   Valid tsconfig.json

✅ Environment variables
   All required variables set

✅ Integrations
   auth.supabase - configured
   payments.stripe - configured

✅ Build
   Project builds successfully

📊 Summary:
   Checks passed: 6/6
   Checks failed: 0
   Warnings: 0

✅ Project is healthy!
```

### Output (With Issues)

```
🏥 Framework Doctor

Running health checks...

✅ Project structure
   All required files present

⚠️  Dependencies
   3 packages have security vulnerabilities
   Run: npm audit fix

❌ Environment variables
   Missing: STRIPE_SECRET_KEY
   Missing: SUPABASE_URL

✅ Configuration
   Valid configuration files

⚠️  Integrations
   payments.stripe - missing API key

❌ Build
   Build failed: Module not found

💡 Recommended actions:
  1. Set missing environment variables
  2. Fix security vulnerabilities: npm audit fix
  3. Fix build errors

📊 Summary:
   Checks passed: 2/6
   Checks failed: 2
   Warnings: 2

Run recommended actions to fix issues.
```

## Health Checks

### Project Structure
- Required files exist
- Directory structure correct
- Manifest file valid

### Dependencies
- All packages installed
- No missing dependencies
- Security vulnerabilities check
- Outdated packages

### Configuration
- Valid .dd/config.json
- Valid package.json
- Valid tsconfig.json
- Valid next.config.js

### Environment Variables
- Required variables set
- Integration keys present
- No conflicting variables

### Integrations
- Integration files present
- API keys configured
- Integration health checks

### Build
- TypeScript compiles
- Build succeeds
- No build errors

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | All checks passed |
| `1` | Some checks failed |

## Use Cases

### Before Deployment

```bash
framework doctor
```

Ensure project is ready to deploy.

### After Setup

```bash
framework doctor
```

Verify setup completed correctly.

### Troubleshooting

```bash
framework doctor
```

Diagnose issues.

### CI/CD

```yaml
# .github/workflows/health.yml
- name: Health check
  run: framework doctor
```

Automated health checks.

## Related Commands

- [`framework drift`](drift.md) - Detect changes
- [`framework capabilities`](capabilities.md) - Check capabilities

## See Also

- [Troubleshooting Guide](../troubleshooting/README.md) - Common issues
- [Health Checks](../concepts/health-checks.md) - How checks work
