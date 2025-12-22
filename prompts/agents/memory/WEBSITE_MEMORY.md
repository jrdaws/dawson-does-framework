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
| 2024-12-22 | 60min | Session-1 | Built complete visual editor system: types, contexts, all components (VisualEditor, CollaborativeVisualEditor, PropertiesPanel, SelectionOverlay, etc.), iframe bridge utilities |

---

## 💡 Key Decisions

| Decision | Reasoning | Date |
|----------|-----------|------|
| Terminal aesthetic | Matches CLI-first philosophy | 2024-12-19 |
| Multi-step configurator | Better UX than single form | 2024-12-20 |
| shadcn/ui | Accessible, customizable | 2024-12-19 |
| iframe-based editor | Isolation prevents style conflicts, postMessage for communication | 2024-12-22 |
| Collaborative architecture | Built collaboration hooks even if not fully implemented yet | 2024-12-22 |
| Three-panel layout | Properties left, preview center, structure right - standard IDE pattern | 2024-12-22 |

---

## 🔍 Active Context

### Current State
- ✅ Landing page complete
- ✅ Configurator flow working
- ✅ Export options (CLI, ZIP, Pull)
- ✅ Supabase integration
- ✅ Visual editor fully built and integrated
- ✅ Editor components (VisualEditor, CollaborativeVisualEditor, PropertiesPanel, SelectionOverlay, ComponentTree, UndoRedoToolbar)
- ✅ Editor utilities (types, iframe-bridge)
- ⚠️ Preview generation slow
- ⚠️ Mobile responsiveness issues
- ⚠️ Collaboration features stubbed (need WebSocket/Supabase Realtime)

### In Progress
- Preview optimization

### Blocked
- None currently

---

## 📋 Task Queue

### High Priority
- [x] Connect visual editor to preview
- [ ] Fix mobile responsiveness
- [ ] Add loading skeletons
- [ ] Test visual editor end-to-end

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
| Collaboration stubbed | Low | Hooks exist but no backend connection |
| Editor needs E2E testing | Medium | Built but not tested in real scenario |

---

## 💭 Insights for Next Agent

1. **Component Location**: UI components in `website/components/ui/`, feature components in `website/app/components/`
2. **Styling**: Use Tailwind classes, follow terminal-* naming for theme colors
3. **State Management**: Using React hooks, no external state library
4. **API Routes**: In `website/app/api/`, use standard Response.json() format
5. **Testing**: No E2E yet, Playwright setup needed
6. **Editor Architecture**: iframe isolation with postMessage bridge, edit mode toggled in AIPreview.tsx
7. **Editor Files**: All in `website/app/components/editor/`, utilities in `website/lib/editor/`
8. **Next Steps**: Test editor, implement real collaboration, fix mobile responsiveness

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

*Last Updated: 2024-12-22 Session-1 by Website Agent*

