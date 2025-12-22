# Getting Started

Go from zero to a deployed production app in 10 minutes.

## What You'll Build

By the end of this guide, you'll have:

- ✅ A production-ready SaaS application
- ✅ User authentication with Supabase
- ✅ Payment processing with Stripe
- ✅ Database with Supabase Postgres
- ✅ Deployed to Vercel

**Time required:** 10 minutes

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Code editor** - VS Code, Cursor, or similar

**Optional accounts** (for full features):
- [Supabase](https://supabase.com/) - For auth & database
- [Stripe](https://stripe.com/) - For payments
- [Vercel](https://vercel.com/) - For deployment

## Quick Start (3 Steps)

### Step 1: Install the Framework

```bash
npm install -g @jrdaws/framework
```

Verify installation:

```bash
framework version
```

**Expected output:**
```
v0.3.0
```

### Step 2: Create Your Project

```bash
framework export saas ./my-app --auth supabase --payments stripe
```

This command:
1. Clones the SaaS template
2. Sets up Supabase authentication
3. Configures Stripe payments
4. Initializes a git repository
5. Creates a project manifest

**Expected output:**
```
🎯 Framework Export

📦 Cloning template...
   ✓ Template cloned: saas

🔌 Applying integrations...
   ✓ Integration applied: auth.supabase
   ✓ Integration applied: payments.stripe

📝 Writing manifest...
   ✓ Manifest created: .dd/manifest.json

✅ Export complete!

Next steps:
  cd my-app
  npm install
  npm run dev
```

### Step 3: Start Development

```bash
cd my-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**You should see your app running!** 🎉

## What's Next?

Now that you have a running app, explore these guides:

### Learn the Basics

1. **[Project Structure](project-structure.md)** - Understand the files and folders
2. **[Configuration](configuration.md)** - Set up environment variables
3. **[Integrations](../integrations/README.md)** - Configure auth, payments, and more

### Deploy Your App

4. **[Deploy to Production](../deploy/README.md)** - Get your app live

### Customize Your App

5. **[Templates](../templates/README.md)** - Explore other templates
6. **[Plugins](../PLUGIN_API.md)** - Extend functionality

## Detailed Walkthrough

Want more details? Here's a step-by-step breakdown.

### 1. Installation Options

#### Global Install (Recommended)

Best for regular use:

```bash
npm install -g @jrdaws/framework
```

**Pros:**
- Fast: command available everywhere
- Simple: just type `framework`

**Cons:**
- Requires global npm permissions

#### One-Time Use

Best for trying it out:

```bash
npx @jrdaws/framework export saas ./my-app
```

**Pros:**
- No installation needed
- Always uses latest version

**Cons:**
- Slower (downloads each time)

#### Local Project Dependency

Best for team projects:

```bash
npm install --save-dev @jrdaws/framework
npx framework export saas ./my-app
```

**Pros:**
- Version locked in package.json
- Same version for all team members

**Cons:**
- Extra dependency in project

### 2. Choosing a Template

The framework includes 5 production templates:

| Template | Best For | Includes |
|----------|----------|----------|
| **saas** | SaaS products | Auth, billing, database, AI |
| **dashboard** | Admin panels | Data tables, charts, settings |
| **landing-page** | Marketing sites | Hero, pricing, testimonials |
| **blog** | Content sites | Posts, categories, RSS |
| **seo-directory** | Directory sites | Search, filtering, SEO |

**Browse all templates:**

```bash
framework templates list
```

**Search templates:**

```bash
framework templates search "blog"
```

**Get template info:**

```bash
framework templates info saas
```

### 3. Adding Integrations

Integrations add functionality to your app. Add them during export:

```bash
framework export saas ./my-app \
  --auth supabase \
  --payments stripe \
  --email resend \
  --ai anthropic \
  --analytics posthog
```

**Available integration categories:**

- **auth** - User authentication (supabase, clerk)
- **payments** - Billing (stripe, paddle)
- **db** - Database (supabase, planetscale)
- **email** - Transactional emails (resend, sendgrid)
- **ai** - AI models (openai, anthropic)
- **analytics** - User tracking (posthog, plausible)
- **storage** - File storage (supabase, s3, cloudinary)

See [Integration Guides](../integrations/README.md) for setup instructions.

### 4. Project Setup

After exporting, set up your project:

```bash
cd my-app

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your API keys to .env.local
# (See integration guides for how to get these)
```

**Example `.env.local`:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Other services...
```

### 5. Development Workflow

Start the development server:

```bash
npm run dev
```

**Available commands:**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Lint code |
| `npm run type-check` | Check TypeScript types |

**Development tips:**

- Changes auto-reload in the browser
- Check console for errors
- Use React DevTools for debugging
- TypeScript errors show in terminal

### 6. Making Your First Change

Let's edit the homepage:

1. Open `app/page.tsx`
2. Find the heading text
3. Change it to your app name
4. Save the file

The browser automatically reloads with your changes!

### 7. Understanding the Stack

Your new app uses:

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS
- **Supabase** - Backend (auth, database)
- **Stripe** - Payment processing
- **Vercel** - Deployment platform

All pre-configured and ready to use.

## Common First-Time Issues

### Issue: "command not found: framework"

**Solution:** Framework not installed globally

```bash
# Install globally
npm install -g @jrdaws/framework

# Or use npx
npx @jrdaws/framework version
```

### Issue: "Port 3000 already in use"

**Solution:** Another app is using port 3000

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Issue: "Module not found"

**Solution:** Dependencies not installed

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: ".env variables not loading"

**Solution:** Wrong env file name

Next.js uses `.env.local` (not `.env`):

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

## Using with AI Coding Tools

The framework is built for AI-assisted development.

### Cursor Integration

Generate Cursor rules and context:

```bash
framework pull <token> --cursor
```

This creates:
- `.cursorrules` - Rules for Cursor AI
- `.dd/START_PROMPT.md` - Project context
- `.dd/vision.md` - Project vision
- `.dd/mission.md` - Project goals

### AI Safety Features

**Checkpoints** - Save state before major changes:

```bash
framework checkpoint create "before adding payments"
framework checkpoint restore <id>  # Rollback if needed
```

**Drift Detection** - See changes from template:

```bash
framework drift
```

## Next Steps by Goal

Choose your path based on what you want to do:

### 🎨 I want to customize the design

1. [Project Structure](project-structure.md) - Understand the files
2. [Tailwind Docs](https://tailwindcss.com/docs) - CSS framework
3. Modify components in `app/` and `components/`

### 🔐 I want to add user authentication

1. [Supabase Auth Guide](../integrations/auth/supabase.md) - Setup auth
2. [Authentication Concepts](../concepts/authentication.md) - How it works
3. Add protected routes with middleware

### 💳 I want to add payments

1. [Stripe Guide](../integrations/payments/stripe.md) - Setup Stripe
2. [Payments Concepts](../concepts/payments.md) - How it works
3. Create pricing page and checkout flow

### 🚀 I want to deploy to production

1. [Deployment Guide](../deploy/README.md) - Deploy overview
2. [Vercel Deployment](../deploy/vercel.md) - Step-by-step
3. [Environment Variables](configuration.md) - Production config

### 🤖 I want to add AI features

1. [OpenAI Guide](../integrations/ai/openai.md) - Setup OpenAI
2. [Anthropic Guide](../integrations/ai/anthropic.md) - Setup Claude
3. Build AI-powered features

### 📊 I want to track analytics

1. [PostHog Guide](../integrations/analytics/posthog.md) - Setup PostHog
2. [Analytics Concepts](../concepts/analytics.md) - How it works
3. Add event tracking

## Learning Resources

### Official Docs

- [Framework Documentation](../README.md) - All framework docs
- [CLI Reference](../cli/README.md) - Command reference
- [API Reference](../api/README.md) - Programmatic API

### Video Tutorials

Coming soon! Subscribe for updates.

### Example Projects

- [SaaS Example](https://github.com/jrdaws/framework-examples/saas) - Full SaaS app
- [Blog Example](https://github.com/jrdaws/framework-examples/blog) - Content site
- [Dashboard Example](https://github.com/jrdaws/framework-examples/dashboard) - Admin panel

### Community

- [GitHub Discussions](https://github.com/jrdaws/framework/discussions) - Ask questions
- [GitHub Issues](https://github.com/jrdaws/framework/issues) - Report bugs
- [Twitter](https://twitter.com/jrdaws) - Updates

## Troubleshooting

Having issues? Check these resources:

1. [Common Issues](#common-first-time-issues) - Quick fixes above
2. [Deployment Troubleshooting](../deploy/troubleshooting.md) - Deploy issues
3. [GitHub Issues](https://github.com/jrdaws/framework/issues) - Known issues
4. [Ask for Help](https://github.com/jrdaws/framework/discussions) - Community support

## Summary

You've learned how to:

- ✅ Install the framework
- ✅ Create a new project
- ✅ Choose templates and integrations
- ✅ Set up your development environment
- ✅ Start building

**Next recommended reading:**

1. [Project Structure](project-structure.md) - Understand your project
2. [Configuration](configuration.md) - Set up environment variables
3. [Deploy Guide](../deploy/README.md) - Get your app live

**Ready to build?**

```bash
framework export saas ./my-app --auth supabase --payments stripe
cd my-app && npm install && npm run dev
```

Happy building! 🚀
