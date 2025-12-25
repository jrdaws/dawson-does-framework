# Agent Context (Essential Reference)

> **Governance Version: 3.0** | Token-optimized
> For verbose details, see `docs/governance/FULL_CONTEXT.md`

---

## Project Vision

Build a hybrid platform for prototyping apps in web UI, then exporting to full local ownership via `npx`. Zero lock-in.

## Philosophy

| Principle | Meaning |
|-----------|---------|
| Export-First | Everything designed for local ownership |
| Zero Lock-In | Platform optional after export |
| Cursor-Native | Optimized for Claude + Cursor workflow |

---

## Architecture

```
dawson-does-framework/
├── bin/framework.js       # CLI entry point
├── src/dd/                 # Core modules (.mjs)
├── website/                # Next.js web configurator
├── templates/              # Starter templates
└── packages/               # Shared packages
```

## Key Flows

1. **Web → Local**: Configure in web UI → `npx @jrdaws/framework pull <token>` → full project
2. **CLI Export**: `framework export saas ./app` → scaffolds project
3. **Develop**: Open in Cursor → Claude assists → deploy

---

## Coding Standards

| Area | Rule |
|------|------|
| JavaScript (.mjs) | No semicolons, 2-space indent |
| TypeScript (.ts) | Semicolons, 2-space indent |
| Commits | Conventional: `feat:`, `fix:`, `docs:`, `chore:` |
| AI Prompts | Follow `docs/standards/PROMPT_STANDARDS.md` |
| API | Use `apiError`/`apiSuccess` helpers |

---

## What NOT to Do

- Add unrequested features
- Refactor unrelated code  
- Delete protected files (see below)
- Create feature branches (work on `main`)
- Split fenced output blocks

---

## Protected Files (Never Delete)

- `AGENT_CONTEXT.md`, `.cursorrules`
- `prompts/agents/memory/*.md`
- `prompts/agents/roles/*.md`
- `docs/standards/*`

Restore if deleted: `git checkout HEAD -- <file-path>`

---

## Agent Identity

End ALL responses with full role name in caps:

```
(CLI AGENT) | (WEBSITE AGENT) | (DOCUMENTATION AGENT)
```

---

## Quick Reference

| Command | When |
|---------|------|
| `npm test` | Before committing |
| `git pull origin main` | Before starting |
| `./scripts/rotate-memory.sh` | Keep memory lean |

---

*For scripts, fenced output rules, and detailed policies: `docs/governance/FULL_CONTEXT.md`*
