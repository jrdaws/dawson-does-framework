# CLI Reference

Complete reference for all framework commands.

## Command Overview

The framework CLI provides commands for creating, managing, and deploying projects.

### Core Commands

| Command | Description |
|---------|-------------|
| [`export`](export.md) | Create projects from templates |
| [`pull`](pull.md) | Pull projects from web configurator |
| [`deploy`](deploy.md) | Deploy to production |
| [`templates`](templates.md) | Browse and search templates |

### Project Management

| Command | Description |
|---------|-------------|
| [`capabilities`](capabilities.md) | Inspect project capabilities |
| [`drift`](drift.md) | Detect changes from template |
| [`doctor`](doctor.md) | Run project health checks |

### Extensions

| Command | Description |
|---------|-------------|
| [`plugin`](plugin.md) | Manage plugins |
| [`checkpoint`](checkpoint.md) | AI safety checkpoints |

### Utilities

| Command | Description |
|---------|-------------|
| [`version`](version.md) | Show framework version |
| [`upgrade`](upgrade.md) | Update framework |
| `help` | Show help information |

## Quick Reference

### Create a Project

```bash
# From template
framework export saas ./my-app

# With integrations
framework export saas ./my-app --auth supabase --payments stripe

# From web configurator
framework pull <token> --cursor
```

### Deploy

```bash
# Deploy to preview
framework deploy

# Deploy to production
framework deploy --prod
```

### Browse Templates

```bash
# List all templates
framework templates list

# Search templates
framework templates search "blog"

# Get template info
framework templates info saas
```

### Manage Plugins

```bash
# Add plugin
framework plugin add ./my-plugin.mjs

# List plugins
framework plugin list

# Remove plugin
framework plugin remove my-plugin
```

### Safety Features

```bash
# Create checkpoint
framework checkpoint create "before major changes"

# List checkpoints
framework checkpoint list

# Restore checkpoint
framework checkpoint restore <id>
```

## Global Options

These options work with most commands:

| Option | Description |
|--------|-------------|
| `--help` | Show command help |
| `--version` | Show framework version |
| `--quiet` | Suppress output |
| `--dry-run` | Preview without executing (where supported) |

## Command Syntax

Commands follow this pattern:

```bash
framework <command> [arguments] [options]
```

**Examples:**

```bash
framework export saas ./my-app --auth supabase
#         ^       ^    ^         ^
#         |       |    |         └─ Options (flags)
#         |       |    └─────────── Argument 2
#         |       └──────────────── Argument 1
#         └──────────────────────── Command
```

## Environment Variables

### Framework Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `FRAMEWORK_TEMPLATE_SOURCE` | Template source (local/remote) | `auto` |
| `FRAMEWORK_QUIET` | Suppress output | `false` |

### Integration Keys

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `VERCEL_TOKEN` | Vercel API token |
| `NETLIFY_TOKEN` | Netlify API token |
| `RAILWAY_TOKEN` | Railway API token |

See [Environment Variables Guide](../configuration/environment.md) for complete list.

## Exit Codes

The framework uses standard exit codes:

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | General error |
| `2` | Invalid arguments |
| `127` | Command not found |

## Output Formats

### Standard Output

Success messages and progress:

```
✓ Template cloned: saas
✓ Integration applied: auth.supabase
✓ Export complete!
```

### Error Output

Errors with helpful context:

```
❌ Template not found: invalid-template

Did you mean one of these?
  - saas
  - dashboard
  - blog

Run 'framework templates list' to see all templates.
```

### Quiet Mode

Suppress non-essential output:

```bash
FRAMEWORK_QUIET=true framework export saas ./my-app
```

## Configuration Files

The framework uses these configuration files:

### Global Configuration

**Location:** `~/.dd/`

```
~/.dd/
├── credentials.json     # Deployment credentials
├── config.json          # Global settings
└── plugins.json         # Installed plugins
```

### Project Configuration

**Location:** `<project>/.dd/`

```
.dd/
├── manifest.json        # Project manifest
├── config.json          # Project settings
└── health.sh           # Health check script
```

## Getting Help

### Command Help

Get help for any command:

```bash
framework <command> --help
```

**Examples:**

```bash
framework export --help
framework deploy --help
framework templates --help
```

### General Help

```bash
framework help
framework --help
```

### Documentation

- **Online docs:** [https://github.com/jrdaws/framework/tree/main/docs](https://github.com/jrdaws/framework/tree/main/docs)
- **Issues:** [https://github.com/jrdaws/framework/issues](https://github.com/jrdaws/framework/issues)
- **Discussions:** [https://github.com/jrdaws/framework/discussions](https://github.com/jrdaws/framework/discussions)

## Command Categories

### Project Creation

- [`export`](export.md) - Create from template
- [`pull`](pull.md) - Pull from web
- `demo` - Quick demo export

### Deployment

- [`deploy`](deploy.md) - Deploy to production
- `deploy:auth` - Manage deployment credentials

### Discovery

- [`templates list`](templates.md) - List templates
- [`templates search`](templates.md) - Search templates
- [`templates info`](templates.md) - Template details

### Development

- [`capabilities`](capabilities.md) - Check capabilities
- [`doctor`](doctor.md) - Health checks
- [`drift`](drift.md) - Detect changes

### Extensions

- [`plugin add`](plugin.md) - Add plugin
- [`plugin remove`](plugin.md) - Remove plugin
- [`plugin list`](plugin.md) - List plugins

### Safety

- [`checkpoint create`](checkpoint.md) - Create checkpoint
- [`checkpoint restore`](checkpoint.md) - Restore checkpoint
- [`checkpoint list`](checkpoint.md) - List checkpoints

### Maintenance

- [`version`](version.md) - Show version
- [`upgrade`](upgrade.md) - Update framework

## Common Workflows

### New Project Workflow

```bash
# 1. Browse templates
framework templates list

# 2. Get template info
framework templates info saas

# 3. Create project
framework export saas ./my-app --auth supabase

# 4. Install dependencies
cd my-app && npm install

# 5. Start development
npm run dev
```

### Deployment Workflow

```bash
# 1. Setup credentials (one-time)
framework deploy:auth save vercel YOUR_TOKEN

# 2. Test deployment
framework deploy --dry-run

# 3. Deploy to preview
framework deploy

# 4. Deploy to production
framework deploy --prod
```

### Plugin Workflow

```bash
# 1. Add plugin
framework plugin add ./my-plugin.mjs

# 2. Verify installation
framework plugin list

# 3. Export project (plugin runs automatically)
framework export saas ./my-app

# 4. Remove plugin
framework plugin remove my-plugin
```

### Safety Workflow

```bash
# 1. Create checkpoint before changes
framework checkpoint create "before adding payments"

# 2. Make changes
# ... edit code ...

# 3. If something breaks, restore
framework checkpoint restore <id>

# 4. Or continue and clean up old checkpoints
framework checkpoint cleanup
```

## Tips & Tricks

### Aliases

Create shell aliases for common commands:

```bash
# Add to ~/.bashrc or ~/.zshrc
alias fw='framework'
alias fwe='framework export'
alias fwd='framework deploy'
alias fwt='framework templates'
```

### Tab Completion

Enable tab completion (coming soon):

```bash
framework completion bash >> ~/.bashrc
```

### Chaining Commands

Use `&&` to chain commands:

```bash
framework export saas ./my-app --auth supabase && \
  cd my-app && \
  npm install && \
  npm run dev
```

### Default Template

Set a default template source:

```bash
export FRAMEWORK_TEMPLATE_SOURCE=local
```

### Quiet Mode for CI/CD

Suppress output in CI/CD:

```bash
FRAMEWORK_QUIET=true framework deploy --prod
```

## Troubleshooting

### Command Not Found

```bash
# Verify installation
which framework

# Reinstall if needed
npm install -g @jrdaws/framework
```

### Permission Errors

```bash
# Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Outdated Version

```bash
# Check version
framework version

# Update to latest
framework upgrade

# Or manually
npm update -g @jrdaws/framework
```

## Next Steps

Explore specific commands:

- **[Export Command →](export.md)** - Create projects from templates
- **[Deploy Command →](deploy.md)** - Deploy to production
- **[Templates Command →](templates.md)** - Browse templates
- **[Plugin Command →](plugin.md)** - Manage plugins

Or explore guides:

- **[Getting Started →](../getting-started/README.md)** - First steps
- **[Deployment Guide →](../deploy/README.md)** - Production deployment
- **[Plugin API →](../PLUGIN_API.md)** - Create plugins
