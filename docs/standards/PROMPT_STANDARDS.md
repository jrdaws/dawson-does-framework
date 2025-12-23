# Prompt Standards

> **Version: 1.0** | Last Updated: 2025-12-22
> 
> **Required reading for all agents writing AI prompts in dawson-does-framework.**

## Overview

This document defines the standards for writing token-efficient, high-quality AI prompts. All prompts in `packages/ai-agent/src/prompts/` must follow these guidelines.

**Goal:** Maximize output quality while minimizing token usage.

---

## Quick Reference

| Principle | Description | Example |
|-----------|-------------|---------|
| Concise pattern notation | Use arrows and pipes | `template→pages\|components\|routes` |
| Inline schemas | Single-line OUTPUT specs | `OUTPUT: {name,type,props{}}` |
| No redundant headers | Skip "## Section" when inline works | Just write the content |
| Minimal whitespace | Condensed structure | Pipe-delimited lists |
| No meta-instructions | Remove explanatory prose | Keep only actionable patterns |
| Condensed code patterns | Single-line examples | Inline pattern syntax |

---

## Token Optimization Techniques

### 1. Concise Pattern Notation

Use arrows (`→`) and pipes (`|`) to compress relationships and alternatives.

```markdown
# ❌ BAD: Verbose lists (high token count)
## Template Patterns

### SaaS Template
- Pages: Home, Dashboard, Settings, Pricing
- Components: Hero, Features, Pricing, DashboardLayout, SettingsForm
- API Routes: /api/auth, /api/billing, /api/user

### Landing Page Template
- Pages: Home, About, Contact
- Components: Hero, Features, Testimonials, CTA, ContactForm
- API Routes: /api/contact, /api/newsletter
```

```markdown
# ✅ GOOD: Concise notation (low token count)
TEMPLATE PATTERNS:
saas→/,/dashboard,/settings,/pricing|Hero,Features,Pricing,DashboardLayout|/api/auth,/api/billing,/api/user
landing→/,/about,/contact|Hero,Features,Testimonials,CTA,ContactForm|/api/contact,/api/newsletter
```

**Token savings:** ~60% reduction

### 2. Inline Schema Declarations

Define output schemas on a single line using shorthand notation.

```markdown
# ❌ BAD: Multi-line JSON schema (high token count)
## Output Format

Return a JSON object with the following structure:

```json
{
  "category": "string (saas|landing-page|dashboard|blog)",
  "confidence": "number between 0 and 1",
  "reasoning": "string explaining the analysis",
  "suggestedTemplate": "string",
  "features": ["array", "of", "strings"],
  "integrations": {
    "auth": "string or null",
    "payments": "string or null",
    "db": "string or null"
  }
}
```
```

```markdown
# ✅ GOOD: Inline schema (low token count)
OUTPUT: {category,confidence:0-1,reasoning,suggestedTemplate,features[],integrations:{auth?,payments?,db?}}
```

**Token savings:** ~80% reduction

### 3. Remove Redundant Headers

Skip section headers when content is self-explanatory or inline notation is clearer.

```markdown
# ❌ BAD: Redundant headers
## Input Variables

The following input variables are provided:

### Description
{description}

### Template
{template}

### Features
{features}
```

```markdown
# ✅ GOOD: Inline input spec
INPUT: {description} | TEMPLATE: {template} | FEATURES: {features}
```

**Token savings:** ~70% reduction

### 4. Minimal Whitespace

Use pipe-delimited lists and condensed structure. Remove blank lines between related items.

```markdown
# ❌ BAD: Excessive whitespace
## Detection Rules

### Auth Integration
- Triggers: login, users, signup, accounts, members
- Default provider: supabase

### Payments Integration
- Triggers: pricing, subscription, pay, checkout, billing
- Default provider: stripe

### Database Integration
- Triggers: data, store, save, persist
- Default provider: supabase
```

```markdown
# ✅ GOOD: Condensed format
DETECT INTEGRATIONS:
auth(supabase|clerk)→login|users|signup|accounts|members
payments(stripe|paddle)→pricing|subscription|pay|checkout|billing
db(supabase|planetscale)→data|store|save|persist [default:supabase]
```

**Token savings:** ~50% reduction

### 5. No Meta-Instructions

Remove explanatory prose that tells the AI what to do. Instead, show the pattern directly.

```markdown
# ❌ BAD: Meta-instructions
You should analyze the user's description and determine which template category 
it belongs to. Consider the following categories and their characteristics.
When you identify keywords related to a category, assign it higher confidence.
Make sure to extract all features mentioned in the description.
```

```markdown
# ✅ GOOD: Direct patterns
DETECT TEMPLATE:
saas→subscription|users|auth|dashboard|billing|platform
landing→marketing|conversion|launch|showcase|website
dashboard→admin|analytics|charts|metrics|internal|reports
```

**Token savings:** ~90% reduction

### 6. Condensed Code Patterns

Replace multi-line code examples with single-line patterns.

```markdown
# ❌ BAD: Full code examples (high token count)
## Page Pattern

```typescript
export default function PageName() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Page Title</h1>
      {/* TODO: Add content */}
    </main>
  );
}
```
```

```markdown
# ✅ GOOD: Inline pattern (low token count)
PAGE PATTERN: export default function Name(){return(<main className="container mx-auto px-4 py-8"><h1>Title</h1>{/*TODO*/}</main>)}
```

**Token savings:** ~65% reduction

---

## Prompt Structure Template

All prompts should follow this structure:

```markdown
[1-line task description]
INPUT: {variables}

[Detection/pattern rules using pipe notation]

[Template patterns if applicable]

[Rules as single line or minimal list]

OUTPUT: {inline schema}
```

### Example: Optimized Prompt

```markdown
Analyze project, output JSON intent.
INPUT: {description}

TEMPLATES: saas(auth+billing+dashboard)|landing-page(marketing)|dashboard(analytics)|blog(content)|directory(SEO)|ecommerce(products+cart)

DETECT TEMPLATE:
saas→subscription|users|auth|dashboard|billing|platform
landing→marketing|conversion|launch|showcase|website
dashboard→admin|analytics|charts|metrics|internal

DETECT INTEGRATIONS:
auth(supabase|clerk)→login|users|signup|accounts
payments(stripe|paddle)→pricing|subscription|pay|checkout
db(supabase|planetscale)→data|store|save [default:supabase]

COMPLEXITY: simple=single-purpose+CRUD|moderate=multi-feature|complex=many-integrations

OUTPUT: {category,confidence:0-1,reasoning,suggestedTemplate,features[],integrations:{auth?,payments?,db?},complexity,keyEntities[]}
```

---

## Notation Reference

### Arrows and Pipes

| Symbol | Meaning | Example |
|--------|---------|---------|
| `→` | "produces" or "maps to" | `saas→dashboard` |
| `\|` | "or" (alternatives) | `auth\|payments\|db` |
| `+` | "and" (combined) | `auth+billing+dashboard` |
| `,` | List separator | `Hero,Features,Pricing` |
| `:` | Key-value pair | `confidence:0-1` |
| `?` | Optional field | `auth?` |
| `[]` | Array | `features[]` |
| `{}` | Object | `integrations:{auth?,db?}` |
| `()` | Provider options | `auth(supabase\|clerk)` |
| `[default:x]` | Default value | `[default:supabase]` |

### Common Abbreviations

| Full | Short |
|------|-------|
| description | desc |
| configuration | config |
| authentication | auth |
| database | db |
| component | comp |
| template | tpl |

---

## Quality Guidelines

### Do Include

- ✅ Clear task statement (first line)
- ✅ Input variable declaration
- ✅ Detection patterns with trigger words
- ✅ Output schema (inline JSON notation)
- ✅ Default values where applicable

### Do Not Include

- ❌ Explanatory prose about what the AI should do
- ❌ Multiple examples (one pattern is enough)
- ❌ Verbose JSON schemas (use inline notation)
- ❌ Redundant section headers
- ❌ Blank lines between related items
- ❌ Full code blocks when patterns suffice

---

## Validation Checklist

Before committing a prompt file, verify:

- [ ] First line is a clear task description
- [ ] Input variables declared inline
- [ ] Uses arrow/pipe notation for patterns
- [ ] Output schema is single-line
- [ ] No explanatory meta-instructions
- [ ] No redundant headers
- [ ] Minimal blank lines
- [ ] Code examples are inline patterns (if needed at all)

---

## Token Budget Guidelines

| Prompt Type | Target Tokens | Max Tokens |
|-------------|---------------|------------|
| Intent analysis | 300-400 | 500 |
| Architecture design | 300-400 | 500 |
| Code generation | 250-350 | 450 |
| Context generation | 250-350 | 450 |
| **Total (all prompts)** | **1,200-1,500** | **2,000** |

### Measuring Token Count

```bash
# Quick estimate: chars / 4 ≈ tokens
for f in packages/ai-agent/src/prompts/*.md; do
  echo "$f: $(wc -c < "$f") chars (~$(($(wc -c < "$f")/4)) tokens)"
done
```

---

## Migration Guide

When optimizing existing prompts:

1. **Identify verbose sections** - Headers, prose, examples
2. **Convert to pattern notation** - Use `→` and `|`
3. **Inline schemas** - Single-line OUTPUT declaration
4. **Remove meta-instructions** - Keep only actionable patterns
5. **Condense code examples** - Inline patterns or remove
6. **Validate output quality** - Run tests, compare results
7. **Measure token reduction** - Use `wc -c` estimate

### Expected Reductions

| Technique | Typical Reduction |
|-----------|-------------------|
| Pattern notation | 50-60% |
| Inline schemas | 70-80% |
| Remove headers | 60-70% |
| Minimal whitespace | 40-50% |
| No meta-instructions | 80-90% |
| Condensed code | 60-65% |
| **Combined** | **40-50%** |

---

## Version History

### Version 1.0 (2025-12-22)
- Initial release
- Defined 6 core optimization techniques
- Created notation reference
- Established token budgets
- Added validation checklist

---

*For coding standards, see `CODING_STANDARDS.md`*
*For API contracts, see `API_CONTRACTS.md`*
*For AI engine overview, see `AI_GENERATION_ENGINE.md`*

