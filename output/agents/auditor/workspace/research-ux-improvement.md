# Research Section UX Improvement Proposal

## Problem

Users are confused why Step 2 (Research) asks about "domain" when they just selected a template in Step 1. The placeholder text ("e.g., E-commerce, SaaS...") uses the same terminology as templates, making it seem redundant.

## Current Implementation

```tsx
<Label>What domain is your project in?</Label>
<Input placeholder="e.g., E-commerce, SaaS..." />
```

## Proposed Changes

### Option A: Better Label + Examples (Quick Fix)

```tsx
<Label>Describe your specific niche</Label>
<Input placeholder="e.g., Pet food subscription, Fitness coaching platform..." />
<p className="text-hint">
  Be specific! "Pet food subscription" gets better recommendations than just "SaaS"
</p>
```

### Option B: Contextual Help (Better UX)

```tsx
<Label>
  What exactly are you building?
  <Tooltip>
    You selected the {template} template. Now tell us your specific niche 
    so AI can recommend the right features. Example: If you chose "SaaS", 
    tell us if it's "HR software for restaurants" or "Video editing tool".
  </Tooltip>
</Label>
<Input placeholder={`Your ${template} for...`} />
```

### Option C: Smart Pre-fill (Best UX)

When user selects a template, pre-fill the domain with a sensible default they can refine:

| Template Selected | Pre-filled Domain |
|------------------|-------------------|
| SaaS Starter | "Software as a Service - describe your specific product" |
| E-commerce | "Online store selling..." |
| Blog | "Blog about..." |
| Dashboard | "Admin dashboard for..." |

```tsx
useEffect(() => {
  if (template && !domain) {
    setResearchDomain(DOMAIN_PROMPTS[template]);
  }
}, [template]);

const DOMAIN_PROMPTS = {
  saas: "SaaS product for [describe your users and what problem you solve]",
  ecommerce: "Online store selling [describe your products]",
  blog: "Blog about [describe your topic and audience]",
  dashboard: "Dashboard for managing [describe what data/operations]",
};
```

## Visual Indicator of Relationship

Add a "connection" between Step 1 and Step 2:

```
┌─────────────┐     ┌──────────────────────────────┐
│ Template    │ --> │ Research                     │
│ [SaaS] ✓    │     │ "Project management for..."  │
└─────────────┘     │                              │
                    │ AI will recommend features   │
                    │ specific to your niche       │
                    └──────────────────────────────┘
```

## Implementation Priority

1. **Immediate**: Change placeholder text (5 min fix)
2. **Short-term**: Add contextual help tooltip
3. **Medium-term**: Smart pre-fill based on template

## Files to Modify

- `website/app/components/configurator/sections/ResearchSection.tsx`
- `website/app/configure/page.tsx` (for pre-fill logic)

