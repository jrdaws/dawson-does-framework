# Website Agent Role

> **Primary Responsibility**: Next.js web configurator - UI components, pages, and user experience.

---

## 🎯 Role Definition

### Scope
- `website/` - Entire Next.js application
- `website/app/` - App router pages and API routes
- `website/components/` - Shared UI components
- `website/lib/` - Client-side utilities

### Owns
- Configurator UI flow (template selection → export)
- Visual editor components
- Preview system UI
- Export modal and options
- Landing page and marketing

### Does NOT Own
- CLI implementation (→ CLI Agent)
- Backend API logic beyond website needs (→ Platform Agent)
- Template content (→ Template Agent)

---

## 📊 Current State

### ✅ Working
- Landing page with terminal aesthetic
- Configurator multi-step flow
- Template selection UI
- Integration selection UI
- Export options (CLI, ZIP, Pull)
- Supabase integration for project storage
- Basic preview placeholder

### ⚠️ Needs Work
- AI Preview generation (partially implemented)
- Visual editor (components created but not integrated)
- Mobile responsiveness
- Loading states and error handling

### ❌ Not Started
- Real-time collaboration UI
- Team workspace UI
- Deploy button integration
- Component library browser

---

## 📝 Work Log

| Date | Agent | Action |
|------|-------|--------|
| 2024-12-19 | Initial | Created terminal-aesthetic landing page |
| 2024-12-20 | Initial | Built configurator multi-step flow |
| 2024-12-21 | Agent B | Added Supabase project storage |
| 2024-12-21 | Agent C | Created preview generation API |
| 2024-12-22 | - | *Awaiting next agent* |

---

## 🚨 Active Issues

1. **Preview generation slow** - Takes 5+ seconds, needs optimization
2. **Mobile layout breaks** - Configurator sidebar doesn't collapse properly
3. **No loading skeletons** - Abrupt content changes
4. **Editor components unused** - Visual editor was built but not connected

---

## 📋 Next Priorities

1. **HIGH**: Connect visual editor to preview
2. **HIGH**: Fix mobile responsiveness
3. **MEDIUM**: Add loading skeletons and transitions
4. **MEDIUM**: Improve error states with retry options
5. **LOW**: Add dark/light mode toggle

---

## 🔧 Technical Context

### File Locations
```
website/
├── app/
│   ├── page.tsx              # Landing page
│   ├── configure/
│   │   └── page.tsx          # Main configurator
│   ├── api/
│   │   ├── projects/         # Project CRUD
│   │   └── preview/          # Preview generation
│   └── components/
│       └── configurator/     # Step components
├── components/
│   └── ui/                   # shadcn components
└── lib/
    ├── supabase.ts           # Supabase client
    ├── templates.ts          # Template definitions
    ├── command-builder.ts    # CLI command generation
    └── preview-generator.ts  # Preview logic
```

### Coding Standards
- TypeScript with semicolons
- 2-space indent
- Use shadcn/ui components
- Tailwind CSS for styling
- Server components by default, "use client" only when needed

### Key Patterns
```typescript
// Component structure
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: Props) {
  const [loading, setLoading] = useState(false);
  
  return (
    <div className="terminal-window">
      <h2>{title}</h2>
      <Button onClick={onAction} disabled={loading}>
        Action
      </Button>
    </div>
  );
}
```

---

## 🚀 Handoff Prompt

**Copy this entire section when starting a new Website Agent session:**

---

# Website Agent Session

## 🛑 MANDATORY: Read Context First
```bash
cat AGENT_CONTEXT.md
cat prompts/agents/roles/WEBSITE_AGENT.md
```

Answer the 5 verification questions from AGENT_CONTEXT.md, then confirm you've read this role file.

## Your Current Mission

Based on the priorities above, your immediate tasks are:

### Task 1: Connect Visual Editor to Preview
- Editor components exist at `website/app/components/editor/`
- Connect them to the preview iframe
- Enable click-to-select and property editing

### Task 2: Fix Mobile Responsiveness
- Configurator sidebar needs collapse/drawer on mobile
- Steps should stack vertically on small screens
- Test on 375px, 768px, 1024px breakpoints

## Files to Modify
- `website/app/configure/page.tsx` - Add mobile layout
- `website/app/components/configurator/*.tsx` - Mobile styles
- `website/app/components/editor/*.tsx` - Connect to preview

## Success Criteria
- [ ] Visual editor selects elements in preview
- [ ] Configurator works on mobile
- [ ] No TypeScript errors
- [ ] Lighthouse mobile score > 80

## When Complete
1. Update this role file with your work log entry
2. Update Current State section
3. Update Next Priorities
4. Commit changes
5. Provide Summary + Suggestions + Continuation Prompt

---

*Last updated: 2024-12-22 by governance setup*

