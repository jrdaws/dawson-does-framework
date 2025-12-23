#!/bin/bash
# SMART AUTO CYCLE - Cursor first, CLI backup
#
# Priority:
# 1. Try Cursor automation (FREE via subscription)
# 2. If Cursor fails, fall back to Claude CLI ($0.12/cycle)
#
# This gives you the best of both worlds:
# - $0 cost when computer is awake and Cursor works
# - Reliable backup when sleeping or Cursor unavailable

set -e

PROJECT_DIR="/Users/joseph.dawson/Documents/dawson-does-framework"
LOG_FILE="$PROJECT_DIR/logs/smart-auto.log"
CYCLE_ID=$(date +'%Y%m%d-%H%M')

# Timing for Cursor automation
AUDITOR_WAIT=300      # 5 minutes
STRATEGIST_WAIT=420   # 7 minutes
CURATOR_WAIT=360      # 6 minutes

mkdir -p "$PROJECT_DIR/logs"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# ═══════════════════════════════════════════════════════════
# CHECK: Can we use Cursor?
# ═══════════════════════════════════════════════════════════
can_use_cursor() {
    # Check 1: Is the display available? (not sleeping/locked hard)
    if ! system_profiler SPDisplaysDataType 2>/dev/null | grep -q "Resolution"; then
        log "Display not available"
        return 1
    fi
    
    # Check 2: Is Cursor installed?
    if [ ! -d "/Applications/Cursor.app" ]; then
        log "Cursor not installed"
        return 1
    fi
    
    # Check 3: Can we run AppleScript? (Accessibility permissions)
    if ! osascript -e 'tell application "System Events" to return name of first process' &>/dev/null; then
        log "AppleScript/Accessibility permissions issue"
        return 1
    fi
    
    # Check 4: Is computer being actively used? (optional - skip if idle)
    IDLE_TIME=$(ioreg -c IOHIDSystem | awk '/HIDIdleTime/ {print int($NF/1000000000); exit}')
    if [ "$IDLE_TIME" -gt 7200 ]; then  # More than 2 hours idle
        log "Computer idle for ${IDLE_TIME}s - user likely sleeping"
        # Still try Cursor, but be prepared to fall back
    fi
    
    return 0
}

# ═══════════════════════════════════════════════════════════
# OPTION A: Run via Cursor (AppleScript)
# ═══════════════════════════════════════════════════════════
run_cursor_cycle() {
    log "═══════════════════════════════════════════════════════════"
    log "OPTION A: Running via Cursor (FREE)"
    log "═══════════════════════════════════════════════════════════"
    
    # Start Cursor if not running
    if ! pgrep -x "Cursor" > /dev/null; then
        log "Starting Cursor..."
        open -a "Cursor" "$PROJECT_DIR"
        sleep 15
    else
        # Activate existing Cursor
        osascript -e 'tell application "Cursor" to activate'
        sleep 3
    fi
    
    # Run each controller agent
    run_cursor_agent "AUDITOR" "$AUDITOR_WAIT" \
        "Read prompts/agents/roles/controllers/AUDITOR.md and execute a full audit cycle. Review the last 6 hours of changes, run tests, check agent activity, and produce an audit report. Save to output/shared/reports/audit-$CYCLE_ID.txt"
    
    run_cursor_agent "STRATEGIST" "$STRATEGIST_WAIT" \
        "Read prompts/agents/roles/controllers/STRATEGIST.md and execute a strategy cycle. Read the latest audit report, create a strategic plan, and draft task prompts for executor agents. Save to output/shared/reports/strategy-$CYCLE_ID.txt"
    
    run_cursor_agent "CURATOR" "$CURATOR_WAIT" \
        "Read prompts/agents/roles/controllers/CURATOR.md and execute a curation cycle. Review draft prompts, score them against quality criteria, and distribute final tasks to agent inboxes. Save to output/shared/reports/cycle-summary-$CYCLE_ID.txt"
    
    # Verify outputs were created
    if [ -f "$PROJECT_DIR/output/shared/reports/audit-$CYCLE_ID.txt" ] || \
       [ -f "$PROJECT_DIR/output/shared/reports/strategy-$CYCLE_ID.txt" ]; then
        log "Cursor cycle appears successful"
        return 0
    else
        log "Cursor cycle may have failed - no output files found"
        return 1
    fi
}

run_cursor_agent() {
    local NAME="$1"
    local WAIT="$2"
    local PROMPT="$3"
    
    log "Running $NAME in Cursor..."
    
    # Copy to clipboard
    echo "$PROMPT" | pbcopy
    
    # Automate Cursor
    osascript << EOF
        tell application "Cursor"
            activate
            delay 2
        end tell
        
        tell application "System Events"
            tell process "Cursor"
                keystroke "l" using command down
                delay 1.5
                keystroke "v" using command down
                delay 0.5
                keystroke return
            end tell
        end tell
EOF
    
    log "$NAME submitted. Waiting ${WAIT}s..."
    sleep "$WAIT"
    log "$NAME complete."
}

# ═══════════════════════════════════════════════════════════
# OPTION B: Run via Claude CLI (Backup)
# ═══════════════════════════════════════════════════════════
run_cli_cycle() {
    log "═══════════════════════════════════════════════════════════"
    log "OPTION B: Running via Claude CLI (BACKUP - \$0.12)"
    log "═══════════════════════════════════════════════════════════"
    
    # Check if CLI is available
    if ! command -v claude &> /dev/null; then
        log "ERROR: Claude CLI not installed. Cannot run backup."
        log "Install: npm install -g @anthropic-ai/claude-cli"
        return 1
    fi
    
    # Run the overnight script which is already optimized for CLI
    "$PROJECT_DIR/scripts/overnight-cycle.sh"
    return $?
}

# ═══════════════════════════════════════════════════════════
# MAIN LOGIC
# ═══════════════════════════════════════════════════════════
log ""
log "╔═══════════════════════════════════════════════════════════╗"
log "║  SMART AUTO CYCLE - $CYCLE_ID"
log "║  Primary: Cursor (FREE) | Backup: CLI (\$0.12)"
log "╚═══════════════════════════════════════════════════════════╝"
log ""

cd "$PROJECT_DIR"

# Try Cursor first
if can_use_cursor; then
    log "Cursor available - attempting Option A..."
    
    if run_cursor_cycle; then
        log "✅ SUCCESS via Cursor (FREE)"
        METHOD="Cursor"
        COST="\$0"
    else
        log "⚠️ Cursor failed, falling back to CLI..."
        if run_cli_cycle; then
            log "✅ SUCCESS via CLI backup"
            METHOD="CLI (backup)"
            COST="~\$0.12"
        else
            log "❌ BOTH OPTIONS FAILED"
            METHOD="FAILED"
            COST="N/A"
        fi
    fi
else
    log "Cursor not available, using CLI..."
    if run_cli_cycle; then
        log "✅ SUCCESS via CLI"
        METHOD="CLI"
        COST="~\$0.12"
    else
        log "❌ CLI FAILED"
        METHOD="FAILED"
        COST="N/A"
    fi
fi

log ""
log "═══════════════════════════════════════════════════════════"
log "CYCLE COMPLETE"
log "Method: $METHOD"
log "Cost: $COST"
log "═══════════════════════════════════════════════════════════"

# Send notification
osascript -e "display notification \"Cycle complete via $METHOD ($COST)\" with title \"Smart Auto Cycle\" sound name \"Glass\"" 2>/dev/null || true

# Check for pending tasks
PENDING=$(find "$PROJECT_DIR/output" -path "*/inbox/*.txt" -type f 2>/dev/null | wc -l | tr -d ' ')
log "Pending executor tasks: $PENDING"
log "Run: ./scripts/run-agent.sh all"

