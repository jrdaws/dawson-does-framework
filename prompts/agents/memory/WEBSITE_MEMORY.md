# Website Agent Memory

> **Persistent memory for Website Agent sessions. Update this file at the end of EVERY session.**

---

## 🧠 Persistent Context

### Core Responsibilities
- Next.js app in `website/`
- UI components and pages
- Configurator flow
- Visual editor

### Critical Knowledge
- Next.js 15 with App Router
- TypeScript WITH semicolons
- Tailwind CSS + shadcn/ui
- Supabase for backend
- Terminal aesthetic theme

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
| Terminal aesthetic | Matches CLI-first philosophy | 2024-12-19 |
| Multi-step configurator | Better UX than single form | 2024-12-20 |
| shadcn/ui | Accessible, customizable | 2024-12-19 |
| | *Add your decisions here* | |

---

## 🔍 Active Context

### Current State
- ✅ Landing page complete
- ✅ Configurator flow working
- ✅ Export options (CLI, ZIP, Pull)
- ✅ Supabase integration
- ⚠️ Preview generation slow
- ⚠️ Mobile responsiveness issues
- ❌ Visual editor not connected

### In Progress
- Preview optimization

### Blocked
- None currently

---

## 📋 Task Queue

### High Priority
- [ ] Connect visual editor to preview
- [ ] Fix mobile responsiveness
- [ ] Add loading skeletons

### Medium Priority
- [ ] Improve error states
- [ ] Add transitions/animations
- [ ] Optimize preview generation

### Low Priority
- [ ] Dark/light mode toggle
- [ ] Collaboration UI
- [ ] Team workspace UI

---

## 🐛 Known Issues

| Issue | Severity | Notes |
|-------|----------|-------|
| Preview slow | High | 5+ seconds generation |
| Mobile layout breaks | High | Sidebar doesn't collapse |
| No loading states | Medium | Abrupt content changes |
| Editor unused | Medium | Components exist but not connected |

---

## 💭 Insights for Next Agent

1. **Component Location**: UI components in `website/components/ui/`, feature components in `website/app/components/`
2. **Styling**: Use Tailwind classes, follow terminal-* naming for theme colors
3. **State Management**: Using React hooks, no external state library
4. **API Routes**: In `website/app/api/`, use standard Response.json() format
5. **Testing**: No E2E yet, Playwright setup needed

---

## 🔗 Related Files

| File | Relevance |
|------|-----------|
| `website/app/page.tsx` | Landing page |
| `website/app/configure/page.tsx` | Main configurator |
| `website/app/components/configurator/` | Step components |
| `website/lib/supabase.ts` | Supabase client |
| `website/lib/templates.ts` | Template definitions |
| `website/lib/preview-generator.ts` | Preview logic |

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

