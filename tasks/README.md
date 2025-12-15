# Tasks folder

This folder is generated/updated by `scripts/orchestrate.mjs`.

## Files you will see
- `tasks/01-research.md` - Research plan + findings + recommended actions
- `tasks/02-executor.md` - Concrete build steps + code/file edits to perform
- `tasks/03-reviewer.md` - Audit + fixes + quality checks
- `tasks/HANDOFF.md` - "Compacting" summary to paste into a fresh Cursor chat
- `tasks/RULES_AUDIT.md` - "Follow rules" workflow compliance audit

## Commands
- Start sequence:
  node scripts/orchestrate.mjs start

- Audit rules / workflow:
  node scripts/orchestrate.mjs follow-rules

- Generate compact handoff summary:
  node scripts/orchestrate.mjs compacting
