# Export Test Configurations

> Testing Agent | 2026-01-04

These configs are used to validate exported projects after P0 fixes land.

## Test Matrix

| ID | Template | Integrations | Priority | Expected Result |
|----|----------|--------------|----------|-----------------|
| T01 | saas | supabase auth | P0 | Build with env vars |
| T02 | saas | clerk auth | P0 | Build succeeds |
| T03 | saas | stripe payments | P0 | Build succeeds |
| T04 | saas | resend email | P0 | Build with env vars |
| T05 | saas | anthropic ai | P0 | Build succeeds |
| T06 | saas | uploadthing storage | P0 | Build succeeds |
| T07 | saas | posthog analytics | P0 | Build succeeds |
| T08 | saas | all working integrations | P1 | Build with env vars |
| T09 | ecommerce | stripe + supabase | P1 | Build with env vars |
| T10 | blog | supabase + posthog | P1 | Build with env vars |

## Running Tests

### Prerequisites

1. Website Agent has completed P0 fixes
2. Dev server is running: `cd website && npm run dev`
3. Node 18+ installed

### Manual Test

```bash
# 1. Export a project
curl -X POST http://localhost:3000/api/export/zip \
  -H "Content-Type: application/json" \
  -d @export-test-configs/saas-minimal.json \
  --output test-export.zip

# 2. Extract and build
unzip test-export.zip -d test-export
cd test-export
npm install
npm run build

# Expected: Exit code 0
```

### Automated Test

```bash
# Run Playwright export tests
cd website
SKIP_WEBSERVER=true npx playwright test export-build.spec.ts --project=chromium
```

## Known Issues (Pre-P0 Fix)

1. **Supabase SSR prerendering**: Build fails without env vars at build time
2. **Missing base components**: Nav, Hero, etc. not included in export
3. **Missing integration templates**: Algolia, Sentry, Sanity, etc.

## Success Criteria

- [ ] All P0 tests pass (T01-T07)
- [ ] SaaS minimal export builds in < 60s
- [ ] All 8 base components present in export
- [ ] Supabase files at new paths (lib/supabase/*)

