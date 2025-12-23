#!/bin/bash
# Daily Dev Startup Script
# Usage: ./scripts/automation/daily-dev.sh [role]
#
# Pulls latest, runs tests, opens Cursor, and injects context

set -e

ROLE="${1:-CLI}"
PROJECT_DIR="${PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
LOG_DIR="$HOME/.config/dawson-automation/logs"
LOG_FILE="$LOG_DIR/daily-dev-$(date +%Y%m%d).log"

# Ensure directories exist
mkdir -p "$LOG_DIR"

log() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

notify() {
    osascript -e "display notification \"$1\" with title \"Daily Dev\"" 2>/dev/null || true
}

cd "$PROJECT_DIR"

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "Daily Dev Startup - Role: $ROLE"
log "Project: $PROJECT_DIR"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Sync
log "Step 1: Pulling latest changes..."
git pull origin main 2>&1 | tee -a "$LOG_FILE" || {
    log "Warning: git pull failed, continuing anyway"
}

# Step 2: Run tests in background
log "Step 2: Running tests in background..."
npm test > /tmp/test-results.txt 2>&1 &
TEST_PID=$!

# Step 3: Check for active agents
log "Step 3: Checking for active agents..."
RECENT_COMMITS=$(git log --oneline --since="10 minutes ago" 2>/dev/null | head -5)
if [ -n "$RECENT_COMMITS" ]; then
    log "⚠️  Recent commits detected (possible active agent):"
    echo "$RECENT_COMMITS" | while read line; do log "   $line"; done
fi

# Step 4: Prepare context
log "Step 4: Preparing context..."

# Get active task if any
ACTIVE_TASK=""
INBOX_DIR="output/${ROLE,,}-agent/inbox"
if [ -d "$INBOX_DIR" ]; then
    TASK_FILE=$(ls -1 "$INBOX_DIR"/*.txt 2>/dev/null | head -1)
    if [ -n "$TASK_FILE" ] && [ -f "$TASK_FILE" ]; then
        ACTIVE_TASK="**Active Task**: $(basename "$TASK_FILE")

\`\`\`
$(head -15 "$TASK_FILE")
\`\`\`"
    fi
fi

# Get memory highlights
MEMORY_FILE="prompts/agents/memory/${ROLE}_MEMORY.md"
MEMORY_CONTEXT=""
if [ -f "$MEMORY_FILE" ]; then
    MEMORY_CONTEXT=$(awk '/^## Session:/{p=1} p; /^---$/ && p{exit}' "$MEMORY_FILE" | head -20)
fi

# Build full context
CONTEXT=$(cat <<EOF
## ✓ Governance Acknowledgment
- Governance Version: 2.2
- I have read AGENT_CONTEXT.md
- I understand: export-first philosophy, zero lock-in
- I understand: Fenced Output Integrity (one block, no splits)
- I will NOT: delete protected files, create branches, skip sync

---

## Session Context

**Role**: $ROLE Agent
**Time**: $(date '+%Y-%m-%d %H:%M:%S')
**Tab**: \`$ROLE $(date '+%H:%M')\`
**Branch**: $(git branch --show-current 2>/dev/null || echo "unknown")
**Last Commit**: $(git log -1 --oneline 2>/dev/null || echo "unknown")

$ACTIVE_TASK

### Recent Memory
$MEMORY_CONTEXT

---

**Ready to work. What's the task?**

($ROLE Agent)
EOF
)

# Copy context to clipboard
echo "$CONTEXT" | pbcopy
CONTEXT_LINES=$(echo "$CONTEXT" | wc -l | tr -d ' ')
log "Context copied to clipboard ($CONTEXT_LINES lines)"

# Step 5: Open Cursor
log "Step 5: Opening Cursor..."
cursor "$PROJECT_DIR" 2>/dev/null || {
    log "Cursor command not found, trying 'open'"
    open -a "Cursor" "$PROJECT_DIR" 2>/dev/null || true
}

# Step 6: Wait for tests and notify
log "Step 6: Waiting for test results..."
wait $TEST_PID || true
TEST_EXIT=$?

if [ -f /tmp/test-results.txt ]; then
    if grep -q "fail 0" /tmp/test-results.txt 2>/dev/null; then
        TEST_COUNT=$(grep -o "pass [0-9]*" /tmp/test-results.txt | tail -1 || echo "tests")
        notify "✅ Tests passed ($TEST_COUNT)"
        log "✅ Tests passed ($TEST_COUNT)"
    else
        FAIL_INFO=$(grep -o "fail [0-9]*" /tmp/test-results.txt | tail -1 || echo "some tests")
        notify "❌ Tests failed ($FAIL_INFO)"
        log "❌ Tests failed ($FAIL_INFO)"
    fi
else
    log "⚠️  Could not read test results"
fi

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "Daily dev startup complete!"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Context is in your clipboard - paste into Cursor chat with ⌘V"
echo ""

