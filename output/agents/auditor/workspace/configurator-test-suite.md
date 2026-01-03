# Configurator Test Suite

**Purpose**: Systematic testing of configurator workflows with standard inputs and expected outputs for automated verification.

---

## Test Framework Overview

```
┌─────────────────┐     ┌───────────────┐     ┌─────────────────┐
│ Standard Inputs │ --> │ Configurator  │ --> │ Capture Output  │
│ (this file)     │     │ (manual/auto) │     │ (JSON/snapshot) │
└─────────────────┘     └───────────────┘     └─────────────────┘
                                                      │
                                                      v
                                              ┌─────────────────┐
                                              │ Auditor Agent   │
                                              │ Analyze + Report│
                                              └─────────────────┘
```

---

## Standard Test Inputs

### Test Case 1: Pet Food Subscription SaaS

**Persona**: Founder building a pet food delivery service

| Step | Input |
|------|-------|
| Template | `saas` |
| Research Domain | `Pet food subscription service for dogs and cats` |
| Inspiration URLs | `https://thefarmersdog.com`, `https://ollie.com` |
| Core Features | `email-registration`, `social-login`, `shopping-cart`, `checkout-flow` |
| AI Provider | `anthropic` |
| Project Name | `PetBox` |
| Output Dir | `petbox` |

**Expected Outputs**:
- Research should suggest: payments integration, subscription billing, user management
- Template should remain `saas` (good fit)
- Features should include e-commerce category items
- Export command: `npx @jrdaws/framework clone petbox`

---

### Test Case 2: Fitness Coaching Dashboard

**Persona**: Personal trainer building client management app

| Step | Input |
|------|-------|
| Template | `dashboard` |
| Research Domain | `Fitness coaching platform for personal trainers to manage clients` |
| Inspiration URLs | `https://trainerize.com`, `https://everfit.io` |
| Core Features | `admin-dashboard`, `user-tracking`, `analytics` |
| AI Provider | `openai` |
| Project Name | `FitCoach Pro` |
| Output Dir | `fitcoach-pro` |

**Expected Outputs**:
- Research should suggest: user management, scheduling, progress tracking
- Template should remain `dashboard` (good fit)
- Should recommend analytics features
- Export command: `npx @jrdaws/framework clone fitcoach-pro`

---

### Test Case 3: Minimal Blog (Skip Path)

**Persona**: Developer who just wants a blog, no bells and whistles

| Step | Input |
|------|-------|
| Template | `blog` |
| Research Domain | (skip - leave empty or minimal) |
| Inspiration URLs | (none) |
| Core Features | `page-views` only |
| AI Provider | (skip if possible) |
| Project Name | `My Dev Blog` |
| Output Dir | `my-dev-blog` |

**Expected Outputs**:
- Should complete with minimal configuration
- No research results (skipped)
- Single feature selected
- Fast path to export

---

### Test Case 4: E-commerce Store (Full Path)

**Persona**: Someone building a complete online store

| Step | Input |
|------|-------|
| Template | `ecommerce` |
| Research Domain | `Online boutique selling handmade jewelry` |
| Inspiration URLs | `https://mejuri.com`, `https://catbirdnyc.com` |
| Core Features | All e-commerce features + search + analytics |
| AI Provider | `anthropic` |
| Project Name | `Sparkle & Co` |
| Output Dir | `sparkle-co` |
| Tools | All marked complete |

**Expected Outputs**:
- Research should analyze jewelry e-commerce patterns
- All integrations enabled (auth, payments, db)
- All e-commerce features selected
- Full export ready

---

### Test Case 5: Landing Page (Quick Launch)

**Persona**: Startup launching a waitlist page

| Step | Input |
|------|-------|
| Template | `landing-page` |
| Research Domain | `AI writing assistant for marketers` |
| Inspiration URLs | `https://jasper.ai`, `https://copy.ai` |
| Core Features | Minimal |
| AI Provider | Skip |
| Project Name | `WriteBot` |
| Output Dir | `writebot` |

**Expected Outputs**:
- Quick path through wizard
- Email collection focus
- Landing page template features

---

### Test Case 6: API Backend Only

**Persona**: Backend developer building REST API

| Step | Input |
|------|-------|
| Template | `api-backend` |
| Research Domain | `Payment processing API for small businesses` |
| Core Features | `email-registration`, `admin-dashboard` |
| AI Provider | Skip |
| Project Name | `PaySimple API` |
| Output Dir | `paysimple-api` |

**Expected Outputs**:
- No frontend components
- Auth and DB required
- API-focused structure

---

## Output Capture Schema

When testing, capture outputs in this JSON format:

```json
{
  "testCase": "1-pet-food-saas",
  "timestamp": "2025-12-26T10:00:00Z",
  "inputs": {
    "template": "saas",
    "researchDomain": "Pet food subscription service for dogs and cats",
    "inspirationUrls": ["https://thefarmersdog.com", "https://ollie.com"],
    "selectedFeatures": {
      "user-management": ["email-registration", "social-login"],
      "ecommerce": ["shopping-cart", "checkout-flow"]
    },
    "aiProvider": "anthropic",
    "projectName": "PetBox",
    "outputDir": "petbox",
    "toolsCompleted": ["cursor", "github", "supabase", "vercel"]
  },
  "outputs": {
    "researchResult": {
      "suggestedTemplate": "saas",
      "suggestedFeatures": [...],
      "suggestedIntegrations": [...],
      "competitorInsights": "..."
    },
    "finalConfig": {
      "template": "saas",
      "features": [...],
      "integrations": {...}
    },
    "exportCommand": "npx @jrdaws/framework clone petbox",
    "completedSteps": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "progressPercentage": 100
  },
  "issues": []
}
```

---

## Automated Test Script

Create `website/tests/configurator-e2e.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

const TEST_CASES = [
  {
    name: "Pet Food SaaS",
    template: "saas",
    domain: "Pet food subscription service for dogs and cats",
    features: ["email-registration", "social-login", "shopping-cart"],
    expectedTemplate: "saas",
  },
  // ... more test cases
];

for (const tc of TEST_CASES) {
  test(`Configurator: ${tc.name}`, async ({ page }) => {
    await page.goto("/configure");
    
    // Step 1: Select template
    await page.click(`[data-template="${tc.template}"]`);
    await expect(page.locator(`[data-template="${tc.template}"]`)).toHaveClass(/selected/);
    
    // Step 2: Enter research domain
    await page.fill('input[placeholder*="domain"]', tc.domain);
    
    // Step 3: Select features
    for (const feature of tc.features) {
      await page.click(`[data-feature="${feature}"]`);
    }
    
    // Verify progress
    const progress = await page.locator('[data-testid="progress"]').textContent();
    expect(progress).toContain("/10");
    
    // Capture final state
    const state = await page.evaluate(() => {
      return (window as any).__CONFIGURATOR_STATE__;
    });
    
    // Output for agent analysis
    console.log(JSON.stringify({
      testCase: tc.name,
      inputs: tc,
      outputs: state,
    }, null, 2));
  });
}
```

---

## Agent Analysis Prompt

After running tests, feed outputs to an agent with this prompt:

```
Analyze the configurator test results below. For each test case:

1. **Validate Expected vs Actual**:
   - Did the research suggest the expected template?
   - Were the expected features recommended?
   - Did progress tracking work correctly?

2. **Identify Gaps**:
   - Any features that should have been suggested but weren't?
   - Any UI issues (missing labels, unclear steps)?
   - Any validation errors that shouldn't have occurred?

3. **Propose Fixes**:
   - For each gap, suggest a specific code change
   - Prioritize by impact (HIGH/MEDIUM/LOW)

TEST RESULTS:
[paste JSON output here]
```

---

## Manual Testing Checklist

### Pre-Test Setup
- [ ] Clear browser localStorage
- [ ] Open DevTools Network tab
- [ ] Open DevTools Console

### Per Test Case
- [ ] Navigate to /configure
- [ ] Follow input sequence exactly
- [ ] Capture screenshots at each step
- [ ] Note any console errors
- [ ] Record final export command
- [ ] Save state from DevTools: `localStorage.getItem('configurator-storage')`

### Post-Test
- [ ] Compare expected vs actual outputs
- [ ] Document any discrepancies
- [ ] Create GitHub issues for bugs

---

## Running the Test Suite

### Option 1: Playwright (Automated)

```bash
cd website
npx playwright test tests/configurator-e2e.spec.ts --headed
```

### Option 2: Manual with State Export

1. Open https://dawson-does-framework.vercel.app/configure
2. Complete each test case
3. In browser console, run:
   ```javascript
   JSON.stringify(window.localStorage.getItem('configurator-storage'))
   ```
4. Save output to `tests/snapshots/{test-case-name}.json`

### Option 3: Agent-Assisted Testing

```
Next Agent: Testing Agent

Execute configurator test suite:
1. Read output/agents/auditor/workspace/configurator-test-suite.md
2. Run Test Cases 1-6 manually or via Playwright
3. Capture outputs in JSON format
4. Analyze results against expected outcomes
5. Report gaps to output/agents/testing/workspace/configurator-test-report.md
```

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Test cases passing | 100% |
| Research recommendations accuracy | >80% match expected |
| Progress tracking correct | 10/10 steps tracked |
| Export command generated | For all complete configurations |
| No console errors | 0 errors |
| Load time (first paint) | <2 seconds |

---

## Appendix: State Schema

The configurator stores state in Zustand with this shape:

```typescript
interface ConfiguratorState {
  currentStep: Step; // 1-10
  completedSteps: Set<number>;
  mode: "guided" | "expert";
  template: string;
  inspirations: Inspiration[];
  description: string;
  projectName: string;
  outputDir: string;
  integrations: Record<string, string>;
  envKeys: Record<string, string>;
  vision: string;
  mission: string;
  successCriteria: string;
  modelTier: ModelTier;
  selectedFeatures: Record<string, string[]>;
  toolStatus: Record<string, boolean>;
  researchDomain: string;
  inspirationUrls: string[];
  aiProvider: string;
  aiApiKey: string;
}
```

Access via DevTools:
```javascript
// If using Zustand with persist middleware
JSON.parse(localStorage.getItem('configurator-storage'))
```

