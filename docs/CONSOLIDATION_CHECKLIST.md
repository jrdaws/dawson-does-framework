# Daily Branch Consolidation Checklist

> **For Human Maintainers Only**
> 
> Run this checklist at the end of each day (or when multiple AI agents have been working in parallel) to consolidate work and prevent branch divergence.

---

## Quick Consolidation (5 minutes)

Run these commands in order:

```bash
# 1. See all branches and their activity
git branch -a --sort=-committerdate

# 2. Check for uncommitted changes
git status

# 3. Check recent commits across all branches
git log --oneline --all --since="24 hours ago" | head -20

# 4. Pull latest main
git pull origin main
```

---

## Full Consolidation Checklist

### Step 1: Inventory Active Branches

```bash
# List all branches with last commit date
git for-each-ref --sort=-committerdate --format='%(refname:short) - %(committerdate:relative) - %(subject)' refs/heads/ | head -10
```

**Document branches with recent activity:**

| Branch | Last Activity | Contains |
|--------|---------------|----------|
| `main` | | |
| | | |
| | | |

---

### Step 2: Check for Divergence

For each active branch, check what work exists that isn't on main:

```bash
# Replace <branch> with branch name
git log main..<branch> --oneline
```

**Branches with unmerged work:**

- [ ] Branch: _________ | Commits: _____ | Action: Merge / Cherry-pick / Ignore
- [ ] Branch: _________ | Commits: _____ | Action: Merge / Cherry-pick / Ignore
- [ ] Branch: _________ | Commits: _____ | Action: Merge / Cherry-pick / Ignore

---

### Step 3: Check for Conflicts

Before merging, preview potential conflicts:

```bash
# Dry-run merge to see conflicts
git merge --no-commit --no-ff <branch>
git diff --cached --stat
git merge --abort  # Don't actually merge yet
```

**Potential conflicts identified:**

- [ ] File: _________ | Resolution: _________
- [ ] File: _________ | Resolution: _________

---

### Step 4: Merge or Cherry-Pick

**Option A: Full Merge** (if all changes are wanted)
```bash
git checkout main
git merge <branch> -m "chore: merge <branch> into main"
```

**Option B: Cherry-Pick** (if only some commits are wanted)
```bash
git checkout main
git cherry-pick <commit-hash>
```

**Option C: Cherry-Pick Files** (if specific files needed)
```bash
git checkout main
git checkout <branch> -- path/to/file
git commit -m "chore: bring <file> from <branch>"
```

---

### Step 5: Verify Protected Files

After any merge, ensure protected files exist:

```bash
# Quick check for critical files
ls AGENT_CONTEXT.md CLAUDE.md .cursorrules 2>/dev/null || echo "MISSING CRITICAL FILES!"
ls docs/GOVERNANCE_ROADMAP.md 2>/dev/null || echo "Missing: docs/GOVERNANCE_ROADMAP.md"
ls prompts/agents/UNIVERSAL_BOOTSTRAP.md 2>/dev/null || echo "Missing: UNIVERSAL_BOOTSTRAP.md"
ls prompts/agents/roles/ROLE_PROTOCOL.md 2>/dev/null || echo "Missing: ROLE_PROTOCOL.md"

# Restore any missing files from HEAD
git checkout HEAD -- .
```

---

### Step 6: Run Tests

```bash
npm test
```

**Tests passing?** 
- [ ] Yes, all tests pass
- [ ] No, failing tests: _________

---

### Step 7: Push and Clean Up

```bash
# Push consolidated main
git push origin main

# Delete merged branches (local)
git branch -d <branch>

# Delete merged branches (remote)
git push origin --delete <branch>
```

**Branches deleted:**
- [ ] _________ (local and remote)
- [ ] _________ (local and remote)

---

### Step 8: Document Session

Add a note about what was consolidated:

**Date**: __________

**Branches Merged**:
- 

**Files with Conflicts Resolved**:
- 

**Issues Found**:
- 

**Follow-up Needed**:
- 

---

## Emergency Recovery

### If protected files are deleted:

```bash
# Restore from latest commit
git checkout HEAD -- AGENT_CONTEXT.md
git checkout HEAD -- prompts/agents/UNIVERSAL_BOOTSTRAP.md
git checkout HEAD -- prompts/agents/roles/ROLE_PROTOCOL.md
# etc.
```

### If a branch has work that was never merged:

```bash
# Find the branch tip
git log <branch> -1

# Create a recovery branch
git checkout -b recovery-<branch> <commit-hash>

# Cherry-pick to main
git checkout main
git cherry-pick <commit-hash>
```

### If tests fail after merge:

```bash
# Revert the merge
git revert -m 1 HEAD

# Or reset to before merge (destructive)
git reset --hard HEAD~1
```

---

## Automation Ideas

Consider setting up:

1. **Pre-commit hook**: Verify protected files exist
2. **GitHub Action**: Run tests on all branches daily
3. **Slack/Discord alert**: When branches diverge by >10 commits
4. **Auto-merge bot**: For branches with only doc/memory updates

---

*Last Updated: 2025-12-22*
*This checklist is for human maintainers. AI agents should not modify this file.*

