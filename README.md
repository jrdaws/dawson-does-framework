# Dawson Does Framework

**Ship production-ready apps faster with AI-native templates and one-command deployments.**

Transform ideas into deployed applications in minutes, not days. The Dawson Does Framework combines production-ready templates, powerful integrations, and intelligent automation to accelerate your development workflow.

[![npm version](https://badge.fury.io/js/@jrdaws%2Fframework.svg)](https://www.npmjs.com/package/@jrdaws/framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Quick Start

```bash
# Install globally
npm install -g @jrdaws/framework

# Create a new SaaS app
framework export saas ./my-app --auth supabase --payments stripe

# Start developing
cd my-app && npm install && npm run dev

# Deploy to production
framework deploy --prod
```

**That's it.** You now have a production-ready SaaS application with authentication, payments, and database - deployed and live.

---

## Key Features

### 🎯 **Production Templates**

Choose from battle-tested templates built for real applications:

- **SaaS Starter** - Full-stack with auth, billing, database, and AI
- **Dashboard** - Admin panel with data tables, charts, and user management
- **Landing Page** - High-converting marketing pages with analytics
- **Blog** - Content-focused sites with SEO and RSS
- **SEO Directory** - Optimized directory sites with search and filtering

```bash
framework templates list           # Browse all templates
framework templates search "blog"  # Find templates
framework export saas ./my-app     # Create from template
```

[View all templates →](docs/templates/README.md)

### 🔌 **Powerful Integrations**

Compose your stack with 7 integration categories and 15+ providers:

| Category | Providers | Purpose |
|----------|-----------|---------|
| **Auth** | Supabase, Clerk | User authentication & sessions |
| **Payments** | Stripe, Paddle | Subscriptions & billing |
| **Database** | Supabase, PlanetScale | Data storage & queries |
| **Email** | Resend, SendGrid | Transactional emails |
| **AI** | OpenAI, Anthropic | GPT-4, Claude integration |
| **Analytics** | PostHog, Plausible | User tracking & insights |
| **Storage** | Supabase, S3, Cloudinary | File & asset storage |

```bash
# Add integrations during export
framework export saas ./my-app \
  --auth supabase \
  --payments stripe \
  --email resend \
  --ai anthropic

# Or configure visually at dawson.dev, then pull
framework pull <your-token> --cursor --open
```

[Integration guides →](docs/integrations/README.md)

### 🚀 **One-Command Deploy**

Deploy to Vercel, Netlify, or Railway with automatic detection:

```bash
framework deploy          # Auto-detect and deploy
framework deploy --prod   # Deploy to production
```

The framework automatically:
- Detects your deployment provider
- Validates credentials securely
- Streams real-time build logs
- Returns your live URL

[Deployment guide →](docs/deploy/README.md)

### 🧩 **Extensible Plugin System**

Hook into any lifecycle event to customize behavior:

```javascript
// my-plugin.mjs
export default {
  name: "my-plugin",
  version: "1.0.0",
  hooks: {
    "post:export": async (context) => {
      console.log(`✅ Created ${context.projectName}`);
      return { success: true };
    }
  }
};
```

```bash
framework plugin add ./my-plugin.mjs
framework export saas ./my-app  # Plugin runs automatically
```

[Plugin API →](docs/PLUGIN_API.md)

### 🤖 **AI-Native Development**

Built for AI-assisted development with Cursor, Claude, and other AI coding tools:

```bash
# Generate .cursorrules and START_PROMPT.md for AI context
framework pull <token> --cursor --open

# AI agent safety with checkpoints
framework checkpoint create "before major refactor"
framework checkpoint restore <id>  # Rollback if needed

# Drift detection
framework drift  # See changes from template
```

**The `--cursor` flag generates:**
- `.cursorrules` - Project-specific AI guidelines with tech stack, context, and best practices
- `START_PROMPT.md` - Ready-to-use prompt for onboarding AI assistants to your project

[AI features →](docs/concepts/agent-safety.md)

---

## Installation

### Global Install (Recommended)

```bash
npm install -g @jrdaws/framework
framework version
```

### One-Time Use

```bash
npx @jrdaws/framework export saas ./my-app
```

### Requirements

- Node.js 18+
- npm or yarn
- Git (for repository initialization)

---

## Documentation

### Getting Started
- [Installation](docs/getting-started/installation.md)
- [Your First Project](docs/getting-started/first-project.md)
- [Project Structure](docs/getting-started/project-structure.md)

### CLI Reference
- [Commands Overview](docs/cli/README.md)
- [`framework export`](docs/cli/export.md) - Create projects from templates
- [`framework pull`](docs/cli/pull.md) - Pull from web configurator
- [`framework deploy`](docs/cli/deploy.md) - Deploy to production
- [`framework templates`](docs/cli/templates.md) - Browse templates
- [`framework plugin`](docs/cli/plugin.md) - Manage plugins

### Guides
- [Templates](docs/templates/README.md) - Explore all templates
- [Integrations](docs/integrations/README.md) - Setup guides for all providers
- [Deployment](docs/deploy/README.md) - Deploy to Vercel, Netlify, Railway
- [Plugins](docs/PLUGIN_API.md) - Extend the framework
- [Template Registry](docs/TEMPLATE_REGISTRY.md) - Create & publish templates

### Advanced
- [Core Concepts](docs/concepts/README.md)
- [Architecture](docs/architecture/README.md)
- [AI Governance](docs/AI_GOVERNANCE.md)
- [Framework Map](FRAMEWORK_MAP.md)

---

## Examples

### Create a SaaS App

```bash
# Full-stack SaaS with all features
framework export saas ./my-saas \
  --auth supabase \
  --payments stripe \
  --email resend \
  --ai anthropic \
  --analytics posthog

cd my-saas
npm install
npm run dev
```

### Create a Blog

```bash
# Content-focused blog
framework export blog ./my-blog

cd my-blog
npm install
npm run dev
```

### Pull from Web Configurator

The web configurator at [dawson.dev](https://dawson.dev) lets you visually design your project. Once configured, pull it locally with a single command.

```bash
# Basic pull - downloads project to default directory
framework pull swift-eagle-1234

# Pull to specific directory
framework pull swift-eagle-1234 ./my-project

# Pull with Cursor AI setup (generates .cursorrules and START_PROMPT.md)
framework pull swift-eagle-1234 --cursor

# Pull and open in Cursor immediately
framework pull swift-eagle-1234 --cursor --open

# Preview what will be downloaded (dry run)
framework pull swift-eagle-1234 --dry-run

# Force overwrite existing directory
framework pull swift-eagle-1234 ./existing-project --force
```

**What gets created:**
- Complete Next.js project with your selected template
- All configured integrations (auth, payments, etc.)
- `.env.example` with all required environment variables
- `.env.local` with any values you provided
- Project context files in `.dd/` (vision, mission, success criteria)
- `.cursorrules` and `START_PROMPT.md` (with `--cursor` flag)
- Initialized git repository with initial commit

**After pulling:**
```bash
cd my-project
npm install
npm run dev
```

**Troubleshooting:**
- `Token not found` - Check the token is correct or hasn't expired (30-day expiry)
- `Directory exists` - Use `--force` to overwrite, or choose different directory
- `Network error` - Use `--dev` flag to test against localhost:3002

### Deploy to Production

```bash
# Setup credentials (one-time)
framework deploy:auth save vercel YOUR_TOKEN

# Deploy
cd my-app
framework deploy --prod
```

---

## Why Dawson Does Framework?

### 1. Speed

Go from idea to deployed app in minutes, not days. Pre-configured templates eliminate boilerplate setup.

### 2. Quality

Battle-tested templates with best practices baked in: TypeScript, ESLint, proper error handling, security patterns.

### 3. Flexibility

Mix and match integrations. Swap Supabase for Clerk. Use Stripe or Paddle. OpenAI or Anthropic. Your stack, your choice.

### 4. AI-First

Built for AI-assisted development. Cursor integration, agent safety, drift detection, and recovery guidance.

### 5. Production-Ready

Not toy examples. Real templates with auth, billing, databases, email, AI - everything you need to launch.

---

## Ecosystem

- **CLI** - Command-line tool (this repository)
- **Web Configurator** - Visual project builder at [dawson.dev](https://dawson.dev)
- **Template Registry** - Discover and publish templates
- **Plugin Marketplace** - Coming soon

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](docs/architecture/contributing.md) for guidelines.

### Development

```bash
# Clone repository
git clone https://github.com/jrdaws/framework.git
cd framework

# Install dependencies
npm install

# Run tests
npm test

# Test CLI locally
npm link
framework version
```

### Creating Templates

Templates are stored in `/templates`. See [Template Registry](docs/TEMPLATE_REGISTRY.md) for the creation guide.

---

## Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/jrdaws/framework/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jrdaws/framework/discussions)
- **Updates**: Follow [@jrdaws](https://twitter.com/jrdaws) on Twitter

---

## Roadmap

- [ ] Additional templates (e-commerce, mobile app, Chrome extension)
- [ ] More integration providers
- [ ] Plugin marketplace
- [ ] Visual project configurator enhancements
- [ ] Team collaboration features
- [ ] Custom domain management
- [ ] Deployment analytics

See [ROADMAP.md](docs/ROADMAP.md) for details.

---

## License

MIT © [Joseph Dawson](https://github.com/jrdaws)

See [LICENSE](LICENSE) for details.

---

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [Stripe](https://stripe.com/) - Payment processing
- [Vercel](https://vercel.com/) - Deployment platform
- [Anthropic](https://anthropic.com/) - AI models

Special thanks to the open source community.

---

**Ready to ship?**

```bash
npm install -g @jrdaws/framework
framework export saas ./my-app
cd my-app && npm install && npm run dev
```

[Get Started →](docs/getting-started/README.md) | [View Templates →](docs/templates/README.md) | [Deploy Guide →](docs/deploy/README.md)
