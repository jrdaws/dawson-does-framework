# Preview & Project Generation System - Task Breakdown

## Overview

This document outlines the tasks needed to build a complete preview and project generation system that:
1. Shows different layouts per template
2. Uses design inspiration from crawled URLs
3. Reflects selected features in the preview
4. Generates functional code matching the configuration

---

## Phase 1: Template Layouts (P1)

Create template-specific base layouts that the preview and generator use.

### 1.1 Define Template Layouts
- [ ] **Create layout definitions** for each template type
  - `saas` - Dashboard + landing page + pricing
  - `ecommerce` - Product grid + cart + checkout
  - `blog` - Article list + single post + categories
  - `dashboard` - Sidebar nav + data panels + charts
  - `landing-page` - Hero + features + CTA + testimonials
  - `portfolio` - Project grid + about + contact
  - `api-backend` - API docs + playground + status

**File**: `website/lib/templates/layouts.ts`

### 1.2 Template Component Library
- [ ] **Create base components** for each template
  - Header variants (sticky, floating, transparent)
  - Footer variants (simple, multi-column, minimal)
  - Hero sections (centered, split, image-bg)
  - Feature grids (2-col, 3-col, alternating)
  - Pricing tables (toggle, comparison, simple)

**Directory**: `website/components/templates/`

---

## Phase 2: Feature → Code Mapping (P1)

Map each selectable feature to actual code components.

### 2.1 Feature Registry
- [ ] **Create feature-to-code registry**
  ```typescript
  interface FeatureDefinition {
    id: string;
    category: string;
    components: string[];        // Component files to include
    pages: string[];             // Page routes to create
    apiRoutes: string[];         // API endpoints needed
    dbSchema?: string;           // Prisma/Supabase schema
    dependencies: string[];      // npm packages
    envVars: string[];           // Required env variables
  }
  ```

**File**: `website/lib/features/registry.ts`

### 2.2 Feature Code Templates
Create code templates for each feature category:

| Category | Features | Code Output |
|----------|----------|-------------|
| **User Management** | Social Login, Email Registration, Guest Browsing, Admin Dashboard | Auth components, middleware, user API |
| **Product Database** | Nutritional Info, Price Tracking, Stock Availability | DB schema, CRUD API, data models |
| **Search & Filter** | Advanced Search, Category Filter | Search component, filter API |
| **E-commerce** | Shopping Cart, Checkout, Order History, Wishlist, Inventory | Cart context, checkout flow, order API |
| **Enterprise** | Multi-tenant, Role-based Access, Audit Logs | Tenant isolation, RBAC middleware |
| **Billing** | Stripe Integration, Subscription Management | Billing components, webhook handlers |

**Directory**: `packages/templates/features/`

### 2.3 Feature Dependency Graph
- [ ] **Build dependency resolution**
  - "Checkout" requires "Shopping Cart"
  - "Subscription" requires "Stripe Integration"
  - "Admin Dashboard" requires "User Management"

**File**: `website/lib/features/dependencies.ts`

---

## Phase 3: Preview Generator (P2)

Dynamic preview that reflects user's configuration.

### 3.1 Enhanced LivePreviewPanel
- [ ] **Update LivePreviewPanel** to accept:
  - `template` → Use template-specific layout
  - `features` → Show feature components
  - `brandColors` → Apply color scheme
  - `integrations` → Show service cards

### 3.2 Feature Preview Components
- [ ] **Create preview representations** for features:
  - Shopping Cart → Cart icon with badge
  - User Auth → Login/signup buttons
  - Product Grid → Sample product cards
  - Search → Search bar with filters
  - Checkout → Multi-step form preview

**Directory**: `website/components/preview/features/`

### 3.3 Template Preview Layouts
- [ ] **Create preview layouts** per template:
  - E-commerce: Header + Hero + Products + Cart
  - SaaS: Header + Hero + Pricing + CTA
  - Blog: Header + Featured + Article Grid
  - Dashboard: Sidebar + Stats + Charts

**Directory**: `website/components/preview/layouts/`

### 3.4 Design Inspiration Integration
- [ ] **Extract design elements** from crawled URLs:
  - Color palette extraction
  - Font detection
  - Layout pattern identification
  - Apply to preview styling

---

## Phase 4: Project Generator (P2)

Generate actual code files from configuration.

### 4.1 Code Generation Engine
- [ ] **Create generation orchestrator**:
  ```typescript
  async function generateProject(config: ProjectConfig): Promise<GeneratedProject> {
    const files: GeneratedFile[] = [];
    
    // 1. Base template files
    files.push(...getTemplateFiles(config.template));
    
    // 2. Feature files
    for (const feature of config.features) {
      files.push(...getFeatureFiles(feature));
    }
    
    // 3. Integration configs
    files.push(...getIntegrationFiles(config.integrations));
    
    // 4. Environment template
    files.push(generateEnvFile(config));
    
    // 5. README with setup instructions
    files.push(generateReadme(config));
    
    return { files, dependencies, scripts };
  }
  ```

**File**: `website/lib/generator/index.ts`

### 4.2 Template File Generation
- [ ] **Base project structure** per template:
  - `package.json` with dependencies
  - `next.config.js` with settings
  - `tailwind.config.js` with theme
  - `app/layout.tsx` with providers
  - `app/page.tsx` with template layout

### 4.3 Feature Code Injection
- [ ] **Merge feature code** into project:
  - Copy component files
  - Add to exports
  - Update imports
  - Inject into pages

### 4.4 Integration Setup
- [ ] **Configure integrations**:
  - Stripe: Add webhook handler, billing components
  - Supabase: Add client config, auth middleware
  - Resend: Add email templates, send functions
  - Analytics: Add tracking provider, event hooks

### 4.5 ZIP/Clone Output
- [ ] **Package for delivery**:
  - ZIP download: Bundle all files
  - NPX clone: Push to temp storage, generate clone token
  - GitHub repo: Create repo via GitHub API

---

## Phase 5: AI Enhancement (P3)

Use AI to improve generation quality.

### 5.1 AI-Powered Customization
- [ ] **Use Claude to**:
  - Generate custom copy based on vision
  - Suggest feature combinations
  - Create component variations
  - Write documentation

### 5.2 Design Intelligence
- [ ] **Apply ML/AI for**:
  - Color palette from brand description
  - Layout optimization suggestions
  - Accessibility recommendations
  - Performance hints

---

## Implementation Priority

| Phase | Priority | Effort | Dependencies |
|-------|----------|--------|--------------|
| Phase 1: Template Layouts | P1 | Medium | None |
| Phase 2: Feature Mapping | P1 | High | Phase 1 |
| Phase 3: Preview Generator | P2 | Medium | Phase 1, 2 |
| Phase 4: Project Generator | P2 | High | Phase 1, 2 |
| Phase 5: AI Enhancement | P3 | Medium | Phase 3, 4 |

---

## Quick Wins (Can Do Now)

1. **Show features in preview** - Add feature cards to LivePreviewPanel
2. **Template-aware layouts** - Switch preview layout based on template
3. **Feature count in preview** - Show which features are selected
4. **Color scheme preview** - Apply brand colors to preview

---

## Agent Task Distribution

| Task | Agent | Prompt |
|------|-------|--------|
| Template layouts | Website Agent | "Create template layout definitions in `lib/templates/layouts.ts`" |
| Feature registry | CLI Agent | "Create feature-to-code registry in `lib/features/registry.ts`" |
| Preview components | Website Agent | "Create feature preview components in `components/preview/features/`" |
| Code generator | CLI Agent | "Implement project generator in `lib/generator/`" |
| AI customization | Platform Agent | "Add Claude integration for copy generation" |

---

## Success Criteria

- [ ] Preview changes when template is selected
- [ ] Preview shows selected features as visual elements
- [ ] Preview applies brand colors
- [ ] Generated ZIP contains all selected feature code
- [ ] Generated project builds without errors
- [ ] README includes setup instructions for all integrations

