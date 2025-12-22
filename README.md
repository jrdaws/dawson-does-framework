# Dawson Does Framework

**Ship production-ready apps faster with AI-native templates and one-command deployments.**

Transform ideas into deployed applications in minutes, not days. The Dawson Does Framework combines production-ready templates, powerful integrations, and intelligent automation to accelerate your development workflow.

[![npm version](https://badge.fury.io/js/@jrdaws%2Fframework.svg)](https://www.npmjs.com/package/@jrdaws/framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🎯 Core Philosophy: Export-First, Zero Lock-In

**You own your code.** Every project exported from the framework is a complete, standalone application with no dependencies on our platform. Use our tools to accelerate development, but keep 100% ownership and control.

- **Export-First**: All features designed for local ownership
- **Zero Lock-In**: Platform is optional after export - delete it if you want
- **Cursor-Native**: Optimized for AI-assisted development with Claude Code and Cursor
- **Transparent**: No magic black boxes - you see and control everything
- **Production-Ready**: Real templates with auth, billing, databases - not toy examples

[Read our vision →](docs/VISION_MISSION.md)

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

# Or pull from web configurator (https://dawson.dev)
framework pull <token> --cursor --open
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
# Generate .cursorrules and context files
framework pull <token> --cursor

# AI agent safety with checkpoints
framework checkpoint create "before major refactor"
framework checkpoint restore <id>  # Rollback if needed

# Drift detection
framework drift  # See changes from template
```

[AI features →](docs/concepts/agent-safety.md)

---

## Architecture

The Dawson Does Framework is a **hybrid system** combining web-based configuration with local development:

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Configurator                         │
│              (https://dawson.dev)                           │
│  - Visual project builder                                    │
│  - AI code generation                                        │
│  - Real-time preview                                         │
│  - Configuration storage                                     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ framework pull <token>
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   CLI Tool                                   │
│              (npm package)                                   │
│  - Template export                                           │
│  - Integration merging                                       │
│  - Deployment automation                                     │
│  - Plugin system                                             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Generates
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              Your Local Project                              │
│           (100% Owned by You)                                │
│  - Full Next.js application                                  │
│  - All integrations configured                               │
│  - Git repository initialized                                │
│  - Ready to deploy                                           │
│  - NO platform dependencies                                  │
└─────────────────────────────────────────────────────────────┘
```

### Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **CLI** | Command-line tool for export, deploy, and management | `bin/framework.js`, `src/` |
| **Website** | Visual configurator and AI generation | `website/` |
| **Templates** | Production-ready starter projects | `templates/` |
| **Integrations** | Pre-configured provider integrations | `templates/*/integrations/` |
| **Packages** | Shared libraries and utilities | `packages/` |

[Full architecture map →](FRAMEWORK_MAP.md)

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

### Standards & Best Practices
- [Coding Standards](docs/standards/CODING_STANDARDS.md) - Style guide for contributors
- [API Contracts](docs/standards/API_CONTRACTS.md) - API response formats and contracts
- [Testing Standards](docs/standards/TESTING_STANDARDS.md) - Test patterns and coverage
- [File Structure](docs/standards/FILE_STRUCTURE.md) - Project organization
- [Glossary](docs/GLOSSARY.md) - Project terminology

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
- [Architecture](FRAMEWORK_MAP.md)
- [Vision & Mission](docs/VISION_MISSION.md)
- [AI Governance](docs/AI_GOVERNANCE.md)

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

```bash
# Configure at https://dawson.dev, get token
framework pull abc123xyz --cursor --open

# Pull to specific directory
framework pull abc123xyz ./my-project

# Preview changes without executing
framework pull abc123xyz --dry-run

# Use specific template version
framework pull abc123xyz --template-version 0.3.0

# Skip git operations for manual control
framework pull abc123xyz --no-git
```

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

### 4. True Ownership

**This is the big one.** Every exported project is 100% yours. No vendor lock-in. No platform dependencies. Delete our CLI after export if you want - your app will still work perfectly.

### 5. AI-First

Built for AI-assisted development. Cursor integration, agent safety, drift detection, and recovery guidance.

### 6. Production-Ready

Not toy examples. Real templates with auth, billing, databases, email, AI - everything you need to launch.

---

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Submitting pull requests
- Coding standards and style guide
- Testing requirements
- Documentation standards

### Development Setup

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

### Running Tests

```bash
# All tests
npm test

# Specific test file
npm test -- tests/cli/version.test.mjs

# With coverage
npm run test:coverage
```

See [Testing Standards](docs/standards/TESTING_STANDARDS.md) for testing patterns.

---

## Ecosystem

- **CLI** - Command-line tool (this repository)
- **Web Configurator** - Visual project builder at [dawson.dev](https://dawson.dev)
- **Template Registry** - Discover and publish templates
- **Plugin Marketplace** - Coming soon

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
