# Integration Patterns

> How to add new integrations to templates

## Overview

Integrations are optional add-ons that provide specific functionality (auth, payments, email, AI, etc.) to templates. They can be selected during export and are designed to be modular, composable, and easy to add or remove.

---

## 1. What is an Integration?

An integration is a self-contained package that adds functionality to a template:

- **Optional**: Never required by default (unless template specifies)
- **Modular**: Each integration is independent
- **Provider-specific**: Each type (auth, payments, etc.) can have multiple providers (Supabase, Clerk, Stripe, etc.)
- **Composable**: Multiple integrations can be combined

### Integration vs Template Feature

| Integration | Template Feature |
|-------------|------------------|
| Optional add-on | Built into template |
| User chooses provider | Template decides |
| Applied at export | Always present |
| Examples: Stripe, Clerk | Examples: Tailwind CSS, TypeScript |

---

## 2. Integration Directory Structure

### Location Pattern

```
templates/{template}/integrations/{type}/{provider}/
```

### Example: Supabase Auth Integration

```
templates/saas/integrations/auth/supabase/
├── integration.json          # Integration metadata
├── package.json              # Dependencies to merge
├── .env.example              # Environment variables
├── middleware.ts             # Root-level middleware file
├── lib/
│   └── supabase.ts          # Supabase client setup
├── app/
│   ├── login/               # Login page
│   └── api/auth/callback/   # Auth callback route
└── components/
    └── auth/                # Auth UI components
        ├── login-form.tsx
        └── signup-form.tsx
```

### File Organization Rules

1. **Mirror target structure**: Files are organized as they should appear in the final project
2. **No nesting required**: Integration files go directly where they belong (`lib/`, `app/`, `components/`)
3. **Glob patterns supported**: Use `**` for recursive copying (e.g., `app/login/**`)

---

## 3. integration.json Schema

### Required Fields

```json
{
  "provider": "provider-name",
  "type": "auth|payments|email|db|ai|analytics|storage",
  "version": "1.0.0",
  "description": "Brief description of what this integration provides"
}
```

### Complete Schema

```json
{
  "provider": "supabase",
  "type": "auth",
  "version": "1.0.0",
  "description": "Supabase authentication with email/password, social providers, and session management",

  "dependencies": {
    "@supabase/supabase-js": "^2.47.10",
    "@supabase/ssr": "^0.1.0"
  },

  "devDependencies": {
    "@types/node": "^20.0.0"
  },

  "envVars": [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  ],

  "files": {
    "lib": ["lib/supabase.ts"],
    "app": ["app/login/**", "app/api/auth/callback/**"],
    "components": ["components/auth/**"],
    "middleware": ["middleware.ts"]
  },

  "conflicts": ["clerk", "auth0"],

  "requires": ["db"],

  "postInstallInstructions": "Create a Supabase project at https://supabase.com and add your credentials to .env.local"
}
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `provider` | string | ✅ | Provider name (lowercase, kebab-case) |
| `type` | enum | ✅ | Integration type (see Integration Types) |
| `version` | string | ✅ | Semantic version (X.Y.Z) |
| `description` | string | ❌ | User-facing description |
| `dependencies` | object | ❌ | npm dependencies to add |
| `devDependencies` | object | ❌ | npm dev dependencies to add |
| `envVars` | array | ❌ | Required environment variable names |
| `files` | object | ❌ | Files to copy (by category) |
| `conflicts` | array | ❌ | Providers that can't be used together |
| `requires` | array | ❌ | Integration types this depends on |
| `postInstallInstructions` | string | ❌ | Setup guidance shown to user |

---

## 4. Creating a New Integration

### Step 1: Choose Type and Provider

```bash
# Determine integration type
TYPE="auth"  # or payments, email, db, ai, analytics, storage

# Choose provider name (lowercase, kebab-case)
PROVIDER="your-provider"
```

### Step 2: Create Directory Structure

```bash
# Navigate to template
cd templates/saas

# Create integration directory
mkdir -p integrations/${TYPE}/${PROVIDER}
cd integrations/${TYPE}/${PROVIDER}
```

### Step 3: Create integration.json

```bash
cat > integration.json << 'EOF'
{
  "provider": "your-provider",
  "type": "auth",
  "version": "1.0.0",
  "description": "Brief description of what this provides",
  "dependencies": {
    "your-package": "^1.0.0"
  },
  "envVars": [
    "YOUR_API_KEY"
  ],
  "files": {
    "lib": ["lib/your-provider.ts"],
    "app": ["app/your-routes/**"],
    "components": ["components/your-components/**"]
  },
  "postInstallInstructions": "Setup instructions here"
}
EOF
```

### Step 4: Add Integration Files

Create files in the structure they should have in the target project:

```bash
# Example: Create lib file
mkdir -p lib
cat > lib/your-provider.ts << 'EOF'
// Your provider client setup
export const client = createClient()
EOF

# Example: Create components
mkdir -p components/your-components
touch components/your-components/example.tsx

# Example: Create API routes
mkdir -p app/api/your-routes
touch app/api/your-routes/route.ts
```

### Step 5: Create package.json (Optional)

```bash
cat > package.json << 'EOF'
{
  "dependencies": {
    "your-package": "^1.0.0"
  }
}
EOF
```

### Step 6: Create .env.example

```bash
cat > .env.example << 'EOF'
# Your Provider Configuration
# Get these values from https://your-provider.com/dashboard

YOUR_API_KEY=your-api-key-here
YOUR_SECRET=your-secret-here
EOF
```

### Step 7: Update Template's template.json

Add your integration to the template's supported integrations:

```json
{
  "supportedIntegrations": {
    "auth": ["supabase", "clerk", "your-provider"],
    "payments": ["stripe", "paddle"]
  }
}
```

### Step 8: Test the Integration

```bash
# Export template with your integration
framework export saas ./test-app --auth your-provider

# Verify files were copied
ls ./test-app/lib/your-provider.ts
ls ./test-app/components/your-components/

# Verify dependencies were added
cat ./test-app/package.json | grep "your-package"

# Verify env vars were documented
cat ./test-app/.env.example | grep "YOUR_API_KEY"
```

---

## 5. Integration Types

### Standard Types

| Type | Purpose | Common Providers |
|------|---------|------------------|
| `auth` | User authentication | supabase, clerk, auth0, nextauth |
| `payments` | Payment processing | stripe, paddle, lemonsqueezy |
| `db` | Database | supabase, planetscale, neon |
| `email` | Email sending | resend, sendgrid, postmark |
| `ai` | AI/LLM APIs | openai, anthropic, replicate |
| `analytics` | Usage tracking | posthog, plausible, mixpanel |
| `storage` | File storage | supabase, s3, r2, uploadthing |

### Adding a New Type

To add a new integration type:

1. Update `src/dd/integration-schema.mjs`:
```javascript
export const integrationMetadataSchema = z.object({
  type: z.enum([
    "auth", "payments", "email", "db", "ai", "analytics", "storage",
    "your-new-type"  // Add here
  ]),
  // ...
})
```

2. Update `IntegrationTypes` constant:
```javascript
export const IntegrationTypes = {
  AUTH: "auth",
  PAYMENTS: "payments",
  // ...
  YOUR_TYPE: "your-new-type"
}
```

3. Document the new type in this file

---

## 6. File Merging Rules

### Files Categories

```json
{
  "files": {
    "lib": ["lib/client.ts"],           // Utility modules
    "app": ["app/routes/**"],           // App routes (Next.js App Router)
    "components": ["components/**"],     // React components
    "middleware": ["middleware.ts"],     // Root middleware
    "types": ["types/**"],              // TypeScript types
    "config": ["config/**"]             // Configuration files
  }
}
```

### Copy Behavior

| Pattern | Behavior | Example |
|---------|----------|---------|
| Exact path | Copy single file | `"lib/supabase.ts"` |
| Glob `**` | Copy directory recursively | `"app/login/**"` |
| Glob `*` | Copy files in directory | `"components/auth/*"` |

### Overwrite Policy

```javascript
// Default behavior: Do NOT overwrite existing files
await fs.copy(source, target, {
  overwrite: false,
  errorOnExist: false
})
```

**Files are never overwritten** to preserve user modifications.

### Special Files

#### package.json
Dependencies are **merged**, not replaced:

```javascript
// Integration's package.json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.47.10"
  }
}

// Project's package.json (before)
{
  "dependencies": {
    "next": "^15.0.0"
  }
}

// Result (after merge)
{
  "dependencies": {
    "next": "^15.0.0",
    "@supabase/supabase-js": "^2.47.10"
  }
}
```

#### .env.example
Environment variables are **appended**:

```bash
# Project's .env.example (before)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# After applying Supabase integration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### middleware.ts
If both template and integration have middleware, **integration's version is used**. To support multiple middlewares, use middleware composition pattern.

---

## 7. Environment Variables

### Declaring Environment Variables

```json
{
  "envVars": [
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET"
  ]
}
```

### .env.example Format

```bash
# Stripe Configuration
# Get your API keys from https://dashboard.stripe.com/apikeys
# Use test keys (sk_test_...) for development

STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Best Practices

1. **Document where to get values**: Include URL to provider dashboard
2. **Specify test vs production**: Clarify which keys to use for development
3. **Explain each variable**: Add comments for non-obvious variables
4. **Use placeholder values**: Show the expected format (`sk_test_...`)

---

## 8. Conflict Resolution

### Declaring Conflicts

Conflicts prevent incompatible providers from being used together:

```json
{
  "provider": "clerk",
  "type": "auth",
  "conflicts": ["supabase", "auth0"]
}
```

### When to Use Conflicts

- ✅ **Same functionality**: Two auth providers can't coexist
- ✅ **Incompatible middleware**: Both require different middleware setups
- ✅ **Overlapping routes**: Both use the same URL paths

### Conflict Detection

The framework validates conflicts at export time:

```bash
# This will fail with a conflict error
framework export saas ./app --auth supabase --auth clerk

# Error:
# ❌ Integration conflict: clerk conflicts with supabase for auth
```

---

## 9. Dependency Requirements

### Declaring Requirements

Use `requires` to suggest related integrations:

```json
{
  "provider": "stripe",
  "type": "payments",
  "requires": ["db", "auth"]
}
```

### Behavior

- **Not enforced**: Requirements are suggestions, not hard requirements
- **Warnings only**: User sees a warning if dependencies not included
- **User choice**: User can proceed without required integrations

```bash
# Export with stripe but no db
framework export saas ./app --payments stripe

# Warning shown:
# ⚠️  payments/stripe recommends also adding a db integration
```

---

## 10. Testing Integrations

### Manual Testing

```bash
# Step 1: Export template with integration
framework export saas ./test-app --auth your-provider --payments stripe

# Step 2: Verify directory structure
ls -la ./test-app/lib/your-provider.ts
ls -la ./test-app/components/

# Step 3: Verify package.json
cat ./test-app/package.json | grep "your-package"

# Step 4: Verify .env.example
cat ./test-app/.env.example

# Step 5: Try building the project
cd ./test-app
npm install
npm run build
```

### Integration Test (Automated)

Create a test in `tests/integration/`:

```javascript
import test from "node:test"
import assert from "node:assert/strict"
import { applyIntegrations } from "../../src/dd/integrations.mjs"

test("your-provider integration: applies successfully", async () => {
  const projectDir = "/tmp/test-project"
  const templatePath = path.join(__dirname, "../../templates/saas")

  const result = await applyIntegrations(
    projectDir,
    templatePath,
    { auth: "your-provider" }
  )

  assert.strictEqual(result.success, true)
  assert.ok(result.applied.some(i => i.provider === "your-provider"))

  // Verify files exist
  assert.ok(fs.existsSync(path.join(projectDir, "lib/your-provider.ts")))
})
```

### Validation Tests

```javascript
test("your-provider integration.json: is valid", async () => {
  const integrationPath = path.join(
    __dirname,
    "../../templates/saas/integrations/auth/your-provider/integration.json"
  )

  const data = JSON.parse(fs.readFileSync(integrationPath, "utf8"))

  // Required fields
  assert.ok(data.provider)
  assert.ok(data.type)
  assert.ok(data.version)

  // Version format
  assert.ok(/^\d+\.\d+\.\d+$/.test(data.version))

  // Type is valid
  assert.ok(["auth", "payments", "email", "db", "ai", "analytics", "storage"].includes(data.type))
})
```

---

## 11. Real Examples

### Example 1: Supabase Auth

```
templates/saas/integrations/auth/supabase/
├── integration.json
├── package.json
├── .env.example
├── middleware.ts
├── lib/
│   └── supabase.ts
├── app/
│   ├── login/
│   │   └── page.tsx
│   └── api/auth/callback/
│       └── route.ts
└── components/
    └── auth/
        ├── login-form.tsx
        └── signup-form.tsx
```

**integration.json:**
```json
{
  "provider": "supabase",
  "type": "auth",
  "version": "1.0.0",
  "description": "Supabase authentication with email/password, social providers, and session management",
  "dependencies": {
    "@supabase/supabase-js": "^2.47.10",
    "@supabase/ssr": "^0.1.0"
  },
  "envVars": [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  ],
  "files": {
    "lib": ["lib/supabase.ts"],
    "app": ["app/login/**", "app/api/auth/callback/**"],
    "components": ["components/auth/**"],
    "middleware": ["middleware.ts"]
  },
  "postInstallInstructions": "Create a Supabase project at https://supabase.com and add your credentials to .env.local"
}
```

### Example 2: Stripe Payments

```
templates/saas/integrations/payments/stripe/
├── integration.json
├── package.json
├── .env.example
├── lib/
│   └── stripe.ts
├── app/
│   └── api/stripe/
│       ├── checkout/
│       │   └── route.ts
│       ├── portal/
│       │   └── route.ts
│       └── webhook/
│           └── route.ts
└── components/
    └── pricing/
        └── pricing-cards.tsx
```

**integration.json:**
```json
{
  "provider": "stripe",
  "type": "payments",
  "version": "1.0.0",
  "description": "Stripe payments with subscription management, webhooks, and customer portal",
  "dependencies": {
    "stripe": "^14.21.0"
  },
  "envVars": [
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET"
  ],
  "files": {
    "lib": ["lib/stripe.ts"],
    "app": ["app/api/stripe/**"],
    "components": ["components/pricing/**"]
  },
  "postInstallInstructions": "Create a Stripe account at https://stripe.com, get your API keys from https://dashboard.stripe.com/apikeys, and set up webhook endpoint for subscription events"
}
```

### Example 3: OpenAI AI

```
templates/saas/integrations/ai/openai/
├── integration.json
├── package.json
├── .env.example
├── lib/
│   └── openai.ts
├── app/
│   └── api/ai/
│       ├── chat/
│       │   └── route.ts
│       └── completions/
│           └── route.ts
└── components/
    └── ai/
        └── chat-interface.tsx
```

**integration.json:**
```json
{
  "provider": "openai",
  "type": "ai",
  "version": "1.0.0",
  "description": "OpenAI API integration with GPT-4, chat completions, and streaming support",
  "dependencies": {
    "openai": "^4.28.0",
    "ai": "^3.0.0"
  },
  "envVars": [
    "OPENAI_API_KEY"
  ],
  "files": {
    "lib": ["lib/openai.ts"],
    "app": ["app/api/ai/**"],
    "components": ["components/ai/**"]
  },
  "postInstallInstructions": "Create an OpenAI account at https://platform.openai.com, get your API key from https://platform.openai.com/api-keys, and add credits to your account"
}
```

---

## 12. Template Integration Support

### Declaring Support in template.json

```json
{
  "id": "saas",
  "name": "SaaS Starter",
  "version": "1.0.0",

  "supportedIntegrations": {
    "auth": ["supabase", "clerk"],
    "payments": ["stripe", "paddle"],
    "email": ["resend", "sendgrid"],
    "db": ["supabase", "planetscale"],
    "ai": ["openai", "anthropic"],
    "analytics": ["posthog", "plausible"]
  },

  "defaultIntegrations": {
    "auth": "supabase",
    "payments": "stripe",
    "db": "supabase"
  },

  "requiredIntegrations": ["auth", "db"]
}
```

### Field Definitions

| Field | Description |
|-------|-------------|
| `supportedIntegrations` | Map of integration types to supported providers |
| `defaultIntegrations` | Default provider for each type (optional) |
| `requiredIntegrations` | Integration types that must be provided |

### Validation

Templates without `supportedIntegrations` cannot use integrations:

```bash
framework export blog ./app --auth supabase

# Error if blog template doesn't support integrations:
# ❌ This template does not support any integrations
```

---

## 13. CLI Usage

### Export with Integrations

```bash
# Single integration
framework export saas ./my-app --auth supabase

# Multiple integrations
framework export saas ./my-app --auth supabase --payments stripe

# All integrations
framework export saas ./my-app \
  --auth supabase \
  --payments stripe \
  --email resend \
  --db supabase \
  --ai openai \
  --analytics posthog
```

### Pull with Integrations

```bash
# Pull project from web configurator (integrations already selected)
npx @jrdaws/framework pull <token>
```

### List Available Integrations

```bash
# Show supported integrations for a template
framework templates show saas

# Output shows:
# Supported Integrations:
#   auth: supabase, clerk
#   payments: stripe, paddle
#   email: resend, sendgrid
#   ...
```

---

## 14. Checklist for New Integration

Use this checklist when creating a new integration:

- [ ] Created directory: `templates/{template}/integrations/{type}/{provider}/`
- [ ] Created `integration.json` with all required fields
- [ ] Added all necessary files in correct structure
- [ ] Created `package.json` with dependencies
- [ ] Created `.env.example` with all env vars
- [ ] Documented setup instructions in `postInstallInstructions`
- [ ] Added conflicts if applicable
- [ ] Added requires if applicable
- [ ] Updated template's `template.json` with new provider
- [ ] Tested export: `framework export {template} ./test --{type} {provider}`
- [ ] Verified files copied correctly
- [ ] Verified dependencies merged into package.json
- [ ] Verified .env.example updated
- [ ] Ran build in exported project: `npm install && npm run build`
- [ ] Created integration test in `tests/integration/`
- [ ] Documented integration in template README

---

## 15. Common Patterns

### Pattern 1: Client Setup File

Most integrations need a client setup file:

```typescript
// lib/your-provider.ts
import { createClient } from 'your-provider-sdk'

export const client = createClient({
  apiKey: process.env.YOUR_API_KEY!
})
```

### Pattern 2: API Route

API routes for handling provider webhooks/callbacks:

```typescript
// app/api/your-provider/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Handle webhook

  return NextResponse.json({ received: true })
}
```

### Pattern 3: Environment Variables in Client

```typescript
// lib/your-provider.ts
if (!process.env.YOUR_API_KEY) {
  throw new Error(
    'YOUR_API_KEY is not set. ' +
    'Get your API key from https://your-provider.com/dashboard ' +
    'and add it to .env.local'
  )
}
```

### Pattern 4: Middleware for Auth

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Auth check
  const isAuthenticated = checkAuth(request)

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
}
```

---

## Summary

### Integration Structure
- Located in `templates/{template}/integrations/{type}/{provider}/`
- Contains `integration.json`, files, and optional `package.json`, `.env.example`
- Files mirror target project structure

### integration.json
- Required: `provider`, `type`, `version`
- Optional: `dependencies`, `envVars`, `files`, `conflicts`, `requires`
- Validated by schema in `src/dd/integration-schema.mjs`

### File Merging
- Files copied to project (never overwrite)
- `package.json` dependencies merged
- `.env.example` appended
- Glob patterns `**` supported

### Integration Types
- Standard: `auth`, `payments`, `email`, `db`, `ai`, `analytics`, `storage`
- Define new types in `integration-schema.mjs`

### Testing
- Manual: Export and verify files, dependencies, build
- Automated: Integration tests in `tests/integration/`

### Template Support
- Templates declare `supportedIntegrations` in `template.json`
- Optional: `defaultIntegrations`, `requiredIntegrations`

---

*For API contracts, see API_CONTRACTS.md. For testing, see TESTING_STANDARDS.md.*
