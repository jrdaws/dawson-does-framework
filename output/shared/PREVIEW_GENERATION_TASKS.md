# Preview & Project Generation System - Complete Task Breakdown

## Overview

Build a complete system where:
1. **Preview** reflects exactly what the user will get (template + integrations + features)
2. **Export** generates functional code matching the configuration
3. **Integrations** are fully wired up with working code

---

## Current State Assessment

### ✅ Already Built

| Component | Location | Status |
|-----------|----------|--------|
| Template Compositions | `lib/preview/template-compositions.ts` | 7 templates with component sections |
| Preview Components | `components/preview/` | Nav, Hero, ProductGrid, etc. |
| Feature Definitions | `lib/features.ts` | Categories + features with `codeTemplates[]` |
| AI Preview Generator | `lib/ai/preview-generator.ts` | Generates component props |
| PreviewRenderer | `components/preview/PreviewRenderer.tsx` | Renders template layouts |
| ZIP Generator | `lib/zip-generator.ts` | Bundles files for download |
| AI Agent Package | `packages/ai-agent/` | Architecture + code generation |
| **Supabase Auth Template** | `packages/templates/integrations/auth/supabase/` | ✅ Full auth with login/signup/oauth |
| **Stripe Payments Template** | `packages/templates/integrations/payments/stripe/` | ✅ Checkout, billing portal, webhooks |
| **Resend Email Template** | `packages/templates/integrations/email/resend/` | ✅ Welcome, reset, invoice emails |
| **PostHog Analytics Template** | `packages/templates/integrations/analytics/posthog/` | ✅ Events, feature flags, A/B testing |
| **Generator Orchestrator** | `website/lib/generator/` | ✅ Combines templates into projects |
| **ZIP Export Integration** | `app/api/export/zip/route.ts` | ✅ Uses generator when templates unavailable |

### ❌ Not Yet Built

| Component | Purpose |
|-----------|---------|
| Feature Code Templates | Actual code files for each feature (shopping cart, etc.) |
| More Integration Templates | OpenAI, Clerk, Algolia, etc. |
| Feature Preview Components | Visual representations in preview |
| Dependency Graph | Auto-include required features |

---

## Phase 1: Integration Code Templates (PRIORITY - Start Here)

Create actual code templates for each service provider integration.

### 1.1 Service Provider Template Structure

**Goal**: Create code templates that get copied into generated projects.

```
packages/templates/integrations/
├── auth/
│   ├── supabase/
│   │   ├── files.json           # Manifest of files to copy
│   │   ├── lib/auth.ts          # Auth client setup
│   │   ├── middleware.ts        # Auth middleware
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── UserMenu.tsx
│   │   └── hooks/useAuth.ts
│   ├── clerk/
│   ├── auth0/
│   └── nextauth/
├── payments/
│   ├── stripe/
│   │   ├── files.json
│   │   ├── lib/stripe.ts
│   │   ├── app/api/webhooks/stripe/route.ts
│   │   ├── components/
│   │   │   ├── PricingTable.tsx
│   │   │   ├── CheckoutButton.tsx
│   │   │   └── BillingPortal.tsx
│   │   └── hooks/useSubscription.ts
│   ├── paddle/
│   └── lemonsqueezy/
├── email/
│   ├── resend/
│   │   ├── files.json
│   │   ├── lib/email.ts
│   │   ├── emails/
│   │   │   ├── welcome.tsx
│   │   │   ├── reset-password.tsx
│   │   │   └── invoice.tsx
│   │   └── app/api/email/send/route.ts
│   ├── sendgrid/
│   └── postmark/
├── analytics/
│   ├── posthog/
│   ├── plausible/
│   └── ga4/
├── database/
│   ├── supabase/
│   ├── prisma/
│   └── drizzle/
├── ai/
│   ├── openai/
│   ├── anthropic/
│   └── google/
├── storage/
│   ├── supabase-storage/
│   ├── cloudinary/
│   └── uploadthing/
├── search/
│   ├── algolia/
│   ├── meilisearch/
│   └── typesense/
└── monitoring/
    ├── sentry/
    ├── logflare/
    └── axiom/
```

### 1.2 Integration Manifest Schema

Each integration folder has a `files.json` manifest:

```typescript
interface IntegrationManifest {
  id: string;                    // e.g., "stripe"
  name: string;                  // e.g., "Stripe"
  category: string;              // e.g., "payments"
  files: {
    path: string;                // Destination path in project
    template: string;            // Source template file
    transform?: 'mustache' | 'none';  // Template processing
  }[];
  dependencies: {
    npm: string[];               // npm packages to install
    env: string[];               // Required env variables
  };
  postInstall?: string;          // Instructions shown after generation
}
```

### 1.3 Priority Integrations to Build

| Priority | Category | Provider | Complexity | Files Needed |
|----------|----------|----------|------------|--------------|
| P0 | Auth | Supabase | Medium | auth.ts, middleware, LoginForm, SignupForm |
| P0 | Payments | Stripe | High | stripe.ts, webhook, PricingTable, Checkout |
| P1 | Email | Resend | Low | email.ts, templates, send API |
| P1 | Analytics | PostHog | Low | provider wrapper, useAnalytics hook |
| P1 | AI | OpenAI | Medium | client.ts, useAI hook, API routes |
| P2 | Storage | Supabase | Low | storage.ts, UploadButton component |
| P2 | Search | Algolia | Medium | search client, SearchBox component |
| P3 | Monitoring | Sentry | Low | sentry config, error boundary |

---

## Phase 2: Feature Code Templates

Create code templates for each selectable feature (from `lib/features.ts`).

### 2.1 Feature Template Structure

```
packages/templates/features/
├── user-management/
│   ├── social-login/
│   │   ├── files.json
│   │   ├── lib/auth/social-providers.ts
│   │   └── components/SocialButtons.tsx
│   ├── email-registration/
│   ├── guest-browsing/
│   └── admin-dashboard/
├── ecommerce/
│   ├── shopping-cart/
│   │   ├── files.json
│   │   ├── lib/cart/
│   │   │   ├── cart-context.tsx
│   │   │   └── cart-utils.ts
│   │   ├── components/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── AddToCart.tsx
│   │   └── hooks/useCart.ts
│   ├── checkout/
│   ├── wishlist/
│   └── order-history/
├── product-database/
│   ├── product-crud/
│   ├── categories/
│   └── inventory/
├── search-filter/
│   ├── basic-search/
│   ├── advanced-filters/
│   └── faceted-search/
├── billing/
│   ├── subscription-management/
│   ├── usage-billing/
│   └── invoicing/
├── enterprise/
│   ├── multi-tenant/
│   ├── rbac/
│   └── audit-logs/
└── analytics/
    ├── user-analytics/
    ├── conversion-tracking/
    └── dashboard-widgets/
```

### 2.2 Feature Manifest Schema

```typescript
interface FeatureManifest {
  id: string;
  name: string;
  category: string;
  files: {
    path: string;
    template: string;
    transform?: 'mustache' | 'none';
  }[];
  dependencies: {
    npm: string[];
    features: string[];      // Other features this depends on
    integrations: string[];  // Integrations required
  };
  previewComponent?: string;  // Component to show in preview
}
```

---

## Phase 3: Code Generator Orchestrator

The engine that combines everything into a working project.

### 3.1 Generator Architecture

```typescript
// lib/generator/index.ts

interface ProjectConfig {
  template: string;              // 'saas', 'ecommerce', etc.
  projectName: string;
  description: string;
  integrations: Record<string, string>;  // { auth: 'supabase', payments: 'stripe' }
  features: string[];            // Feature IDs selected
  branding: {
    colors: Record<string, string>;
    fonts: string[];
  };
}

interface GeneratedProject {
  files: {
    path: string;
    content: string;
    overwrite: boolean;
  }[];
  packageJson: {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    scripts: Record<string, string>;
  };
  envTemplate: string;
  readme: string;
  setupInstructions: string[];
}

async function generateProject(config: ProjectConfig): Promise<GeneratedProject> {
  // 1. Start with base template
  const baseFiles = await getTemplateBase(config.template);
  
  // 2. Resolve feature dependencies
  const allFeatures = resolveDependencies(config.features);
  
  // 3. Get integration files
  const integrationFiles = await getIntegrationFiles(config.integrations);
  
  // 4. Get feature files
  const featureFiles = await getFeatureFiles(allFeatures);
  
  // 5. Apply branding
  const brandedFiles = applyBranding(baseFiles, config.branding);
  
  // 6. Merge all files
  const allFiles = mergeFiles([brandedFiles, integrationFiles, featureFiles]);
  
  // 7. Generate package.json
  const packageJson = buildPackageJson(config, allFeatures);
  
  // 8. Generate .env.example
  const envTemplate = buildEnvTemplate(config.integrations);
  
  // 9. Generate README
  const readme = buildReadme(config);
  
  return { files: allFiles, packageJson, envTemplate, readme };
}
```

### 3.2 Generator Files to Create

| File | Purpose |
|------|---------|
| `lib/generator/index.ts` | Main orchestrator |
| `lib/generator/template-base.ts` | Load base template files |
| `lib/generator/integration-loader.ts` | Load integration code |
| `lib/generator/feature-loader.ts` | Load feature code |
| `lib/generator/dependency-resolver.ts` | Resolve feature dependencies |
| `lib/generator/file-merger.ts` | Merge and dedupe files |
| `lib/generator/branding-applier.ts` | Apply colors/fonts |
| `lib/generator/package-builder.ts` | Build package.json |
| `lib/generator/readme-builder.ts` | Generate README |

---

## Phase 4: Preview Enhancement

Make the preview accurately reflect the final output.

### 4.1 Feature Preview Components

Create visual representations for features in the preview:

```
components/preview/features/
├── AuthButtons.tsx        # Login/signup buttons for auth features
├── CartIcon.tsx           # Shopping cart with badge
├── SearchBar.tsx          # Search input for search features
├── AdminNav.tsx           # Admin navigation indicator
├── PricingPlans.tsx       # Pricing table for billing
├── AnalyticsWidget.tsx    # Mini analytics dashboard
└── SubscriptionBadge.tsx  # Subscription status indicator
```

### 4.2 Update PreviewRenderer

Modify `PreviewRenderer.tsx` to:
1. Accept `selectedFeatures` prop
2. Inject feature components into appropriate sections
3. Show integration indicators (e.g., Stripe badge on pricing)

### 4.3 Integration Indicators

Show visual badges for selected integrations:
- Auth provider badge on login/signup
- Payment provider badge on pricing/checkout
- Analytics provider in footer
- AI provider indicator where relevant

---

## Phase 5: Export System

Complete the export flow from preview to working project.

### 5.1 Export Methods

| Method | Implementation |
|--------|----------------|
| ZIP Download | Bundle generated files into downloadable ZIP |
| GitHub Repo | Create repo via GitHub API (requires OAuth) |
| NPX Clone | Generate shareable clone command |
| Vercel Deploy | One-click deploy to Vercel |

### 5.2 Export API Routes

| Route | Purpose |
|-------|---------|
| `POST /api/generate/project` | Generate project files |
| `POST /api/export/zip` | Create ZIP download |
| `POST /api/export/github` | Create GitHub repo |
| `GET /api/export/token/[id]` | Get sharable clone token |

---

## Implementation Order (What to Do First)

### Sprint 1: Foundation (Week 1)
**Goal**: Generate a basic working project

1. **Create integration template structure** (2 hours)
   - Set up `packages/templates/integrations/` directory
   - Create manifest schema types

2. **Build Supabase Auth integration template** (3 hours)
   - `auth.ts` with Supabase client
   - `middleware.ts` for route protection
   - `LoginForm.tsx` and `SignupForm.tsx`
   - `files.json` manifest

3. **Build Stripe integration template** (3 hours)
   - `stripe.ts` client setup
   - Webhook handler
   - `PricingTable.tsx` component
   - `CheckoutButton.tsx`

4. **Create generator orchestrator** (4 hours)
   - Basic file loading
   - Integration file merging
   - Package.json generation

5. **Update ZIP export** (2 hours)
   - Use generator output
   - Include all integration files

### Sprint 2: Features (Week 2)
**Goal**: Features generate working code

1. **Build feature templates** (4 hours each)
   - Shopping Cart
   - User Registration
   - Admin Dashboard

2. **Implement dependency resolver** (2 hours)

3. **Update feature selection UI** to show dependencies

### Sprint 3: Preview (Week 3)
**Goal**: Preview matches export exactly

1. **Create feature preview components** (4 hours)
2. **Update PreviewRenderer** with feature injection
3. **Add integration badges**

---

## Success Criteria Checklist

### Preview Accuracy
- [ ] Preview changes when template is selected
- [ ] Preview shows icons/badges for selected integrations
- [ ] Preview shows feature components (cart icon, search bar, etc.)
- [ ] Preview applies brand colors
- [ ] Preview layout matches template type

### Export Quality
- [ ] Generated ZIP builds without errors (`npm run build` passes)
- [ ] Auth integration works (login/signup functional)
- [ ] Payment integration configured (Stripe webhook included)
- [ ] Email templates included if Resend selected
- [ ] All selected features have working code
- [ ] `.env.example` lists all required variables
- [ ] `README.md` includes setup instructions

### Dependencies
- [ ] Feature dependencies auto-included (Checkout → Cart)
- [ ] Integration dependencies resolved (Stripe auth → needs auth provider)
- [ ] npm packages correctly listed in package.json

---

## Agent Task Assignment

| Task | Agent | Effort |
|------|-------|--------|
| Integration template structure | CLI Agent | 2h |
| Supabase auth template | Platform Agent | 3h |
| Stripe payment template | Platform Agent | 3h |
| Generator orchestrator | CLI Agent | 4h |
| Feature templates (each) | CLI Agent | 2h |
| Preview feature components | Website Agent | 4h |
| Export API routes | Platform Agent | 3h |

---

## Quick Reference: Files to Create

```
New files needed:
├── packages/templates/
│   ├── integrations/
│   │   ├── auth/supabase/
│   │   ├── payments/stripe/
│   │   ├── email/resend/
│   │   └── analytics/posthog/
│   └── features/
│       ├── ecommerce/shopping-cart/
│       ├── user-management/social-login/
│       └── billing/subscription-management/
├── website/lib/generator/
│   ├── index.ts
│   ├── template-base.ts
│   ├── integration-loader.ts
│   ├── feature-loader.ts
│   ├── dependency-resolver.ts
│   └── package-builder.ts
└── website/components/preview/features/
    ├── AuthButtons.tsx
    ├── CartIcon.tsx
    └── SearchBar.tsx
```
