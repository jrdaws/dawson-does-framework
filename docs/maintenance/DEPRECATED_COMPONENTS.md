# Deprecated Components Registry

> Last Updated: 2026-01-03
> Maintained by: Website Agent

This document tracks deprecated components that are being phased out. Components follow a 3-phase lifecycle before deletion.

---

## Lifecycle Phases

| Phase | Duration | Status | Action |
|-------|----------|--------|--------|
| **1. Deprecated** | Day 0 | 🟡 Warning | Add `@deprecated` JSDoc, create replacement |
| **2. Archived** | Day 14+ | 🟠 Archive | Move to `/archive/` folder, remove from builds |
| **3. Deleted** | Day 30+ | 🔴 Delete | Permanent removal from codebase |

---

## Currently Deprecated Components

### PreviewCard.tsx

| Field | Value |
|-------|-------|
| **File** | `website/app/components/configurator/PreviewCard.tsx` |
| **Deprecated** | 2026-01-03 |
| **Replaced By** | `ProjectStatusCard.tsx` |
| **Reason** | Consolidated with ProjectOverviewBox into single component |
| **Archive Date** | 2026-01-17 |
| **Delete Date** | 2026-02-02 |
| **Status** | 🟡 Deprecated |

**What it contained:**
- NPX command with copy button
- Progress percentage and step count
- GitHub/Supabase/Vercel service status
- Template name, feature count
- Generate/View Docs buttons

---

### ProjectOverviewBox.tsx

| Field | Value |
|-------|-------|
| **File** | `website/app/components/configurator/ProjectOverviewBox.tsx` |
| **Deprecated** | 2026-01-03 |
| **Replaced By** | `ProjectStatusCard.tsx` |
| **Reason** | Consolidated with PreviewCard into single component |
| **Archive Date** | 2026-01-17 |
| **Delete Date** | 2026-02-02 |
| **Status** | 🟡 Deprecated |

**What it contained:**
- Project name
- Description/vision
- Domain
- AI Enhanced badge
- Template & feature stats
- Feature category badges

---

## Archive Process

When a component reaches its Archive Date:

1. Create archive folder if not exists:
   ```bash
   mkdir -p website/archive/configurator
   ```

2. Move deprecated files:
   ```bash
   mv website/app/components/configurator/PreviewCard.tsx website/archive/configurator/
   mv website/app/components/configurator/ProjectOverviewBox.tsx website/archive/configurator/
   ```

3. Update this document to show 🟠 Archive status

4. Add README to archive folder explaining why files were archived

---

## Deletion Process

When a component reaches its Delete Date:

1. Verify no imports reference the archived file:
   ```bash
   grep -r "PreviewCard\|ProjectOverviewBox" website/
   ```

2. If no references found, delete:
   ```bash
   rm website/archive/configurator/PreviewCard.tsx
   rm website/archive/configurator/ProjectOverviewBox.tsx
   ```

3. Remove entry from this document (or move to "Deleted" section for historical record)

---

## Scheduled Actions

### Week of 2026-01-17
- [ ] Archive PreviewCard.tsx
- [ ] Archive ProjectOverviewBox.tsx
- [ ] Create archive README

### Week of 2026-02-02
- [ ] Verify no references to archived components
- [ ] Delete archived files
- [ ] Update this document

---

## Previously Deleted (Historical Record)

| Component | Deprecated | Deleted | Replaced By |
|-----------|------------|---------|-------------|
| *(none yet)* | - | - | - |

---

## Notes

- If a deprecated component needs to be restored, check git history:
  ```bash
  git log --all --full-history -- "**/PreviewCard.tsx"
  git checkout <commit-hash> -- website/app/components/configurator/PreviewCard.tsx
  ```

- Extension requests: If deletion needs to be delayed, update the dates and add a note explaining why.

