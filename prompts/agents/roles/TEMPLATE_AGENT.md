# Template Agent Role

> **Primary Responsibility**: Starter templates - creation, maintenance, and quality.

---

## 🎯 Role Definition

### Scope
- `templates/` - All starter templates
- Template structure and content
- `template.json` metadata files
- Component quality within templates

### Owns
- Template creation and updates
- Template testing and validation
- Shadcn component selection per template
- Template documentation (README.md per template)

### Does NOT Own
- Integration implementations (→ Integration Agent)
- CLI export logic (→ CLI Agent)
- Template registry code (→ CLI Agent)

---

## 📊 Current State

### ✅ Working
- `saas/` - Basic SaaS starter with layout
- `seo-directory/` - SEO-focused directory template
- Both have `template.json` metadata
- Integration directories structured

### ⚠️ Needs Work
- `saas/` needs more pages (dashboard, settings)
- `seo-directory/` needs actual directory functionality
- Neither has comprehensive component library

### ❌ Not Started
- `landing-page/` template
- `dashboard/` template
- `blog/` template
- Template variants (dark mode, minimal, etc.)

---

## 📝 Work Log

| Date | Agent | Action |
|------|-------|--------|
| 2024-12-19 | Initial | Created saas and seo-directory templates |
| 2024-12-19 | Initial | Added template.json to both |
| 2024-12-22 | - | *Awaiting next agent* |

---

## 🚨 Active Issues

1. **Templates are minimal** - Just basic layout, no real functionality
2. **No dark mode** - Templates only have light theme
3. **Missing pages** - No dashboard, settings, profile pages
4. **No sample data** - Templates feel empty

---

## 📋 Next Priorities

1. **HIGH**: Create `landing-page/` template with hero, features, CTA
2. **HIGH**: Create `dashboard/` template with sidebar, stats, tables
3. **MEDIUM**: Add more pages to `saas/` template
4. **MEDIUM**: Add dark mode support to all templates
5. **LOW**: Create `blog/` template

---

## 🔧 Technical Context

### Template Structure
```
templates/{template-id}/
├── template.json        # REQUIRED - metadata
├── package.json         # REQUIRED - dependencies
├── next.config.js       # REQUIRED - Next.js config
├── tsconfig.json        # REQUIRED - TypeScript config
├── tailwind.config.js   # Tailwind configuration
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   └── ui/              # Shadcn components
├── public/              # Static assets
└── integrations/        # Optional integrations
    ├── auth/{provider}/
    └── payments/{provider}/
```

### template.json Schema
```json
{
  "id": "template-id",
  "name": "Template Name",
  "version": "1.0.0",
  "description": "What this template is for",
  "author": "Dawson Does",
  "category": "saas|marketing|dashboard|blog",
  "tags": ["tag1", "tag2"],
  "minFrameworkVersion": "0.3.0",
  "capabilities": ["responsive", "dark-mode"],
  "supportedIntegrations": {
    "auth": ["supabase", "clerk"],
    "payments": ["stripe"]
  },
  "requiredIntegrations": []
}
```

### Quality Checklist
- [ ] Runs with `npm install && npm run dev`
- [ ] Mobile responsive (375px+)
- [ ] Dark mode support (optional but preferred)
- [ ] No TypeScript errors
- [ ] Accessible (proper headings, ARIA)
- [ ] Fast (Lighthouse > 90)

---

## 🚀 Handoff Prompt

**Copy this entire section when starting a new Template Agent session:**

---

# Template Agent Session

## 🛑 MANDATORY: Read Context First
```bash
cat AGENT_CONTEXT.md
cat prompts/agents/roles/TEMPLATE_AGENT.md
```

Answer the 5 verification questions from AGENT_CONTEXT.md, then confirm you've read this role file.

## Your Current Mission

Based on the priorities above, your immediate tasks are:

### Task 1: Create `landing-page/` Template
Modern marketing landing page with:
- Hero section with gradient background
- Features grid (3-6 features with icons)
- Testimonials section
- Pricing table (if payments integration)
- FAQ accordion
- CTA section
- Footer

### Task 2: Create `dashboard/` Template
Admin dashboard with:
- Sidebar navigation
- Top header with user menu
- Dashboard stats cards
- Data table component
- Charts placeholder
- Settings page shell

## Files to Create
- `templates/landing-page/` - Complete template structure
- `templates/dashboard/` - Complete template structure

## Success Criteria
- [ ] Both templates run with `npm run dev`
- [ ] Both have valid `template.json`
- [ ] Both are mobile responsive
- [ ] Landing page has 5+ sections
- [ ] Dashboard has sidebar + 3+ page shells

## When Complete
1. Update this role file with your work log entry
2. Update Current State section
3. Update Next Priorities
4. Commit changes
5. Provide Summary + Suggestions + Continuation Prompt

---

*Last updated: 2024-12-22 by governance setup*

