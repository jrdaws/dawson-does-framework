# Creating Custom Templates

Complete guide to building, testing, and distributing custom templates for the Dawson Does Framework.

## Table of Contents

- [Overview](#overview)
- [Template Structure](#template-structure)
- [Template Metadata](#template-metadata)
- [File Requirements](#file-requirements)
- [Integration Hooks](#integration-hooks)
- [Testing Your Template](#testing-your-template)
- [Best Practices](#best-practices)
- [Publishing Templates](#publishing-templates)
- [Example Walkthrough](#example-walkthrough)
- [Template Registry](#template-registry)

## Overview

Creating a custom template allows you to package reusable project structures that can be shared across your organization or with the community. Templates are simply directories with special metadata that the framework can understand and export.

### Why Create a Template?

- **Standardization:** Enforce consistent project structure across your team
- **Efficiency:** Skip repetitive setup and configuration
- **Best Practices:** Bake in your preferred architecture and patterns
- **Sharing:** Distribute proven patterns to the community
- **Customization:** Tailor starter projects to your specific needs

### What Makes a Good Template?

A good template should:

1. **Solve a specific problem** - Address a clear use case
2. **Work out of the box** - Require minimal configuration
3. **Be well documented** - Include clear instructions
4. **Follow conventions** - Use standard Next.js patterns
5. **Be maintainable** - Keep dependencies minimal and up-to-date
6. **Support integrations** - Allow easy extension

## Template Structure

### Minimum Required Structure

At minimum, a template needs:

```
my-template/
├── template.json            # Template metadata (REQUIRED)
├── package.json             # npm dependencies
├── tsconfig.json            # TypeScript config
├── next.config.js           # Next.js config
├── tailwind.config.ts       # Tailwind config
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
└── README.md                # Documentation
```

### Recommended Structure

For a production-ready template:

```
my-template/
├── template.json            # Template metadata
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── next.config.js           # Next.js config
├── tailwind.config.ts       # Tailwind config
├── postcss.config.js        # PostCSS config
├── .eslintrc.json           # ESLint config
├── .prettierrc              # Prettier config
├── .gitignore               # Git ignore rules
├── .env.example             # Environment template
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── [your routes]/
├── components/
│   └── [your components]/
├── lib/
│   └── [utilities]/
├── public/
│   └── [static assets]/
├── integrations/            # Optional integrations
│   ├── auth/
│   │   └── supabase/
│   └── db/
│       └── supabase/
├── .dd/                     # Framework configuration
│   ├── config.json
│   └── health.sh
└── README.md
```

## Template Metadata

### The template.json File

Every template MUST include a `template.json` file with metadata:

```json
{
  "id": "my-template",
  "name": "My Template",
  "version": "1.0.0",
  "description": "A description of what this template does and when to use it",
  "author": "Your Name or Organization",
  "category": "Category",
  "tags": ["nextjs", "react", "typescript"],
  "minFrameworkVersion": "0.1.0",
  "capabilities": [],
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0"
  },
  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  "supportedIntegrations": {
    "auth": ["supabase", "clerk"],
    "db": ["supabase", "planetscale"]
  },
  "defaultIntegrations": {
    "auth": "supabase"
  },
  "requiredIntegrations": [],
  "license": "MIT"
}
```

### Field Definitions

#### Required Fields

**id** (string)
- Unique identifier for your template
- Use lowercase with hyphens
- Example: `"my-saas-template"`

**name** (string)
- Human-readable template name
- Example: `"My SaaS Template"`

**version** (string)
- Semantic version number
- Format: `"major.minor.patch"`
- Example: `"1.0.0"`

**description** (string)
- Clear, concise description
- Include use cases and benefits
- 1-2 sentences recommended
- Example: `"Full-stack SaaS template with authentication and billing"`

#### Optional but Recommended

**author** (string)
- Your name or organization
- Example: `"Acme Corp"` or `"John Doe"`

**category** (string)
- Template category for organization
- Standard categories: `"SaaS"`, `"Blog"`, `"Dashboard"`, `"Landing"`, `"Directory"`, `"E-commerce"`
- Example: `"SaaS"`

**tags** (array of strings)
- Keywords for searchability
- Include frameworks, features, and use cases
- Example: `["nextjs", "react", "saas", "auth", "billing"]`

**minFrameworkVersion** (string)
- Minimum framework version required
- Uses semantic versioning
- Example: `"0.1.0"`

**capabilities** (array of strings)
- Framework capabilities used
- Format: `"category.provider"`
- Example: `["auth.supabase", "billing.stripe"]`

**dependencies** (object)
- Key npm dependencies
- List major packages only
- Uses package.json format
- Example:
  ```json
  {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "@supabase/supabase-js": "^2.47.0"
  }
  ```

**features** (array of strings)
- Key features of the template
- User-facing benefits
- Example: `["Next.js 15 with App Router", "Supabase authentication"]`

**supportedIntegrations** (object)
- Integrations that can be added
- Organized by category
- Example:
  ```json
  {
    "auth": ["supabase", "clerk"],
    "payments": ["stripe", "paddle"],
    "db": ["supabase", "planetscale"]
  }
  ```

**defaultIntegrations** (object)
- Default integration for each category
- Example:
  ```json
  {
    "auth": "supabase",
    "db": "supabase"
  }
  ```

**requiredIntegrations** (array of strings)
- Integration categories that must be configured
- Example: `["auth", "db"]`

**license** (string)
- Software license
- Common: `"MIT"`, `"Apache-2.0"`, `"GPL-3.0"`
- Example: `"MIT"`

## File Requirements

### package.json

Define dependencies and scripts:

```json
{
  "name": "my-template",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

### tsconfig.json

TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### next.config.js

Next.js configuration:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add your custom config
}

module.exports = nextConfig
```

### .env.example

Environment variable template:

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME="My App"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Database (if using)
# DATABASE_URL="postgresql://..."

# Authentication (if using)
# NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
# NEXT_PUBLIC_SUPABASE_ANON_KEY="xxx"

# Add your required environment variables
```

### README.md

Template documentation:

```markdown
# My Template

Brief description of what this template provides.

## Features

- Feature 1
- Feature 2
- Feature 3

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit http://localhost:3000

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_APP_NAME` - Your app name
- Add more variables...

## Customization

Instructions on how to customize the template.

## Documentation

Link to detailed documentation.
```

## Integration Hooks

### Directory Structure for Integrations

Templates can include optional integrations:

```
integrations/
├── auth/
│   ├── supabase/
│   │   ├── integration.json      # Integration metadata
│   │   ├── package.json          # Integration dependencies
│   │   ├── lib/
│   │   │   └── supabase.ts
│   │   ├── app/
│   │   │   └── api/auth/
│   │   └── middleware.ts
│   └── clerk/
│       └── [similar structure]
├── payments/
│   └── stripe/
│       └── [integration files]
└── db/
    └── supabase/
        └── [integration files]
```

### Integration Metadata

Each integration needs an `integration.json`:

```json
{
  "id": "supabase-auth",
  "name": "Supabase Authentication",
  "category": "auth",
  "provider": "supabase",
  "version": "1.0.0",
  "description": "Supabase authentication integration",
  "requiredEnvVars": [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  ],
  "dependencies": {
    "@supabase/supabase-js": "^2.47.0",
    "@supabase/ssr": "^0.5.0"
  },
  "files": {
    "lib/supabase.ts": "copy",
    "middleware.ts": "merge",
    "app/api/auth/": "copy"
  }
}
```

### File Merge Strategies

When integrations are added, files can be:

**copy** - Copy the file as-is
```json
"files": {
  "lib/supabase.ts": "copy"
}
```

**merge** - Merge with existing file
```json
"files": {
  "middleware.ts": "merge"
}
```

**template** - Use as template with variable replacement
```json
"files": {
  "app/api/[resource]/route.ts": "template"
}
```

## Testing Your Template

### Local Testing

Test your template locally:

```bash
# 1. Place template in templates/ directory
cp -r my-template /path/to/framework/templates/

# 2. Export template
framework export my-template ./test-output

# 3. Test the exported project
cd test-output
npm install
npm run dev

# 4. Verify all features work
# - Test all pages
# - Check integrations
# - Run build
# - Check for errors
```

### Validation Checklist

Before publishing, verify:

- [ ] `template.json` is valid JSON
- [ ] All required fields are present
- [ ] Template ID is unique
- [ ] Version follows semver
- [ ] `package.json` includes all dependencies
- [ ] `README.md` is comprehensive
- [ ] `.env.example` documents all variables
- [ ] Template exports successfully
- [ ] `npm install` works
- [ ] `npm run dev` starts server
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All pages load correctly
- [ ] Integrations work as expected

### Automated Testing

Create a test script:

```bash
#!/bin/bash
# test-template.sh

TEMPLATE_NAME="my-template"
TEST_DIR="./test-output"

echo "Testing template: $TEMPLATE_NAME"

# Export template
framework export $TEMPLATE_NAME $TEST_DIR

# Install dependencies
cd $TEST_DIR
npm install

# Run type check
npm run type-check

# Run lint
npm run lint

# Build
npm run build

echo "Template test complete!"
```

## Best Practices

### Template Design

1. **Keep it minimal** - Include only what's necessary
2. **Make it configurable** - Use environment variables
3. **Document everything** - Clear README and comments
4. **Follow conventions** - Use standard Next.js patterns
5. **Optimize for performance** - Fast builds and runtime
6. **Plan for maintenance** - Keep dependencies minimal

### Code Organization

```typescript
// Good: Clear structure
src/
├── app/              # Routes
├── components/       # React components
├── lib/              # Utilities
└── types/            # TypeScript types

// Avoid: Mixed concerns
src/
├── stuff/
├── things/
└── misc/
```

### Dependency Management

```json
// Good: Specific versions with caret
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0"
  }
}

// Avoid: Loose or exact versions
{
  "dependencies": {
    "next": "*",
    "react": "19.0.0"
  }
}
```

### Documentation

```markdown
<!-- Good: Clear, actionable -->
## Getting Started

1. Export the template:
   \`\`\`bash
   framework export my-template ./my-app
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   cd my-app && npm install
   \`\`\`

3. Configure environment:
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your values
   \`\`\`

<!-- Avoid: Vague instructions -->
## Getting Started

Run the app and it should work.
```

### Environment Variables

```bash
# Good: Descriptive with examples
# Database connection string
# Example: postgresql://user:pass@host:5432/dbname
DATABASE_URL="postgresql://..."

# Stripe API key (get from dashboard)
# Example: sk_test_xxxxx
STRIPE_SECRET_KEY=""

# Avoid: No context
DATABASE_URL=""
STRIPE_SECRET_KEY=""
```

## Publishing Templates

### Option 1: Local Distribution

Share template files directly:

```bash
# Copy to framework templates directory
cp -r my-template /path/to/framework/templates/

# Users can then export
framework export my-template ./my-app
```

### Option 2: npm Package

Publish as npm package:

```json
// package.json
{
  "name": "@yourorg/my-template",
  "version": "1.0.0",
  "description": "My custom template",
  "main": "index.js",
  "files": [
    "app/**",
    "components/**",
    "lib/**",
    "public/**",
    "template.json",
    "package.json",
    "tsconfig.json",
    "next.config.js",
    "tailwind.config.ts",
    "README.md"
  ],
  "keywords": ["nextjs", "template", "starter"],
  "repository": {
    "type": "git",
    "url": "https://github.com/yourorg/my-template"
  }
}
```

Publish:

```bash
npm publish --access public
```

Users install:

```bash
framework export @yourorg/my-template ./my-app
```

### Option 3: GitHub Distribution

Host on GitHub:

```bash
# Users export from GitHub
framework export github:yourorg/my-template ./my-app

# Or specific branch/tag
framework export github:yourorg/my-template#v1.0.0 ./my-app
```

### Option 4: Remote Registry

Host on a template registry:

```json
// Registry configuration
{
  "registries": [
    {
      "type": "remote",
      "url": "https://your-registry.com/templates",
      "name": "Your Registry"
    }
  ]
}
```

Implement registry API:

```typescript
// GET /templates
{
  "templates": [
    {
      "id": "my-template",
      "name": "My Template",
      "version": "1.0.0",
      "description": "...",
      "downloadUrl": "https://your-registry.com/download/my-template"
    }
  ]
}

// GET /templates/:id
{
  "id": "my-template",
  "name": "My Template",
  // ... full metadata
  "downloadUrl": "https://your-registry.com/download/my-template"
}
```

## Example Walkthrough

Let's create a simple "Portfolio" template:

### 1. Create Template Directory

```bash
mkdir portfolio-template
cd portfolio-template
```

### 2. Create template.json

```json
{
  "id": "portfolio",
  "name": "Portfolio Template",
  "version": "1.0.0",
  "description": "Clean portfolio template for showcasing your work",
  "author": "Your Name",
  "category": "Portfolio",
  "tags": ["nextjs", "portfolio", "personal-site"],
  "minFrameworkVersion": "0.1.0",
  "features": [
    "Next.js 15 with App Router",
    "Project showcase",
    "About section",
    "Contact form",
    "Responsive design"
  ],
  "license": "MIT"
}
```

### 3. Create package.json

```json
{
  "name": "portfolio-template",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

### 4. Create App Structure

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// app/page.tsx
export default function HomePage() {
  return (
    <main>
      <section>
        <h1>Your Name</h1>
        <p>Your tagline</p>
      </section>

      <section>
        <h2>Projects</h2>
        {/* Project cards */}
      </section>

      <section>
        <h2>About</h2>
        {/* About content */}
      </section>
    </main>
  )
}
```

### 5. Add Configuration Files

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}

// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
```

### 6. Create README

```markdown
# Portfolio Template

Clean, modern portfolio template for showcasing your work.

## Features

- Project showcase
- About section
- Contact form
- Responsive design
- SEO optimized

## Getting Started

\`\`\`bash
framework export portfolio ./my-portfolio
cd my-portfolio
npm install
npm run dev
\`\`\`

## Customization

1. Update personal info in `app/page.tsx`
2. Add your projects
3. Customize colors in `tailwind.config.ts`
4. Add your images to `public/`

## License

MIT
```

### 7. Test Template

```bash
# Test export
framework export portfolio ./test-portfolio

# Test installation
cd test-portfolio
npm install

# Test development
npm run dev

# Test build
npm run build
```

### 8. Publish

```bash
# Option 1: Copy to framework
cp -r portfolio-template /path/to/framework/templates/

# Option 2: Publish to npm
npm publish

# Option 3: Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourorg/portfolio-template
git push -u origin main
```

## Template Registry

### Submitting to Official Registry

To submit your template to the official registry:

1. **Ensure quality** - Follow all best practices
2. **Test thoroughly** - Verify everything works
3. **Document completely** - Clear README and examples
4. **Open PR** - Submit to framework repository
5. **Respond to feedback** - Address review comments

### Registry Guidelines

Templates in the official registry must:

- Follow framework conventions
- Include comprehensive documentation
- Work with latest framework version
- Include tests
- Be maintained (respond to issues)
- Use appropriate license
- Not include sensitive data
- Not include unnecessary dependencies

## Next Steps

1. **Plan your template** - Define use case and features
2. **Build incrementally** - Start simple, add features
3. **Test thoroughly** - Verify all functionality
4. **Document well** - Help users get started
5. **Share** - Publish for others to use

## Resources

- [Template Registry](../TEMPLATE_REGISTRY.md)
- [Integration System](../integrations/README.md)
- [CLI Reference](../cli/README.md)
- [Example Templates](../../templates/)

---

**Ready to create?** Start building your custom template today!
