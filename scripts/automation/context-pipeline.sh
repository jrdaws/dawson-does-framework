#!/bin/bash
# Context Injection Pipeline
# Generates layered context for Cursor injection
#
# Usage: ./context-pipeline.sh [ROLE] [PROJECT_DIR] [OUTPUT_FORMAT]
#   ROLE: CLI, WEB, DOC, TST, TPL (default: CLI)
#   OUTPUT_FORMAT: clipboard, file, stdout (default: clipboard)

ROLE="${1:-CLI}"
PROJECT_DIR="${2:-$(cd "$(dirname "$0")/../.." && pwd)}"
OUTPUT_FORMAT="${3:-clipboard}"

cd "$PROJECT_DIR"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Layer 1: Static Context (governance acknowledgment)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STATIC_CONTEXT=$(cat <<'STATIC'
## ✓ Governance Acknowledgment
- Governance Version: 2.2
- I have read AGENT_CONTEXT.md
- I understand: export-first philosophy, zero lock-in
- I understand: Fenced Output Integrity (one block, no splits)
- I will NOT: delete protected files, create branches, skip sync
STATIC
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Layer 2: Session Context (role-specific)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Get active task
ACTIVE_TASK=""
INBOX_DIR="output/${ROLE,,}-agent/inbox"
if [ -d "$INBOX_DIR" ]; then
    TASK_FILE=$(ls -1t "$INBOX_DIR"/*.txt 2>/dev/null | head -1)
    if [ -n "$TASK_FILE" ] && [ -f "$TASK_FILE" ]; then
        TASK_NAME=$(basename "$TASK_FILE")
        TASK_PREVIEW=$(head -20 "$TASK_FILE" | sed 's/^/> /')
        ACTIVE_TASK="### Active Task
**File**: \`$TASK_NAME\`

$TASK_PREVIEW"
    fi
fi

# Get memory highlights
MEMORY_FILE="prompts/agents/memory/${ROLE}_MEMORY.md"
MEMORY_CONTEXT=""
if [ -f "$MEMORY_FILE" ]; then
    # Get last session entry (between ## Session: and next ---)
    MEMORY_CONTEXT=$(awk '/^## Session:/{p=1} p; /^---$/ && p{exit}' "$MEMORY_FILE" | head -25)
fi

SESSION_CONTEXT=$(cat <<SESSION
## Session Context

**Role**: $ROLE Agent
**Time**: $(date '+%Y-%m-%d %H:%M:%S')
**Tab**: \`$ROLE $(date '+%H:%M')\`

$ACTIVE_TASK

### Recent Memory
$MEMORY_CONTEXT
SESSION
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Layer 3: Dynamic Context (real-time state)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Git status
GIT_STATUS=$(git status --short 2>/dev/null | head -10)
GIT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
GIT_LAST_COMMIT=$(git log -1 --oneline 2>/dev/null || echo "unknown")

# Test status (if recent results exist)
TEST_STATUS="⚪ Not run"
if [ -f "/tmp/test-results.txt" ]; then
    if grep -q "fail 0" /tmp/test-results.txt 2>/dev/null; then
        TEST_COUNT=$(grep -o "pass [0-9]*" /tmp/test-results.txt | tail -1 || echo "all")
        TEST_STATUS="✅ Passing ($TEST_COUNT)"
    else
        FAIL_COUNT=$(grep -o "fail [0-9]*" /tmp/test-results.txt | tail -1 || echo "some")
        TEST_STATUS="❌ Failing ($FAIL_COUNT)"
    fi
fi

# Lock status
LOCK_STATUS="🔓 Unlocked"
if [ -f ".agent-lock" ]; then
    LOCK_CONTENT=$(cat .agent-lock 2>/dev/null)
    LOCK_STATUS="🔒 Locked by: $LOCK_CONTENT"
fi

# Recent commits by other agents
RECENT_ACTIVITY=""
RECENT_COMMITS=$(git log --oneline --since="30 minutes ago" 2>/dev/null | head -3)
if [ -n "$RECENT_COMMITS" ]; then
    RECENT_ACTIVITY="### Recent Activity (last 30 min)
\`\`\`
$RECENT_COMMITS
\`\`\`"
fi

DYNAMIC_CONTEXT=$(cat <<DYNAMIC
## Current State

| Metric | Value |
|--------|-------|
| Branch | \`$GIT_BRANCH\` |
| Last Commit | \`$GIT_LAST_COMMIT\` |
| Tests | $TEST_STATUS |
| Lock | $LOCK_STATUS |

### Uncommitted Changes
\`\`\`
$GIT_STATUS
\`\`\`

$RECENT_ACTIVITY
DYNAMIC
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Combine All Layers
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FULL_CONTEXT=$(cat <<FULL
$STATIC_CONTEXT

---

$SESSION_CONTEXT

---

$DYNAMIC_CONTEXT

---

**Ready to work. What's the task?**

($ROLE Agent)
FULL
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Output
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

case "$OUTPUT_FORMAT" in
    clipboard)
        echo "$FULL_CONTEXT" | pbcopy
        LINES=$(echo "$FULL_CONTEXT" | wc -l | tr -d ' ')
        echo "✅ Context copied to clipboard ($LINES lines)"
        ;;
    file)
        echo "$FULL_CONTEXT" > /tmp/cursor-context.md
        echo "✅ Context written to /tmp/cursor-context.md"
        ;;
    stdout)
        echo "$FULL_CONTEXT"
        ;;
    *)
        echo "Unknown output format: $OUTPUT_FORMAT"
        echo "Use: clipboard, file, or stdout"
        exit 1
        ;;
esac

