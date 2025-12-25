# Governance Card v3.0

## Philosophy
Export-first | Zero lock-in | Main branch only | Cursor-native

## Code Style
| Language | Semicolons | Indent |
|----------|------------|--------|
| .mjs | No | 2 spaces |
| .ts/.tsx | Yes | 2 spaces |

## Commands
```bash
npm test                    # Before commit
git add -A && git commit    # Save work
git push origin main        # Share work
```

## Never Do
- Delete protected files (.cursorrules, *_MEMORY.md, AGENT_CONTEXT.md)
- Create feature branches
- Add unrequested features
- Split fenced code blocks
- Add `#` comments in command blocks for humans

## Session Start (SLIM - Default)
```
✓ Governance 3.0 | Export-first | No protected file deletion
Proceeding with task...
```

## Session End (Tiered)

| Session Type | Required Steps |
|--------------|----------------|
| Simple (<30m) | Commit + Sign off |
| Standard (30m+) | Commit + Brief memory + Handoff if needed |
| Major (multi-hour) | Full protocol (memory, MINDFRAME, priorities) |

## Protected Files
.cursorrules | AGENT_CONTEXT.md | prompts/agents/memory/*.md | prompts/agents/roles/*.md

## Role Codes
CLI | WEB | DOC | TST | PLT | TPL | INT | RES | MED | QUA | AUD | STR | CUR

## Clean Command Blocks
Explanations OUTSIDE fence. Commands inside must be pure and runnable:
```bash
cd /path/to/project && command --flag
```

## Identity
End ALL responses: `(ROLE AGENT)` in ALL CAPS

