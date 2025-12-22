# framework pull

Pull projects from the web configurator.

## Synopsis

```bash
framework pull <token> [output-dir] [options]
```

## Description

The `pull` command downloads a project configured on the web platform at [dawson.dev](https://dawson.dev). It fetches the configuration, applies integrations, and optionally generates AI context files.

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `token` | Project token from web configurator | Yes |
| `output-dir` | Output directory | No (defaults to project name) |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--cursor` | Generate .cursorrules and AI context | `false` |
| `--open` | Open in Cursor after pulling | `false` |
| `--dry-run` | Preview without creating files | `false` |
| `--force` | Overwrite existing directory | `false` |
| `--dev` | Use localhost API (development) | `false` |

## Examples

### Basic Usage

Pull project with token:

```bash
framework pull abc123xyz
```

**Output:**
```
🎯 Framework Pull

📡 Fetching project configuration...
   ✓ Project found: my-saas-app

📦 Exporting template...
   ✓ Template exported: saas

🔌 Applying integrations...
   ✓ Integration applied: auth.supabase
   ✓ Integration applied: payments.stripe

📝 Generating .env files...
   ✓ Created .env.example
   ✓ Created .env.local

✅ Pull complete!

Next steps:
  cd my-saas-app
  npm install
  npm run dev
```

### With Cursor Integration

Generate Cursor-specific files:

```bash
framework pull abc123xyz --cursor
```

**This creates:**
- `.cursorrules` - Rules for Cursor AI
- `.dd/START_PROMPT.md` - Project context for AI
- `.dd/vision.md` - Project vision
- `.dd/mission.md` - Project goals
- `.dd/success-criteria.md` - Success metrics

**Output:**
```
🎯 Framework Pull

📡 Fetching project configuration...
   ✓ Project found: my-saas-app

📦 Exporting template...
   ✓ Template exported: saas

🔌 Applying integrations...
   ✓ Integration applied: auth.supabase
   ✓ Integration applied: payments.stripe

🤖 Generating Cursor context...
   ✓ Created .cursorrules
   ✓ Created START_PROMPT.md
   ✓ Created vision.md
   ✓ Created mission.md
   ✓ Created success-criteria.md

✅ Pull complete!
```

### Open in Cursor

Pull and automatically open:

```bash
framework pull abc123xyz --cursor --open
```

This pulls the project, generates Cursor files, and opens the project in Cursor.

### Specify Output Directory

```bash
framework pull abc123xyz ./my-custom-dir
```

### Dry Run

Preview what will be pulled:

```bash
framework pull abc123xyz --dry-run
```

**Output:**
```
📋 DRY RUN - Pull Preview

Token: abc123xyz
API: https://dawson.dev/api

Project configuration:
  Template: saas
  Name: my-saas-app
  Integrations:
    - auth.supabase
    - payments.stripe

Actions that would be performed:
  1. Fetch project configuration
  2. Export template: saas
  3. Apply integrations
  4. Generate environment files
  5. Create project directory

Run without --dry-run to execute
```

## Web Configurator Workflow

### 1. Configure on Web

1. Go to [dawson.dev](https://dawson.dev)
2. Select a template
3. Choose integrations
4. Set project vision and goals
5. Click "Generate Project"
6. Copy the project token

### 2. Pull Locally

```bash
framework pull <your-token> --cursor --open
```

### 3. Start Developing

```bash
npm install
npm run dev
```

## Generated Files

### Environment Files

**`.env.example`** - Template with required variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

**`.env.local`** - Pre-filled with project values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Cursor Files (with --cursor)

**`.cursorrules`** - AI coding rules:

```
You are helping build a SaaS application.

Project: my-saas-app
Template: saas
Integrations: Supabase Auth, Stripe Payments

Tech Stack:
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Supabase for backend
- Stripe for payments

Rules:
- Use TypeScript for all code
- Follow Next.js App Router patterns
- Use Server Components by default
- Handle errors gracefully
- Write tests for critical paths
```

**`.dd/START_PROMPT.md`** - Initial prompt for AI:

```markdown
# Project Context

Building: my-saas-app
Template: SaaS Starter
Goal: Create a subscription-based SaaS application

## Vision
[Your vision from web configurator]

## Features
- User authentication
- Subscription billing
- Database integration
- Responsive UI

## Next Steps
1. Set up authentication flow
2. Implement billing
3. Create dashboard
4. Add core features
```

**`.dd/vision.md`** - Project vision

**`.dd/mission.md`** - Project mission

**`.dd/success-criteria.md`** - Success metrics

## Project Structure

After pulling, your project will have:

```
my-saas-app/
├── app/                     # Next.js App Router
├── components/              # React components
├── lib/                     # Utilities
├── .dd/                     # Framework files
│   ├── manifest.json       # Project manifest
│   ├── config.json         # Configuration
│   ├── vision.md          # Project vision (with --cursor)
│   ├── mission.md         # Project mission (with --cursor)
│   ├── success-criteria.md # Success metrics (with --cursor)
│   └── START_PROMPT.md    # AI context (with --cursor)
├── .cursorrules            # Cursor AI rules (with --cursor)
├── .env.example            # Environment template
├── .env.local              # Pre-filled environment
├── package.json            # Dependencies
└── ...
```

## Common Issues

### Invalid Token

**Error:**
```
❌ Project not found: invalid-token
```

**Solutions:**
1. Check token is correct (copy from web)
2. Token may have expired - generate new one
3. Try with `--dev` flag if testing locally

### Network Error

**Error:**
```
❌ Failed to fetch project: Network error
```

**Solutions:**
1. Check internet connection
2. Verify API is accessible
3. Try again in a few moments

### Directory Exists

**Error:**
```
❌ Directory already exists: ./my-app
```

**Solutions:**
1. Use different output directory
2. Use `--force` to overwrite (destructive!)
3. Remove existing directory

## CI/CD Integration

### GitHub Actions

```yaml
name: Setup Project

on:
  workflow_dispatch:
    inputs:
      token:
        description: 'Project token'
        required: true

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install framework
        run: npm install -g @jrdaws/framework

      - name: Pull project
        run: framework pull ${{ github.event.inputs.token }}

      - name: Install dependencies
        run: |
          cd $(ls -d */ | head -1)
          npm install

      - name: Commit to repo
        run: |
          git add .
          git commit -m "Initialize project"
          git push
```

## Next Steps

After pulling a project:

1. **Install dependencies:**
   ```bash
   cd my-app
   npm install
   ```

2. **Review environment variables:**
   ```bash
   cat .env.local
   # Update any missing values
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **If using Cursor:**
   - Project should already be open
   - Review `.cursorrules`
   - Read `START_PROMPT.md`
   - Start coding with AI assistance

## Related Commands

- [`framework export`](export.md) - Create from template directly
- [`framework deploy`](deploy.md) - Deploy to production

## See Also

- [Getting Started](../getting-started/README.md) - First steps
- [Web Configurator Guide](../guides/web-configurator.md) - Using dawson.dev
- [Cursor Integration](../guides/cursor-integration.md) - AI-assisted development
