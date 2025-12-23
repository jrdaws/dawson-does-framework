#!/bin/bash
# Autonomous Test-Fix Loop
# Runs tests, extracts errors, and creates fix requests for Cursor
#
# Usage: ./test-fix-loop.sh [project_dir] [max_iterations] [mode]
#   mode: interactive (default), unattended

set -e

PROJECT_DIR="${1:-$(cd "$(dirname "$0")/../.." && pwd)}"
MAX_ITERATIONS="${2:-5}"
MODE="${3:-interactive}"

cd "$PROJECT_DIR"

LOG_DIR="$HOME/.config/dawson-automation/logs"
LOG_FILE="$LOG_DIR/test-fix-$(date +%Y%m%d-%H%M%S).log"
mkdir -p "$LOG_DIR"

log() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

notify() {
    osascript -e "display notification \"$1\" with title \"Test-Fix Loop\"" 2>/dev/null || true
}

extract_error() {
    # Extract failure information from test output
    local output="$1"
    
    # Try to get the first failing test with context
    echo "$output" | grep -A 30 "✖\|FAIL\|Error:\|AssertionError" | head -40
}

create_fix_prompt() {
    local error_msg="$1"
    local iteration="$2"
    
    cat <<EOF
## Test Fix Request (Iteration $iteration)

The following test is failing. Please provide a minimal fix.

### Error Output

\`\`\`
$error_msg
\`\`\`

### Instructions

1. Identify the root cause
2. Apply the minimal fix needed
3. Do NOT refactor unrelated code
4. Explain what you changed

### Context

- Project: $(basename "$PROJECT_DIR")
- Test command: npm test
- Previous iterations: $((iteration - 1))

($CLI Agent)
EOF
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Main Loop
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "Autonomous Test-Fix Loop"
log "Project: $PROJECT_DIR"
log "Max iterations: $MAX_ITERATIONS"
log "Mode: $MODE"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for i in $(seq 1 $MAX_ITERATIONS); do
    log ""
    log "━━━━━━━ Iteration $i/$MAX_ITERATIONS ━━━━━━━"
    
    # Run tests
    log "Running tests..."
    TEST_OUTPUT=$(npm test 2>&1) || true
    echo "$TEST_OUTPUT" > /tmp/test-output.txt
    
    # Check if all tests pass
    if echo "$TEST_OUTPUT" | grep -q "fail 0"; then
        PASS_COUNT=$(echo "$TEST_OUTPUT" | grep -o "pass [0-9]*" | tail -1)
        log "✅ All tests passing! ($PASS_COUNT)"
        notify "✅ Tests fixed after $i iteration(s)!"
        
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "SUCCESS: All tests passing after $i iteration(s)"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        exit 0
    fi
    
    # Extract error details
    ERROR_MSG=$(extract_error "$TEST_OUTPUT")
    log "Found failing test(s):"
    echo "$ERROR_MSG" | head -10 >> "$LOG_FILE"
    
    # Create fix prompt
    FIX_PROMPT=$(create_fix_prompt "$ERROR_MSG" "$i")
    
    if [ "$MODE" = "unattended" ]; then
        # In unattended mode, save prompt to file for later processing
        PROMPT_FILE="$LOG_DIR/fix-request-$i.md"
        echo "$FIX_PROMPT" > "$PROMPT_FILE"
        log "Fix prompt saved to: $PROMPT_FILE"
        
        # In unattended mode, we can't actually fix - just log
        log "⚠️  Unattended mode: Cannot auto-fix without Cursor interaction"
        log "Run in interactive mode or process fix requests manually"
        continue
    else
        # Interactive mode: Copy to clipboard and notify
        echo "$FIX_PROMPT" | pbcopy
        log "Fix prompt copied to clipboard"
        
        notify "Test failing - fix prompt copied"
        
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Fix prompt copied to clipboard!"
        echo ""
        echo "Instructions:"
        echo "  1. Switch to Cursor"
        echo "  2. Open Composer (⌘L)"
        echo "  3. Paste the fix request (⌘V)"
        echo "  4. Let Claude fix the issue"
        echo "  5. Accept the changes"
        echo ""
        read -p "Press ENTER when fix is applied (or 'q' to quit): " USER_INPUT
        
        if [ "$USER_INPUT" = "q" ]; then
            log "User quit the loop"
            exit 1
        fi
        
        log "User applied fix, retrying tests..."
    fi
    
    # Small delay before next iteration
    sleep 2
done

log ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "❌ Max iterations ($MAX_ITERATIONS) reached"
log "Tests are still failing. Manual intervention required."
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

notify "❌ Test-Fix Loop: Max iterations reached"
exit 1

