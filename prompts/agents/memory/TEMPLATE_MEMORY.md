# Template Agent Memory

> **Persistent memory for Template Agent sessions. Update this file at the end of EVERY session.**

---

## 🧠 Persistent Context

### Core Responsibilities
- Templates in `templates/`
- Template structure and quality
- template.json metadata
- Component selection per template

### Critical Knowledge
- Templates must be self-contained Next.js apps
- Every template needs `template.json`
- Integrations go in `integrations/{type}/{provider}/`
- Templates should work with `npm install && npm run dev`

---

## 📅 Session History

| Date | Duration | Session ID | Summary |
|------|----------|------------|---------|
| 2024-12-22 | Initial | Setup | Created memory file, established baseline |
| | | | *Add your session here* |

---

## 💡 Key Decisions

| Decision | Reasoning | Date |
|----------|-----------|------|
| Next.js for all templates | Consistent stack, SSR support | 2024-12-19 |
| shadcn/ui components | Accessible, customizable | 2024-12-19 |
| Optional integrations | Flexibility, no bloat | 2024-12-19 |
| | *Add your decisions here* | |

---

## 🔍 Active Context

### Current State
- ✅ `saas/` template - basic structure
- ✅ `seo-directory/` template - basic structure
- ✅ Both have template.json
- ⚠️ Templates are minimal
- ❌ `landing-page/` not started
- ❌ `dashboard/` not started
- ❌ `blog/` not started

### In Progress
- None currently

### Blocked
- None currently

---

## 📋 Task Queue

### High Priority
- [ ] Create `landing-page/` template
- [ ] Create `dashboard/` template
- [ ] Add more pages to `saas/`

### Medium Priority
- [ ] Add dark mode to all templates
- [ ] Create `blog/` template
- [ ] Add sample data to templates

### Low Priority
- [ ] Template variants (minimal, full)
- [ ] More UI components per template

---

## 🐛 Known Issues

| Issue | Severity | Notes |
|-------|----------|-------|
| Templates minimal | Medium | Just layouts, no real features |
| No dark mode | Low | Only light theme |
| No sample data | Low | Templates feel empty |

---

## 💭 Insights for Next Agent

1. **Template Structure**: Must include template.json, package.json, next.config.js, tsconfig.json
2. **Testing**: Run `npm install && npm run dev` to verify template works
3. **Responsive**: Test at 375px, 768px, 1024px minimum
4. **Accessibility**: Use semantic HTML, proper headings, ARIA where needed
5. **Integration Ready**: Structure supports adding integrations later

---

## 🔗 Related Files

| File | Relevance |
|------|-----------|
| `templates/saas/template.json` | Reference template metadata |
| `templates/saas/app/layout.tsx` | Reference layout structure |
| `src/dd/registry.mjs` | Template discovery system |
| `docs/GOVERNANCE_ROADMAP.md` | Template quality standards |

---

## ✏️ How to Update This File

At the end of your session, add:

1. **Session Entry**: Date, duration, what you did
2. **Decisions**: Any choices you made and why
3. **Task Updates**: Mark done, add new tasks
4. **Issues**: Any bugs found
5. **Insights**: Tips for the next agent

---

*Last Updated: 2024-12-22 by governance setup*

