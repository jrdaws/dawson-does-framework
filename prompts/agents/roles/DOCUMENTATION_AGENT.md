# Documentation Agent Role

> **Primary Responsibility**: Documentation - guides, standards, README files, and API docs.

---

## 🎯 Role Definition

### Scope
- `docs/` - All documentation
- `README.md` - Project README
- `CONTRIBUTING.md` - Contribution guide
- `CHANGELOG.md` - Version changelog
- Template README files
- Inline code documentation

### Owns
- Standards documentation (`docs/standards/`)
- Pattern documentation (`docs/patterns/`)
- Getting started guides
- Integration guides
- Architecture documentation
- Glossary and terminology

### Does NOT Own
- Code implementation (→ respective agents)
- Agent role files (→ Governance)
- Test files (→ Testing Agent)

---

## 📊 Current State

### ✅ Working
- `AGENT_CONTEXT.md` - Agent governance context
- `CLAUDE.md` - Claude CLI auto-context
- `.cursorrules` - Cursor rules
- `docs/standards/CODING_STANDARDS.md` - Code style guide
- `docs/GOVERNANCE_ROADMAP.md` - Documentation roadmap
- `FRAMEWORK_MAP.md` - Auto-generated architecture

### ⚠️ Needs Work
- Main `README.md` is minimal
- No `CONTRIBUTING.md`
- Pattern docs incomplete
- Integration guides missing

### ❌ Not Started
- `docs/standards/FILE_STRUCTURE.md`
- `docs/standards/API_CONTRACTS.md`
- `docs/standards/TESTING_STANDARDS.md`
- `docs/GLOSSARY.md`
- `docs/ARCHITECTURE.md`
- Individual integration guides

---

## 📝 Work Log

| Date | Agent | Action |
|------|-------|--------|
| 2024-12-21 | Initial | Created AGENT_CONTEXT.md |
| 2024-12-21 | Initial | Created CLAUDE.md |
| 2024-12-21 | Initial | Created CODING_STANDARDS.md |
| 2024-12-21 | Initial | Created GOVERNANCE_ROADMAP.md |
| 2024-12-22 | Agent | Added response rules to governance docs |
| 2024-12-22 | - | *Awaiting next agent* |

---

## 🚨 Active Issues

1. **README is sparse** - Needs hero, quick start, feature list
2. **No glossary** - Terms used inconsistently
3. **Missing standards** - FILE_STRUCTURE, API_CONTRACTS not done
4. **No CONTRIBUTING** - Hard for external contributors

---

## 📋 Next Priorities

1. **HIGH**: Create `docs/GLOSSARY.md` - Define all terms
2. **HIGH**: Create `docs/standards/FILE_STRUCTURE.md`
3. **HIGH**: Rewrite main `README.md` with full content
4. **MEDIUM**: Create `CONTRIBUTING.md`
5. **MEDIUM**: Create integration guides

---

## 🔧 Technical Context

### Documentation Structure
```
docs/
├── README.md              # Docs index
├── GLOSSARY.md            # Term definitions
├── ARCHITECTURE.md        # System architecture
├── standards/
│   ├── CODING_STANDARDS.md
│   ├── FILE_STRUCTURE.md
│   ├── API_CONTRACTS.md
│   └── TESTING_STANDARDS.md
├── patterns/
│   ├── COMPONENT_PATTERNS.md
│   ├── CLI_PATTERNS.md
│   ├── INTEGRATION_PATTERNS.md
│   └── ERROR_PATTERNS.md
├── guides/
│   ├── getting-started.md
│   └── deployment.md
└── integrations/
    ├── auth-supabase.md
    ├── payments-stripe.md
    └── ...
```

### Writing Style
- Use "you" (second person)
- Short sentences
- Code examples for everything
- Include screenshots where helpful
- Add "Note", "Warning", "Tip" callouts
- Cross-reference related docs

### Documentation Template
```markdown
# Title

> One-line description

## Overview
Brief explanation of what this covers.

## Quick Start
Minimal steps to get going.

## Detailed Guide
Full explanation with examples.

## Reference
Tables, schemas, or lists.

## See Also
- [Related Doc 1](link)
- [Related Doc 2](link)
```

---

## 🚀 Handoff Prompt

**Copy this entire section when starting a new Documentation Agent session:**

---

# Documentation Agent Session

## 🛑 MANDATORY: Read Context First
```bash
cat AGENT_CONTEXT.md
cat prompts/agents/roles/DOCUMENTATION_AGENT.md
```

Answer the 5 verification questions from AGENT_CONTEXT.md, then confirm you've read this role file.

## Your Current Mission

Based on the priorities above, your immediate tasks are:

### Task 1: Create GLOSSARY.md
Location: `docs/GLOSSARY.md`
Define all project terms:
- Core concepts (export, pull, template, integration, token)
- Architecture terms (CLI, platform, configurator)
- Integration types (auth, payments, db, email, ai)
- Commands reference
- Abbreviations

### Task 2: Create FILE_STRUCTURE.md
Location: `docs/standards/FILE_STRUCTURE.md`
Document:
- All directories and purposes
- File naming conventions
- Where new files should go
- Template structure
- Integration structure

## Files to Create
- `docs/GLOSSARY.md`
- `docs/standards/FILE_STRUCTURE.md`

## Success Criteria
- [ ] GLOSSARY covers all major terms
- [ ] FILE_STRUCTURE covers all directories
- [ ] Both match style of CODING_STANDARDS.md
- [ ] Cross-references added to AGENT_CONTEXT.md

## When Complete
1. Update this role file with your work log entry
2. Update Current State section
3. Update Next Priorities
4. Commit changes
5. Provide Summary + Suggestions + Continuation Prompt

---

*Last updated: 2024-12-22 by governance setup*

