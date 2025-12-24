# Documentation Agent Task: Configurator Expectations Clarification

**Priority**: P1
**Date**: 2025-12-24
**From**: Quality Agent

---

## Context

User confusion exists around what the configurator delivers. The AI Preview shows a full e-commerce site, but ZIP download contains only starter files.

## Documentation Needed

### 1. "What You Get" Comparison

Create a clear comparison table for the website:

| Feature | ZIP Download | CLI Export |
|---------|--------------|------------|
| Basic Next.js setup | ✅ | ✅ |
| Integration dependencies | ✅ | ✅ |
| .dd context files | ✅ | ✅ |
| Pre-built components | ❌ | ✅ |
| Auth flows | ❌ | ✅ |
| Product pages | ❌ | ✅ |
| Cart & Checkout | ❌ | ✅ |
| API routes | ❌ | ✅ |

### 2. AI Preview Disclaimer

Add to the Preview step:
```
⚠️ This preview demonstrates the FULL template capabilities. 
ZIP download contains starter files. For the complete template 
with all components shown, use the CLI command.
```

### 3. Export Step Clarity

Update the Export step to clearly differentiate options:

**Option A: CLI Command** (Recommended)
- Full template with pre-built components
- Authentication flows included
- Production-ready code

**Option B: Download ZIP**
- Starter structure
- Dependencies pre-configured
- .dd context files for future AI assistance
- Requires CLI upgrade for full components

### 4. README Template Update

Update the generated README to be more explicit:

```markdown
## Important Note

This ZIP contains a **starter structure**, not the full template.

For the complete template with:
- ✅ Pre-built e-commerce components
- ✅ Authentication flows
- ✅ Product catalog & cart
- ✅ Checkout with Stripe

Run this command:
\`\`\`bash
npx @jrdaws/framework export ecommerce ./mytestproject06
\`\`\`

Your `.dd/` context files will be preserved.
```

---

## Files to Update

| File | Changes |
|------|---------|
| `docs/configurator/export-options.md` | Create new doc |
| `website/README.md` | Add export options section |
| ZIP README template | Add explicit "starter vs full" note |

---

*Documentation Agent Task | P1 | 2025-12-24*

