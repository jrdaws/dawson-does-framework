# framework checkpoint

AI safety checkpoints for rollback and recovery.

## Synopsis

```bash
framework checkpoint <command> [arguments] [options]
```

## Description

Checkpoints create git-based snapshots of your project before major changes. Use them to safely experiment and rollback if needed - perfect for AI-assisted development.

## Commands

| Command | Description |
|---------|-------------|
| `create <description>` | Create a checkpoint |
| `list` | List all checkpoints |
| `restore <id>` | Restore a checkpoint |
| `cleanup [keep]` | Remove old checkpoints |
| `log` | Show checkpoint audit log |

## framework checkpoint create

Create a checkpoint before making changes.

### Synopsis

```bash
framework checkpoint create <description>
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `description` | Checkpoint description | Yes |

### Examples

**Before major refactor:**

```bash
framework checkpoint create "before adding payments"
```

**Output:**
```
📸 Creating checkpoint...

✅ Checkpoint created
   ID: cp_abc123
   Description: before adding payments
   Files: 47 tracked
   Time: 2025-01-20 10:00:00

To restore:
  framework checkpoint restore cp_abc123
```

**Before AI changes:**

```bash
framework checkpoint create "before AI implements feature X"
```

**Before breaking changes:**

```bash
framework checkpoint create "before refactoring auth system"
```

## framework checkpoint list

List all checkpoints.

### Synopsis

```bash
framework checkpoint list
```

### Example

```bash
framework checkpoint list
```

### Output

```
📸 Checkpoints

cp_abc123
  Description: before adding payments
  Created: 2025-01-20 10:00:00
  Files: 47 tracked

cp_def456
  Description: before AI implements feature X
  Created: 2025-01-20 09:30:00
  Files: 45 tracked

cp_ghi789
  Description: before refactoring auth system
  Created: 2025-01-19 15:45:00
  Files: 43 tracked

Total: 3 checkpoints

To restore:
  framework checkpoint restore <id>
```

## framework checkpoint restore

Restore project to a checkpoint.

### Synopsis

```bash
framework checkpoint restore <id>
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `id` | Checkpoint ID | Yes |

### Example

```bash
framework checkpoint restore cp_abc123
```

### Output

```
📸 Restoring checkpoint...

Checkpoint: cp_abc123
Description: before adding payments
Created: 2025-01-20 10:00:00

⚠️  WARNING: This will discard all current changes!

Continue? (y/N): y

✅ Checkpoint restored
   Files restored: 47
   Discarded changes: 12 files

Your project is now at the checkpoint state.
```

### Interactive Confirmation

Restoration requires confirmation to prevent accidental data loss:

```bash
# Will prompt for confirmation
framework checkpoint restore cp_abc123

# Automatic yes (dangerous!)
yes | framework checkpoint restore cp_abc123
```

## framework checkpoint cleanup

Remove old checkpoints.

### Synopsis

```bash
framework checkpoint cleanup [keep]
```

### Arguments

| Argument | Description | Required | Default |
|----------|-------------|----------|---------|
| `keep` | Number of recent checkpoints to keep | No | 5 |

### Examples

**Keep last 5:**

```bash
framework checkpoint cleanup
```

**Keep last 10:**

```bash
framework checkpoint cleanup 10
```

**Keep only 2:**

```bash
framework checkpoint cleanup 2
```

### Output

```
📸 Cleaning up checkpoints...

Keeping most recent: 5 checkpoints
Removing: 3 older checkpoints

cp_xyz123 (2025-01-15 10:00:00) - ❌ Removed
cp_uvw456 (2025-01-14 15:30:00) - ❌ Removed
cp_rst789 (2025-01-13 09:45:00) - ❌ Removed

✅ Cleanup complete
   Kept: 5 checkpoints
   Removed: 3 checkpoints
```

## framework checkpoint log

Show checkpoint audit log.

### Synopsis

```bash
framework checkpoint log
```

### Example

```bash
framework checkpoint log
```

### Output

```
📸 Checkpoint Audit Log

2025-01-20 10:00:00 - CREATE  - cp_abc123 - "before adding payments"
2025-01-20 09:30:00 - CREATE  - cp_def456 - "before AI implements feature X"
2025-01-20 09:15:00 - RESTORE - cp_ghi789 - "before refactoring auth system"
2025-01-19 15:45:00 - CREATE  - cp_ghi789 - "before refactoring auth system"
2025-01-19 14:20:00 - CLEANUP - Removed 2 checkpoints
2025-01-18 11:30:00 - CREATE  - cp_jkl012 - "before database migration"

Total events: 6
```

## Use Cases

### AI-Assisted Development

**Pattern:**

```bash
# 1. Create checkpoint before AI changes
framework checkpoint create "before AI implements auth"

# 2. Let AI make changes
# (AI writes code)

# 3a. If changes work - keep them
git add .
git commit -m "Add authentication"

# 3b. If changes break - restore
framework checkpoint restore cp_abc123
```

### Experimenting

```bash
# Try experimental approach
framework checkpoint create "before experiment"

# Make experimental changes
# ...

# If experiment fails
framework checkpoint restore cp_abc123

# If experiment succeeds
git commit -m "Successful experiment"
```

### Major Refactors

```bash
# Before major refactor
framework checkpoint create "before auth refactor"

# Refactor authentication system
# ...

# If refactor has issues
framework checkpoint restore cp_abc123

# Restart with different approach
```

### Before Upgrades

```bash
# Before upgrading dependencies
framework checkpoint create "before Next.js 15 upgrade"

# Upgrade
npm install next@15

# If upgrade breaks things
framework checkpoint restore cp_abc123
```

## How Checkpoints Work

### Git-Based

Checkpoints use `git stash` internally:

1. **Create** - Stashes current changes with description
2. **Restore** - Applies stashed changes and resets working directory
3. **List** - Shows all stashes
4. **Cleanup** - Removes old stashes

### Requirements

- Git repository initialized
- Changes can be staged or unstaged
- Works with any git workflow

### Non-Destructive

Checkpoints are non-destructive:
- Original git history preserved
- Can have multiple checkpoints
- Cleanup is optional

## Best Practices

### When to Create Checkpoints

✅ **Good times:**
- Before AI-generated changes
- Before major refactors
- Before dependency upgrades
- Before architectural changes
- Before deleting code

❌ **Not needed:**
- For minor changes
- When you have recent git commits
- For changes you can easily revert

### Naming Conventions

**Good descriptions:**
```bash
framework checkpoint create "before implementing payments"
framework checkpoint create "before refactoring API routes"
framework checkpoint create "before AI adds dashboard"
```

**Bad descriptions:**
```bash
framework checkpoint create "checkpoint 1"  # Not descriptive
framework checkpoint create "test"          # Too vague
framework checkpoint create "changes"       # Not specific
```

### Cleanup Strategy

**Regular cleanup:**
```bash
# Weekly: keep last 10
framework checkpoint cleanup 10

# Monthly: keep last 5
framework checkpoint cleanup 5
```

**Before major work:**
```bash
# Clean up, then create fresh checkpoint
framework checkpoint cleanup 3
framework checkpoint create "starting new feature"
```

## Workflow Examples

### Daily Development

```bash
# Morning: clean up old checkpoints
framework checkpoint cleanup 5

# Before each major task
framework checkpoint create "before implementing login"
# ... work ...

framework checkpoint create "before adding API routes"
# ... work ...

# End of day: commit successful work
git add .
git commit -m "Daily progress"
```

### AI Pair Programming

```bash
# Start AI session
framework checkpoint create "before AI session"

# AI makes changes
# Review changes

# If good: commit
git add .
git commit -m "AI implemented feature X"

# If bad: restore
framework checkpoint restore cp_abc123
```

### Safe Experimentation

```bash
# Create checkpoint
framework checkpoint create "before trying new approach"

# Try approach A
# ... test ...
# Doesn't work - restore
framework checkpoint restore cp_abc123

# Try approach B
# ... test ...
# Works! Commit
git add .
git commit -m "Implemented with approach B"
```

## Common Issues

### Not a Git Repository

**Error:**
```
❌ Not a git repository
```

**Solution:**
```bash
git init
git add .
git commit -m "Initial commit"
framework checkpoint create "checkpoint 1"
```

### No Changes to Checkpoint

**Error:**
```
❌ No changes to checkpoint
```

**Solution:**
Make some changes first, or this is expected (no checkpoint needed).

### Checkpoint Not Found

**Error:**
```
❌ Checkpoint not found: cp_invalid
```

**Solution:**
```bash
# List available checkpoints
framework checkpoint list

# Use valid ID
framework checkpoint restore cp_abc123
```

## Integration with Git

### Compatible with Git Workflow

Checkpoints work alongside normal git:

```bash
# Normal git workflow
git add .
git commit -m "Feature A"

# Create checkpoint for experiment
framework checkpoint create "trying feature B"

# Experiment fails - restore
framework checkpoint restore cp_abc123

# Continue normal git workflow
git add .
git commit -m "Feature C"
```

### Stash List

View checkpoints in git:

```bash
git stash list
```

Shows checkpoints with framework prefix.

## Next Steps

- **[AI Safety Guide →](../concepts/agent-safety.md)** - Complete safety guide
- **[Drift Detection →](drift.md)** - Detect template changes
- **[Git Workflow →](../guides/git-workflow.md)** - Git best practices

## Related Commands

- [`framework drift`](drift.md) - Detect changes from template
- [`framework doctor`](doctor.md) - Health checks

## See Also

- [AI Governance](../AI_GOVERNANCE.md) - AI safety principles
- [Agent Safety](../concepts/agent-safety.md) - Safety concepts
- [Git Documentation](https://git-scm.com/doc) - Git reference
