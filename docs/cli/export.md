# framework export

Create a new project from a template.

## Synopsis

```bash
framework export <template> <directory> [options]
```

## Description

The `export` command creates a new project from a template. It clones the template, applies integrations, creates a manifest, and initializes a git repository.

This is the primary way to create new projects with the framework.

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `template` | Template ID or path | Yes |
| `directory` | Output directory | Yes |

## Options

### Project Configuration

| Option | Description | Default |
|--------|-------------|---------|
| `--name <name>` | Project name | Directory name |
| `--template-source <source>` | Template source (local/remote/auto) | `auto` |
| `--framework-version <version>` | Framework version to use | `latest` |

### Integration Options

| Option | Description |
|--------|-------------|
| `--auth <provider>` | Auth provider (supabase, clerk) |
| `--payments <provider>` | Payments provider (stripe, paddle) |
| `--db <provider>` | Database provider (supabase, planetscale) |
| `--email <provider>` | Email provider (resend, sendgrid) |
| `--ai <provider>` | AI provider (openai, anthropic) |
| `--analytics <provider>` | Analytics provider (posthog, plausible) |
| `--storage <provider>` | Storage provider (supabase, s3, cloudinary) |

### Git Options

| Option | Description |
|--------|-------------|
| `--remote <url>` | Git remote URL |
| `--push` | Push to remote after init |
| `--branch <name>` | Branch name (default: main) |

### Control Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Preview without creating files |
| `--force` | Overwrite existing directory |
| `--quiet` | Suppress output |

## Examples

### Basic Usage

Create a SaaS app:

```bash
framework export saas ./my-saas-app
```

**Output:**
```
🎯 Framework Export

📦 Resolving template...
   ✓ Template resolved: saas

📦 Cloning template...
   ✓ Template cloned

📝 Writing manifest...
   ✓ Manifest created

✅ Export complete!

Next steps:
  cd my-saas-app
  npm install
  npm run dev
```

### With Integrations

Create app with auth and payments:

```bash
framework export saas ./my-app \
  --auth supabase \
  --payments stripe \
  --email resend
```

**Output:**
```
🎯 Framework Export

📦 Cloning template...
   ✓ Template cloned: saas

🔌 Validating integrations...
   ✓ Integration valid: auth.supabase
   ✓ Integration valid: payments.stripe
   ✓ Integration valid: email.resend

🔌 Applying integrations...
   ✓ Integration applied: auth.supabase
   ✓ Integration applied: payments.stripe
   ✓ Integration applied: email.resend

📝 Writing manifest...
   ✓ Manifest created

✅ Export complete!
```

### Full-Stack App

Create a complete app with all integrations:

```bash
framework export saas ./my-app \
  --auth supabase \
  --payments stripe \
  --db supabase \
  --email resend \
  --ai anthropic \
  --analytics posthog \
  --storage supabase
```

### With Git Remote

Create and push to GitHub:

```bash
framework export saas ./my-app \
  --auth supabase \
  --remote git@github.com:username/my-app.git \
  --push
```

### Different Template Sources

**Local template:**

```bash
framework export saas ./my-app --template-source local
```

**Remote template (GitHub):**

```bash
framework export saas ./my-app --template-source remote
```

**Custom template:**

```bash
framework export github:username/repo/templates/custom ./my-app
```

### Dry Run

Preview what will be created:

```bash
framework export saas ./my-app --dry-run
```

**Output:**
```
📋 DRY RUN - Export Preview

Template: saas
Directory: ./my-app
Integrations: none

Actions that would be performed:
  1. Clone template from remote
  2. Create project directory
  3. Copy template files
  4. Create manifest.json
  5. Initialize git repository

Run without --dry-run to execute
```

### Force Overwrite

Overwrite existing directory:

```bash
framework export saas ./existing-app --force
```

**Warning:** This will delete the existing directory!

## Template Sources

### Built-in Templates

Available templates:

- `saas` - Full-stack SaaS with auth, billing, database
- `dashboard` - Admin dashboard with data tables and charts
- `landing-page` - Marketing landing page
- `blog` - Blog with content management
- `seo-directory` - SEO-optimized directory site

List all templates:

```bash
framework templates list
```

### Remote Templates

Use templates from GitHub:

```bash
# Official templates
framework export saas ./my-app

# Custom template from GitHub
framework export github:user/repo/path/to/template ./my-app

# With version
framework export saas@1.0.0 ./my-app
```

### Local Templates

Use local template directory:

```bash
framework export /path/to/template ./my-app
```

## Integration Details

### Authentication

**Supabase:**
```bash
framework export saas ./my-app --auth supabase
```

Adds:
- Auth middleware
- Login/signup pages
- Auth components
- Session management

**Clerk:**
```bash
framework export saas ./my-app --auth clerk
```

Adds:
- Clerk provider
- Pre-built auth UI
- User management

### Payments

**Stripe:**
```bash
framework export saas ./my-app --payments stripe
```

Adds:
- Stripe client
- Checkout flow
- Webhook handlers
- Customer portal

**Paddle:**
```bash
framework export saas ./my-app --payments paddle
```

Adds:
- Paddle integration
- Subscription management
- License validation

### Database

**Supabase:**
```bash
framework export saas ./my-app --db supabase
```

Adds:
- Supabase client
- Database utilities
- Type definitions

**PlanetScale:**
```bash
framework export saas ./my-app --db planetscale
```

Adds:
- PlanetScale client
- Migration tools
- Connection pooling

### Email

**Resend:**
```bash
framework export saas ./my-app --email resend
```

Adds:
- Resend client
- Email templates
- React Email components

**SendGrid:**
```bash
framework export saas ./my-app --email sendgrid
```

Adds:
- SendGrid client
- Template system
- Batch sending

### AI

**OpenAI:**
```bash
framework export saas ./my-app --ai openai
```

Adds:
- OpenAI client
- Chat completions
- Streaming support

**Anthropic:**
```bash
framework export saas ./my-app --ai anthropic
```

Adds:
- Anthropic client
- Claude integration
- Streaming support

### Analytics

**PostHog:**
```bash
framework export saas ./my-app --analytics posthog
```

Adds:
- PostHog client
- Event tracking
- Feature flags

**Plausible:**
```bash
framework export saas ./my-app --analytics plausible
```

Adds:
- Plausible script
- Privacy-focused tracking

### Storage

**Supabase Storage:**
```bash
framework export saas ./my-app --storage supabase
```

Adds:
- Storage client
- Upload components
- File management

**S3:**
```bash
framework export saas ./my-app --storage s3
```

Adds:
- S3 client
- Upload utilities
- Signed URLs

## Project Structure

After export, your project will have this structure:

```
my-app/
├── app/                  # Next.js App Router
├── components/           # React components
├── lib/                  # Utility libraries
├── public/               # Static assets
├── .dd/                  # Framework files
│   ├── manifest.json    # Project manifest
│   └── config.json      # Configuration
├── .env.example         # Environment template
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies
├── next.config.js       # Next.js config
├── tailwind.config.ts   # Tailwind config
└── tsconfig.json        # TypeScript config
```

## Manifest File

The manifest tracks template version and changes:

```json
{
  "templateId": "saas",
  "version": "1.0.0",
  "createdAt": "2025-01-20T10:00:00Z",
  "integrations": [
    "auth.supabase",
    "payments.stripe"
  ],
  "files": {
    "app/page.tsx": "sha256:abc123...",
    "components/ui/button.tsx": "sha256:def456..."
  }
}
```

Used for drift detection:

```bash
framework drift
```

## Plugin Hooks

Plugins can hook into the export process:

- `pre:export` - Before export starts
- `pre:export:clone` - Before cloning template
- `post:export:clone` - After cloning template
- `post:export` - After export completes

See [Plugin API](../PLUGIN_API.md) for details.

## Common Issues

### Template Not Found

**Error:**
```
❌ Template not found: invalid-template
```

**Solution:**
```bash
# List available templates
framework templates list

# Search for templates
framework templates search "your search"
```

### Directory Already Exists

**Error:**
```
❌ Directory already exists: ./my-app
```

**Solutions:**

1. Choose a different directory:
   ```bash
   framework export saas ./my-app-2
   ```

2. Force overwrite (deletes existing):
   ```bash
   framework export saas ./my-app --force
   ```

3. Remove directory manually:
   ```bash
   rm -rf ./my-app
   framework export saas ./my-app
   ```

### Invalid Integration

**Error:**
```
❌ Integration not supported: payments.invalid
```

**Solution:**
```bash
# Check supported integrations
framework templates info saas

# Use valid integration
framework export saas ./my-app --payments stripe
```

### Permission Denied

**Error:**
```
❌ Permission denied: cannot create directory
```

**Solution:**
```bash
# Check directory permissions
ls -la ./

# Use a directory you have access to
framework export saas ~/my-app
```

## Environment Variables

These variables affect the export command:

| Variable | Description | Default |
|----------|-------------|---------|
| `FRAMEWORK_TEMPLATE_SOURCE` | Default template source | `auto` |
| `FRAMEWORK_QUIET` | Suppress output | `false` |
| `GITHUB_TOKEN` | GitHub token for private templates | - |

**Example:**

```bash
# Use local templates by default
export FRAMEWORK_TEMPLATE_SOURCE=local
framework export saas ./my-app

# Quiet mode
FRAMEWORK_QUIET=true framework export saas ./my-app
```

## Next Steps

After exporting a project:

1. **Install dependencies:**
   ```bash
   cd my-app
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **Deploy:**
   ```bash
   framework deploy
   ```

## Related Commands

- [`framework pull`](pull.md) - Pull from web configurator
- [`framework templates`](templates.md) - Browse templates
- [`framework deploy`](deploy.md) - Deploy to production

## See Also

- [Getting Started Guide](../getting-started/README.md)
- [Template Documentation](../templates/README.md)
- [Integration Guides](../integrations/README.md)
- [Plugin API](../PLUGIN_API.md)
