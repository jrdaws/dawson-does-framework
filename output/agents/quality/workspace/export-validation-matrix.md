# Export Validation Matrix

> **Purpose**: Define 20 test configurations to validate that framework inputs produce valid, buildable outputs
> **Generated**: 2026-01-03
> **Status**: Ready for Testing Agent execution

---

## Test Configuration Matrix

### Tier 1: Single Integration Tests (5 tests)

| ID | Template | Integrations | Expected Files | Priority |
|----|----------|--------------|----------------|----------|
| T01 | saas | auth: supabase | login, callback, middleware | P0 |
| T02 | saas | auth: clerk | sign-in, sign-up, middleware | P0 |
| T03 | saas | payments: stripe | checkout, portal, webhook | P0 |
| T04 | saas | email: resend | email templates, send API | P1 |
| T05 | saas | analytics: posthog | provider, page view tracker | P1 |

### Tier 2: Common Combinations (5 tests)

| ID | Template | Integrations | Expected Files | Priority |
|----|----------|--------------|----------------|----------|
| T06 | saas | auth: supabase, payments: stripe | All auth + billing flows | P0 |
| T07 | saas | auth: clerk, payments: stripe | All auth + billing flows | P0 |
| T08 | ecommerce | auth: supabase, payments: stripe, email: resend | Full e-commerce stack | P0 |
| T09 | blog | auth: supabase, analytics: posthog | Content platform baseline | P1 |
| T10 | dashboard | auth: supabase, analytics: posthog | Admin dashboard baseline | P1 |

### Tier 3: Full Stack Tests (5 tests)

| ID | Template | Integrations | Expected Files | Priority |
|----|----------|--------------|----------------|----------|
| T11 | saas | auth, payments, email, analytics | All 4 integrations | P0 |
| T12 | ecommerce | auth, payments, email, analytics, search: algolia | 5 integrations | P1 |
| T13 | saas | auth, payments, email, analytics, ai: openai | AI-powered SaaS | P1 |
| T14 | saas | auth, payments, storage: uploadthing | File-based SaaS | P1 |
| T15 | saas | All available integrations | Maximum complexity | P2 |

### Tier 4: Edge Cases (5 tests)

| ID | Template | Integrations | Expected Files | Priority |
|----|----------|--------------|----------------|----------|
| T16 | saas | (none) | Base template only | P0 |
| T17 | landing-page | analytics: posthog | Static site with analytics | P1 |
| T18 | blog | auth: clerk, analytics: plausible | Alt providers | P2 |
| T19 | seo-directory | search: algolia | Search-focused template | P2 |
| T20 | saas | auth: supabase (with custom colors) | Branding application | P1 |

---

## Validation Checks Per Export

### Level 1: Structure Validation (Automated)
```
[ ] ZIP file downloads successfully (non-zero size)
[ ] ZIP extracts without errors
[ ] package.json exists and is valid JSON
[ ] All expected directories present (app/, lib/, components/)
[ ] .env.local.example contains all required env vars
[ ] README.md exists and has setup instructions
```

### Level 2: Dependency Validation (Automated)
```
[ ] npm install completes without errors
[ ] All integration dependencies in package.json
[ ] No missing peer dependencies warnings (critical)
[ ] TypeScript types install correctly
```

### Level 3: Build Validation (Automated)
```
[ ] npm run build completes without errors
[ ] No TypeScript type errors
[ ] No missing import errors
[ ] No "next/headers" in client components
[ ] All pages compile successfully
```

### Level 4: Content Validation (Automated)
```
[ ] Integration files match expected templates
[ ] API routes export correct handlers (GET, POST, etc.)
[ ] Middleware protects expected routes
[ ] Provider components wrap children correctly
```

### Level 5: Runtime Validation (Manual/E2E)
```
[ ] npm run dev starts successfully
[ ] Homepage loads without errors
[ ] Auth flow works (login/logout)
[ ] API routes respond correctly
[ ] Integrations connect to services (with test keys)
```

---

## Expected Outputs Per Integration

### auth: supabase
```
lib/supabase/client.ts
lib/supabase/server.ts
lib/supabase/index.ts
lib/supabase/middleware.ts
middleware.ts
app/(auth)/login/page.tsx
app/(auth)/signup/page.tsx
app/auth/callback/route.ts
components/auth/LoginForm.tsx
components/auth/SignupForm.tsx
components/auth/UserMenu.tsx
hooks/useAuth.ts

ENV: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### auth: clerk
```
middleware.ts
app/sign-in/[[...sign-in]]/page.tsx
app/sign-up/[[...sign-up]]/page.tsx
components/auth/ClerkProvider.tsx
components/auth/UserButton.tsx
components/auth/SignInButton.tsx

ENV: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
```

### payments: stripe
```
lib/stripe/client.ts
lib/stripe/server.ts
lib/stripe/config.ts
app/api/stripe/checkout/route.ts
app/api/stripe/portal/route.ts
app/api/webhooks/stripe/route.ts
components/billing/PricingTable.tsx
components/billing/CheckoutButton.tsx
hooks/useSubscription.ts

ENV: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET
```

### email: resend
```
lib/email/resend.ts
lib/email/send.ts
emails/WelcomeEmail.tsx
emails/PasswordResetEmail.tsx
emails/InvoiceEmail.tsx
app/api/email/send/route.ts

ENV: RESEND_API_KEY, EMAIL_FROM
```

### analytics: posthog
```
lib/analytics/posthog.ts
components/analytics/PostHogProvider.tsx
components/analytics/PostHogPageView.tsx
hooks/useAnalytics.ts
hooks/useFeatureFlag.ts

ENV: NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST
```

### ai: openai
```
lib/ai/openai.ts
lib/ai/embeddings.ts
components/ai/ChatInterface.tsx
components/ai/ChatMessage.tsx
components/ai/ChatInput.tsx
hooks/useChat.ts
app/api/ai/chat/route.ts
app/api/ai/completion/route.ts

ENV: OPENAI_API_KEY
```

### search: algolia
```
lib/search/algolia.ts
lib/search/indexer.ts
components/search/SearchBox.tsx
components/search/SearchResults.tsx
components/search/SearchModal.tsx
hooks/useSearch.ts

ENV: NEXT_PUBLIC_ALGOLIA_APP_ID, NEXT_PUBLIC_ALGOLIA_SEARCH_KEY, ALGOLIA_ADMIN_KEY
```

### storage: uploadthing
```
lib/uploadthing.ts
app/api/uploadthing/core.ts
app/api/uploadthing/route.ts
components/upload/UploadButton.tsx
components/upload/UploadDropzone.tsx
components/upload/FilePreview.tsx
hooks/useUpload.ts

ENV: UPLOADTHING_SECRET, UPLOADTHING_APP_ID
```

---

## Success Criteria

| Level | Pass Rate Required | Description |
|-------|-------------------|-------------|
| P0 Tests | 100% | Must all pass for release |
| P1 Tests | 90% | Critical path functionality |
| P2 Tests | 75% | Nice-to-have edge cases |

### Overall Targets
- **Structure Validation**: 100% pass rate
- **Dependency Validation**: 100% pass rate
- **Build Validation**: 100% pass rate (critical for user trust)
- **Content Validation**: 95% pass rate
- **Runtime Validation**: 90% pass rate

---

## Test Execution Commands

```bash
# Run all automated tests
npm run test:exports

# Run specific tier
npm run test:exports -- --tier=1

# Run single test
npm run test:exports -- --id=T01

# Generate comparison report
npm run test:exports -- --compare --baseline=./baseline-exports/
```

---

## Baseline Exports

Store known-good exports for comparison:
```
output/agents/quality/baseline-exports/
├── T01-saas-supabase/
├── T06-saas-supabase-stripe/
├── T11-saas-full-stack/
└── checksums.json
```

Each baseline contains:
- Extracted project files
- `checksums.json` with file hashes
- `validation-result.json` with last test results

---

## Gap Analysis Template

After running tests, generate:

```markdown
## Gap Analysis Report

### Missing Files
| Test | Expected | Actual | Gap |
|------|----------|--------|-----|
| T01 | 12 files | 10 files | LoginForm.tsx, SignupForm.tsx |

### Build Failures
| Test | Error | Root Cause | Fix Required |
|------|-------|------------|--------------|
| T01 | next/headers in client | Mixed client/server imports | Split files |

### Dependency Issues
| Test | Package | Issue | Resolution |
|------|---------|-------|------------|
| T12 | @algolia/client | Peer dep warning | Add to package.json |
```

---

*Matrix Version: 1.0 | Created by Platform Agent*

