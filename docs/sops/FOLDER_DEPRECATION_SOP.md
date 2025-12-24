# Folder Deprecation SOP

> **Version**: 1.0.0 | **Last Updated**: 2025-12-24
> 
> **Purpose**: Safe process for deprecating and removing old folder structures
> **Audience**: All agents, especially Documentation and Auditor
> **Principle**: "Deprecate gradually, remove safely"

---

## Table of Contents

1. [Overview](#1-overview)
2. [Deprecation Phases](#2-deprecation-phases)
3. [Current Deprecation: Agent Folders](#3-current-deprecation-agent-folders)
4. [Verification Checklist](#4-verification-checklist)
5. [Removal Process](#5-removal-process)

---

## 1. Overview

When folder structures change, immediate deletion is risky. This SOP defines a staged approach:

| Phase | Duration | Action |
|-------|----------|--------|
| **Parallel** | 1-2 weeks | Both old and new exist, new is primary |
| **Soft Deprecation** | 1 week | DEPRECATED.md added, files migrated |
| **Archive** | 30-60 days | Moved to `_archive/`, read-only |
| **Removal** | After 60 days | Permanently deleted |

---

## 2. Deprecation Phases

### Phase 1: Parallel Operation

**Duration**: 1-2 weeks from migration start

**Actions**:
- ✅ New structure created and operational
- ✅ All new work uses new paths
- ⚠️ Old structure remains for reference
- ⚠️ No new files added to old locations

**Verification**:
```bash
# Check no new files in old locations (modified in last 7 days)
find output/cli-agent output/website-agent -type f -mtime -7 | head -20
```

### Phase 2: Soft Deprecation

**Duration**: 1 week after Phase 1

**Actions**:
1. Add `DEPRECATED.md` to each old folder root
2. Move any remaining active files to new locations
3. Update all documentation references

**DEPRECATED.md Template**:
```markdown
# ⚠️ DEPRECATED FOLDER

**This folder has been deprecated as of [DATE].**

## New Location

All agent work folders are now at:
\`output/agents/[agent-name]/\`

## Migration

Files from this folder have been moved to:
\`output/agents/[agent-name]/\`

## Scheduled Removal

This folder will be archived on: [DATE + 2 weeks]
This folder will be deleted on: [DATE + 60 days]

## Questions?

Contact the Auditor Agent or Documentation Agent.
```

### Phase 3: Archive

**Duration**: 30-60 days

**Actions**:
1. Move deprecated folders to `output/_archive/`
2. Maintain read-only access
3. Final verification that nothing references archived paths

```bash
# Archive old folders
mkdir -p output/_archive/legacy-agent-folders
mv output/cli-agent output/_archive/legacy-agent-folders/
mv output/website-agent output/_archive/legacy-agent-folders/
# ... etc
```

### Phase 4: Removal

**Duration**: After 60 days from deprecation start

**Actions**:
1. Final grep for any remaining references
2. Delete archived folders
3. Remove `_archive/legacy-agent-folders/` directory

```bash
# Final check
grep -r "cli-agent\|website-agent\|controller-agents" . --include="*.md" 2>/dev/null

# If clean, remove
rm -rf output/_archive/legacy-agent-folders/
```

---

## 3. Current Deprecation: Agent Folders

### Status Tracker

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| New structure created | 2025-12-24 | ✅ Complete |
| Phase 1 start (Parallel) | 2025-12-24 | 🟡 In Progress |
| Documentation updated | 2025-12-31 | ⏳ Pending |
| Phase 2 start (Soft Deprecation) | 2026-01-07 | ⏳ Pending |
| Phase 3 start (Archive) | 2026-01-14 | ⏳ Pending |
| Phase 4 (Removal) | 2026-02-14 | ⏳ Pending |

### Old Locations (To Be Deprecated)

```
output/cli-agent/           → output/agents/cli/
output/website-agent/       → output/agents/website/
output/documentation-agent/ → output/agents/documentation/
output/testing-agent/       → output/agents/testing/
output/platform-agent/      → output/agents/platform/
output/template-agent/      → output/agents/template/
output/integration-agent/   → output/agents/integration/

output/controller-agents/auditor/    → output/agents/auditor/
output/controller-agents/strategist/ → output/agents/strategist/
output/controller-agents/curator/    → output/agents/curator/

output/media-pipeline/research-agent/ → output/agents/research/
output/media-pipeline/media-agent/    → output/agents/media/
output/media-pipeline/quality-agent/  → output/agents/quality/
```

### Files Still in Old Locations

Run this to check:
```bash
find output/cli-agent output/website-agent output/documentation-agent \
  output/testing-agent output/platform-agent output/template-agent \
  output/integration-agent output/controller-agents output/media-pipeline \
  -type f ! -name ".gitkeep" ! -name ".DS_Store" ! -name "DEPRECATED.md" \
  2>/dev/null | wc -l
```

---

## 4. Verification Checklist

Before moving to next phase:

### Pre-Archive Checklist
```markdown
- [ ] All governance files updated (CLAUDE.md, .cursorrules, AGENT_CONTEXT.md)
- [ ] All SOPs reference new paths
- [ ] No active prompts reference old paths
- [ ] DEPRECATED.md added to all old folders
- [ ] All agents aware of new structure
- [ ] At least 7 days since last file added to old location
```

### Pre-Removal Checklist
```markdown
- [ ] grep returns 0 results for old paths
- [ ] No agent sessions have used old paths in 30 days
- [ ] Archive has been in place for 30+ days
- [ ] Auditor Agent has signed off
```

---

## 5. Removal Process

### Verification Script

```bash
#!/bin/bash
# verify-deprecation.sh

echo "=== Deprecation Verification ==="
echo ""

# Check for references in docs
echo "References to old paths:"
count=$(grep -r "cli-agent\|website-agent\|documentation-agent\|testing-agent\|platform-agent\|template-agent\|integration-agent\|controller-agents\|media-pipeline" \
  --include="*.md" \
  CLAUDE.md .cursorrules AGENT_CONTEXT.md prompts/ docs/ 2>/dev/null | wc -l)
echo "  Found: $count references"

if [ "$count" -gt 0 ]; then
  echo "  ❌ Cannot proceed with removal - references exist"
  exit 1
fi

# Check for files in old locations
echo ""
echo "Files in old locations:"
old_files=$(find output/cli-agent output/website-agent output/documentation-agent \
  output/testing-agent output/platform-agent output/template-agent \
  output/integration-agent output/controller-agents output/media-pipeline \
  -type f ! -name ".gitkeep" ! -name ".DS_Store" ! -name "DEPRECATED.md" \
  2>/dev/null | wc -l)
echo "  Found: $old_files files"

if [ "$old_files" -gt 0 ]; then
  echo "  ⚠️  Files still exist - review before removal"
fi

echo ""
echo "=== Verification Complete ==="
```

### Removal Commands (Phase 4 Only)

```bash
# ONLY run after verification passes
# ONLY after 60 days from deprecation start

# Remove old executor agent folders
rm -rf output/cli-agent
rm -rf output/website-agent
rm -rf output/documentation-agent
rm -rf output/testing-agent
rm -rf output/platform-agent
rm -rf output/template-agent
rm -rf output/integration-agent

# Remove old controller folders
rm -rf output/controller-agents

# Remove old pipeline folders
rm -rf output/media-pipeline

# Commit
git add -A
git commit -m "chore: remove deprecated agent folder structure"
```

---

## Approval Chain

| Role | Agent | Date | Status |
|------|-------|------|--------|
| Author | Auditor Agent | 2025-12-24 | ✅ Drafted |
| Reviewer | | | ⏳ Pending |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-24 | Auditor Agent | Initial creation |

