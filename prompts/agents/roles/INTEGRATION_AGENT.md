# Integration Agent Role

> **Primary Responsibility**: Integration patterns - auth, payments, email, database, AI integrations.

---

## 🎯 Role Definition

### Scope
- `templates/*/integrations/` - All integration implementations
- `src/dd/integrations.mjs` - Integration validation and application
- `src/dd/integration-schema.mjs` - Schema definitions
- Integration documentation

### Owns
- Integration file structure
- `integration.json` files
- Provider implementations (Supabase, Stripe, etc.)
- Integration testing
- Integration documentation

### Does NOT Own
- Template content outside integrations (→ Template Agent)
- CLI integration flags (→ CLI Agent)
- Website integration UI (→ Website Agent)

---

## 📊 Current State

### ✅ Working
- Supabase Auth integration (templates/saas/integrations/auth/supabase/)
- Supabase DB integration (templates/saas/integrations/db/supabase/)
- Basic Stripe integration structure
- Integration validation system
- integration.json schema

### ⚠️ Needs Work
- Stripe integration incomplete (needs webhook handling)
- No Clerk auth integration
- No Resend email integration
- PostHog analytics not implemented

### ❌ Not Started
- LemonSqueezy payments
- Paddle payments
- SendGrid email
- OpenAI integration
- S3/R2 storage

---

## 📝 Work Log

| Date | Agent | Action |
|------|-------|--------|
| 2024-12-19 | Initial | Created Supabase auth integration |
| 2024-12-19 | Initial | Created Supabase DB integration |
| 2024-12-19 | Initial | Started Stripe integration structure |
| 2024-12-22 | - | *Awaiting next agent* |

---

## 🚨 Active Issues

1. **Stripe incomplete** - Missing webhook route and portal
2. **No alternative auth** - Only Supabase, need Clerk/NextAuth
3. **No email integrations** - Critical for SaaS templates
4. **Testing gaps** - Integrations not tested in isolation

---

## 📋 Next Priorities

1. **HIGH**: Complete Stripe integration with webhooks
2. **HIGH**: Add Clerk auth integration
3. **HIGH**: Add Resend email integration
4. **MEDIUM**: Add PostHog analytics integration
5. **LOW**: Add LemonSqueezy payments

---

## 🔧 Technical Context

### Integration Structure
```
templates/{template}/integrations/{type}/{provider}/
├── integration.json      # REQUIRED - metadata
├── package.json          # Additional dependencies
├── app/
│   ├── api/{routes}/     # API routes
│   └── {pages}/          # Page routes
├── components/
│   └── {type}/           # Type-specific components
├── lib/
│   └── {provider}.ts     # Provider client
└── middleware.ts         # If needed
```

### integration.json Schema
```json
{
  "provider": "supabase",
  "type": "auth",
  "version": "1.0.0",
  "description": "What this integration does",
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  },
  "envVars": [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  ],
  "files": {
    "lib": ["lib/**"],
    "components": ["components/**"],
    "app": ["app/**"]
  },
  "conflicts": ["clerk"],
  "requires": [],
  "postInstallInstructions": "Setup instructions..."
}
```

### Integration Types
| Type | Purpose | Priority Providers |
|------|---------|-------------------|
| `auth` | Authentication | supabase, clerk, nextauth |
| `payments` | Payments | stripe, lemonsqueezy, paddle |
| `db` | Database | supabase, planetscale, neon |
| `email` | Email sending | resend, sendgrid |
| `ai` | AI/LLM | openai, anthropic |
| `analytics` | Analytics | posthog, plausible |
| `storage` | File storage | supabase, s3, r2 |

---

## 🚀 Handoff Prompt

**Copy this entire section when starting a new Integration Agent session:**

---

# Integration Agent Session

## 🛑 MANDATORY: Read Context First
```bash
cat AGENT_CONTEXT.md
cat prompts/agents/roles/INTEGRATION_AGENT.md
```

Answer the 5 verification questions from AGENT_CONTEXT.md, then confirm you've read this role file.

## Your Current Mission

Based on the priorities above, your immediate tasks are:

### Task 1: Complete Stripe Integration
Add to `templates/saas/integrations/payments/stripe/`:
- Webhook route at `app/api/stripe/webhook/route.ts`
- Customer portal at `app/api/stripe/portal/route.ts`
- Pricing component at `components/pricing/pricing-table.tsx`
- Stripe client at `lib/stripe.ts`

### Task 2: Add Clerk Auth Integration
Create `templates/saas/integrations/auth/clerk/`:
- integration.json with dependencies
- Middleware for auth protection
- Sign-in/sign-up pages
- User button component

## Files to Create/Modify
- `templates/saas/integrations/payments/stripe/` - Complete implementation
- `templates/saas/integrations/auth/clerk/` - New integration

## Success Criteria
- [ ] Stripe webhook handles subscription events
- [ ] Clerk integration has middleware and components
- [ ] Both have valid integration.json
- [ ] Both test with `framework export saas ./test --payments stripe`

## When Complete
1. Update this role file with your work log entry
2. Update Current State section
3. Update Next Priorities
4. Commit changes
5. Provide Summary + Suggestions + Continuation Prompt

---

*Last updated: 2024-12-22 by governance setup*

