# CLI Agent Task: Template Export Alignment

**Priority**: P1
**Date**: 2025-12-24
**From**: Quality Agent

---

## Context

Analysis of a configurator export revealed that the ZIP download is significantly different from what the CLI `framework export` command delivers. This creates user confusion.

## Current State

**ZIP Download Contains**:
```
mytestproject06/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx (just "Next Steps" placeholder)
├── .dd/
│   ├── goals.md
│   ├── template-manifest.json
│   └── vision.md
├── package.json (with integration deps)
├── README.md
└── [config files]
```

**CLI Export Should Contain**:
- Full e-commerce template components
- Product pages, cart, checkout flows
- Auth UI components
- Navigation
- All integrations wired up

## Tasks

### 1. Document CLI vs ZIP Differences

Create clear documentation showing:
- What ZIP download includes (starter files + context)
- What CLI export includes (full template)
- When to use each option

### 2. Verify CLI Export Matches Preview

When a user sees the AI Preview showing:
- Product grid
- Navigation
- Login/Sign Up
- Cart functionality

The CLI `framework export ecommerce ./project` should deliver these components.

### 3. Consider "Upgrade Path"

Add a command that "upgrades" a ZIP starter to a full template:
```bash
framework upgrade ./mytestproject06
```

This would:
1. Read `.dd/template-manifest.json`
2. Fetch full template for that type
3. Merge with user's existing context
4. Preserve any custom changes

---

## Verification

```bash
# Test that CLI export includes e-commerce components
framework export ecommerce ./test-project
ls ./test-project/app/components/
# Should see: ProductGrid, Cart, Checkout, etc.
```

---

*CLI Agent Task | P1 | 2025-12-24*

