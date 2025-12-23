# Quick Start Guide

> **Version**: 1.0 | **Last Updated**: 2025-12-22
>
> Get from zero to a running app in minutes.

---

## What is Dawson Does Framework?

A platform for building production-ready web applications with:
- **5 templates**: SaaS, Dashboard, Blog, Landing Page, SEO Directory
- **15+ integrations**: Auth, Payments, Database, Email, AI, Analytics, Storage
- **AI-native**: Built for Cursor and Claude-assisted development
- **Zero lock-in**: Export complete local projects you own entirely

**Choose your path:**

| Path | Time | Best For |
|------|------|----------|
| [CLI Export](#option-1-cli-export-fastest) | ~2 min | Developers who know what they want |
| [Web Configurator](#option-2-web-configurator-visual) | ~5 min | Visual configuration and AI generation |
| [AI Description](#option-3-ai-description-guided) | ~10 min | Describe your app in natural language |

---

## Option 1: CLI Export (Fastest)

**Perfect for:** Developers who want to get started immediately.

### Step 1: Create Your Project

```bash
# Create a SaaS app with auth and payments
npx @jrdaws/framework export saas ./my-app --auth supabase --payments stripe
```

### Step 2: Install & Run

```bash
cd my-app
npm install
npm run dev
```

### Step 3: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit with your API keys
# Get Supabase keys: https://supabase.com/dashboard
# Get Stripe keys: https://dashboard.stripe.com/apikeys
```

**That's it!** Open [http://localhost:3000](http://localhost:3000) to see your app.

### Available Templates

```bash
# List all templates
npx @jrdaws/framework templates list

# SaaS (full-stack with auth, billing, database)
npx @jrdaws/framework export saas ./my-app

# Dashboard (admin panel with charts and tables)
npx @jrdaws/framework export dashboard ./my-app

# Blog (content site with SEO)
npx @jrdaws/framework export blog ./my-app

# Landing Page (marketing page)
npx @jrdaws/framework export landing-page ./my-app

# SEO Directory (searchable directory site)
npx @jrdaws/framework export seo-directory ./my-app
```

### Available Integrations

Add integrations with flags:

```bash
npx @jrdaws/framework export saas ./my-app \
  --auth supabase \
  --payments stripe \
  --email resend \
  --ai anthropic \
  --analytics posthog \
  --storage supabase
```

| Category | Providers |
|----------|-----------|
| Auth | `supabase`, `clerk` |
| Payments | `stripe`, `paddle` |
| Database | `supabase`, `planetscale` |
| Email | `resend`, `sendgrid` |
| AI | `openai`, `anthropic` |
| Analytics | `posthog`, `plausible` |
| Storage | `supabase`, `s3`, `cloudinary` |

---

## Option 2: Web Configurator (Visual)

**Perfect for:** Visual configuration and exploring options.

### Step 1: Open the Configurator

Visit [dawson.dev/configure](https://dawson.dev/configure)

### Step 2: Configure Your Project

1. **Choose a template** - Select from SaaS, Dashboard, Blog, etc.
2. **Add inspiration** (optional) - Upload screenshots or describe your vision
3. **Set project details** - Name and output directory
4. **Select integrations** - Pick your auth, payments, database, etc.
5. **Add API keys** (optional) - Pre-fill environment variables
6. **Preview with AI** (optional) - See an AI-generated preview
7. **Add context** (optional) - Define vision, mission, success criteria

### Step 3: Export Your Project

On the final step, you'll see options:

**Option A: Copy CLI Command**
```bash
# Copy the generated command and run it locally
npx @jrdaws/framework export saas ./my-app --auth supabase --payments stripe
```

**Option B: Save & Pull**
1. Click "Save Project" to get a token
2. Pull locally:
```bash
npx @jrdaws/framework pull <your-token> --cursor --open
```

The `--cursor` flag generates AI context files:
- `.cursorrules` - AI coding guidelines
- `START_PROMPT.md` - Ready-to-use prompt for Claude

### Step 4: Install & Run

```bash
cd my-app
npm install
npm run dev
```

---

## Option 3: AI Description (Guided)

**Perfect for:** When you have an idea but want AI to help architect it.

### Step 1: Open the Configurator

Visit [dawson.dev/configure](https://dawson.dev/configure)

### Step 2: Describe Your App

1. Choose a template as your starting point
2. On the **Inspiration** step, describe your app:

> "I want to build a project management tool for small teams. Users should be able to create projects, add tasks, invite team members, and track progress. I need authentication, a dashboard with charts, and email notifications."

3. Optionally upload screenshots of apps you like for inspiration

### Step 3: Use AI Generation

On the **AI Preview** step:

1. Switch to "Full Project Generator" tab
2. Choose your model quality:
   - ⚡ **Fast** (~$0.02) - Quickest generation
   - ⚖️ **Balanced** (~$0.08) - Best value (recommended)
   - ✨ **Quality** (~$0.18) - Most reliable for complex projects
3. Click "Generate" to have AI create:
   - Custom components
   - Database schemas
   - API routes
   - Page layouts

### Step 4: Export & Run

Save the project and pull it locally:

```bash
npx @jrdaws/framework pull <your-token> --cursor --open
cd my-app
npm install
npm run dev
```

---

## What You Get

Every exported project includes:

```
my-app/
├── app/                    # Next.js 15 App Router
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── api/               # API routes
├── components/             # React components
├── lib/                    # Utility functions
├── integrations/           # Your selected integrations
│   ├── auth/              # Authentication setup
│   ├── payments/          # Payment handling
│   └── ...
├── .dd/                    # Framework metadata
│   └── manifest.json      # Project manifest
├── .env.example           # Required environment variables
├── .env.local             # Your API keys (gitignored)
├── .cursorrules           # AI coding guidelines (with --cursor)
├── START_PROMPT.md        # AI onboarding prompt (with --cursor)
├── package.json           # Dependencies
├── tailwind.config.ts     # Tailwind CSS config
└── tsconfig.json          # TypeScript config
```

**Tech Stack:**
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Your chosen integrations

---

## Next Steps

### 1. Configure Your Environment

Get API keys from your integration providers:

| Integration | Where to Get Keys |
|------------|-------------------|
| Supabase | [supabase.com/dashboard](https://supabase.com/dashboard) |
| Clerk | [dashboard.clerk.com](https://dashboard.clerk.com) |
| Stripe | [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) |
| Resend | [resend.com/api-keys](https://resend.com/api-keys) |
| OpenAI | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| Anthropic | [console.anthropic.com](https://console.anthropic.com) |
| PostHog | [posthog.com/project/settings](https://posthog.com/project/settings) |

### 2. Start Development with AI

If you used `--cursor`, open the project in Cursor:

```bash
cursor my-app
```

Then start a new chat and paste the contents of `START_PROMPT.md` to give Claude full project context.

### 3. Customize Your App

- Modify `app/page.tsx` for your home page
- Add new routes in `app/`
- Create components in `components/`
- Add API endpoints in `app/api/`

### 4. Deploy to Production

```bash
# Set up Vercel token (one-time)
npx @jrdaws/framework deploy:auth save vercel YOUR_VERCEL_TOKEN

# Deploy
npx @jrdaws/framework deploy --prod
```

---

## Troubleshooting

### "Template not found"

```bash
# List available templates
npx @jrdaws/framework templates list
```

### "Directory already exists"

```bash
# Use a different name
npx @jrdaws/framework export saas ./my-app-2

# Or force overwrite (⚠️ deletes existing)
npx @jrdaws/framework export saas ./my-app --force
```

### "Token not found" (when pulling)

- Check the token is correct (copy from web)
- Tokens expire after 30 days - generate a new one

### "Network error"

- Check your internet connection
- Try again in a few moments

### Missing dependencies after pull

```bash
cd my-app
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use

```bash
# Use a different port
npm run dev -- -p 3001
```

---

## Learn More

- [CLI Reference](../cli/README.md) - All CLI commands
- [Templates Guide](../templates/README.md) - Detailed template documentation
- [Integrations Guide](../integrations/README.md) - Integration setup guides
- [Deployment Guide](../deploy/README.md) - Deploy to Vercel, Netlify, Railway
- [Plugin System](../PLUGIN_API.md) - Extend the framework

---

## Get Help

- **Documentation**: [docs/](../)
- **GitHub Issues**: [github.com/jrdaws/framework/issues](https://github.com/jrdaws/framework/issues)
- **GitHub Discussions**: [github.com/jrdaws/framework/discussions](https://github.com/jrdaws/framework/discussions)

---

*Happy shipping! 🚀*

