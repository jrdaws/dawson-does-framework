# framework templates

Browse, search, and discover templates.

## Synopsis

```bash
framework templates <command> [arguments] [options]
```

## Description

The `templates` command provides tools to discover and explore available templates. Use it to find the right template for your project.

## Commands

| Command | Description |
|---------|-------------|
| `list` | List all templates |
| `search <query>` | Search templates |
| `info <id>` | Show template details |
| `categories` | List all categories |
| `tags` | List all tags |

## framework templates list

List all available templates.

### Synopsis

```bash
framework templates list [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--category <name>` | Filter by category |
| `--tag <name>` | Filter by tag |
| `--sort <field>` | Sort by field (name, category, version) |

### Examples

**List all templates:**

```bash
framework templates list
```

**Output:**
```
📦 Available Templates:

saas
  SaaS Starter - Full-stack with auth, billing, database
  Category: SaaS | Version: 1.0.0
  Tags: nextjs, react, saas, auth, billing

dashboard
  Admin Dashboard - Data tables, charts, settings
  Category: Dashboard | Version: 1.0.0
  Tags: nextjs, react, dashboard, admin

landing-page
  Landing Page - High-converting marketing pages
  Category: Marketing | Version: 1.0.0
  Tags: nextjs, react, landing, marketing

blog
  Blog - Content-focused sites with SEO
  Category: Content | Version: 1.0.0
  Tags: nextjs, react, blog, seo

seo-directory
  SEO Directory - Optimized directory sites
  Category: Directory | Version: 1.0.0
  Tags: nextjs, react, directory, seo
```

**Filter by category:**

```bash
framework templates list --category SaaS
```

**Filter by tag:**

```bash
framework templates list --tag nextjs
```

**Sort templates:**

```bash
framework templates list --sort name
framework templates list --sort category
```

## framework templates search

Search templates by keyword.

### Synopsis

```bash
framework templates search <query>
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `query` | Search term | Yes |

### Examples

**Search for blog templates:**

```bash
framework templates search "blog"
```

**Output:**
```
📦 Search Results: "blog"

blog
  Blog - Content-focused sites with SEO
  Category: Content | Version: 1.0.0
  Matches: id, tags

Found 1 template
```

**Search for Next.js templates:**

```bash
framework templates search "nextjs"
```

**Output:**
```
📦 Search Results: "nextjs"

saas
  SaaS Starter - Full-stack with auth, billing, database
  Matches: tags

dashboard
  Admin Dashboard - Data tables, charts, settings
  Matches: tags

landing-page
  Landing Page - High-converting marketing pages
  Matches: tags

blog
  Blog - Content-focused sites with SEO
  Matches: tags

seo-directory
  SEO Directory - Optimized directory sites
  Matches: tags

Found 5 templates
```

## framework templates info

Show detailed information about a template.

### Synopsis

```bash
framework templates info <id>
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `id` | Template ID | Yes |

### Example

```bash
framework templates info saas
```

**Output:**
```
📦 SaaS Starter

ID:          saas
Version:     1.0.0
Category:    SaaS
Author:      Dawson Framework Team

Description:
  Full-stack SaaS template with authentication and billing

Tags: nextjs, react, saas, auth, billing

Features:
  - Next.js 15 with App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Server Components
  - Built-in authentication
  - Payment processing
  - Database integration

Supported Integrations:
  auth: supabase, clerk
  payments: stripe, paddle
  db: supabase, planetscale
  email: resend, sendgrid
  ai: openai, anthropic
  analytics: posthog, plausible
  storage: supabase, s3, cloudinary

Framework Compatibility:
  Requires: v0.1.0 or higher
  Current:  v0.3.0
  Status:   ✅ Compatible

Usage:
  framework export saas <project-dir>

Examples:
  framework export saas ./my-app
  framework export saas ./my-app --auth supabase --payments stripe
```

## framework templates categories

List all template categories.

### Synopsis

```bash
framework templates categories
```

### Example

```bash
framework templates categories
```

**Output:**
```
📦 Template Categories:

SaaS (1)
  - saas

Dashboard (1)
  - dashboard

Marketing (1)
  - landing-page

Content (1)
  - blog

Directory (1)
  - seo-directory

Total: 5 categories, 5 templates
```

## framework templates tags

List all template tags.

### Synopsis

```bash
framework templates tags
```

### Example

```bash
framework templates tags
```

**Output:**
```
📦 Template Tags:

nextjs (5)
  - saas, dashboard, landing-page, blog, seo-directory

react (5)
  - saas, dashboard, landing-page, blog, seo-directory

typescript (5)
  - saas, dashboard, landing-page, blog, seo-directory

auth (1)
  - saas

billing (1)
  - saas

dashboard (1)
  - dashboard

admin (1)
  - dashboard

landing (1)
  - landing-page

marketing (1)
  - landing-page

blog (1)
  - blog

seo (2)
  - blog, seo-directory

directory (1)
  - seo-directory

Total: 13 unique tags
```

## Template Selection Guide

### By Use Case

**Building a SaaS product?**
```bash
framework export saas ./my-app
```

**Need an admin panel?**
```bash
framework export dashboard ./admin-panel
```

**Creating a landing page?**
```bash
framework export landing-page ./landing
```

**Starting a blog?**
```bash
framework export blog ./my-blog
```

**Building a directory?**
```bash
framework export seo-directory ./directory
```

### By Tech Stack

**Next.js + React:**
All templates use Next.js 15 with App Router

**TypeScript:**
All templates include TypeScript

**Styling:**
All templates use Tailwind CSS

**Authentication:**
`saas` template has auth built-in
Others can add with `--auth supabase`

**Payments:**
`saas` template has payments built-in
Others can add with `--payments stripe`

## Template Comparison

| Template | Auth | Payments | Database | Best For |
|----------|------|----------|----------|----------|
| **saas** | ✅ | ✅ | ✅ | Full-stack apps |
| **dashboard** | ⚠️ | ❌ | ⚠️ | Admin panels |
| **landing-page** | ❌ | ⚠️ | ❌ | Marketing |
| **blog** | ❌ | ❌ | ❌ | Content sites |
| **seo-directory** | ❌ | ❌ | ❌ | Directories |

Legend:
- ✅ Built-in
- ⚠️ Available as integration
- ❌ Not applicable

## Common Workflows

### Explore Templates

```bash
# 1. List all templates
framework templates list

# 2. Search for specific type
framework templates search "blog"

# 3. Get detailed info
framework templates info blog

# 4. Export the template
framework export blog ./my-blog
```

### Find by Feature

**Need authentication:**
```bash
framework templates search "auth"
```

**Need payments:**
```bash
framework templates search "billing"
```

**Need specific framework:**
```bash
framework templates list --tag nextjs
```

### Browse by Category

```bash
# 1. List categories
framework templates categories

# 2. Filter by category
framework templates list --category SaaS

# 3. Export template from category
framework export saas ./my-app
```

## Next Steps

After finding a template:

1. **Get template details:**
   ```bash
   framework templates info <id>
   ```

2. **Export the template:**
   ```bash
   framework export <id> ./my-app
   ```

3. **Add integrations:**
   ```bash
   framework export <id> ./my-app --auth supabase --payments stripe
   ```

## Related Commands

- [`framework export`](export.md) - Create projects from templates
- [`framework pull`](pull.md) - Pull from web configurator

## See Also

- [Template Documentation](../templates/README.md) - Detailed template guides
- [Getting Started](../getting-started/README.md) - First steps
- [Template Registry](../TEMPLATE_REGISTRY.md) - Creating templates
