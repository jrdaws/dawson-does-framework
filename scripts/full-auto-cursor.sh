#!/bin/bash
# FULLY AUTOMATED CURSOR AGENT RUNNER
# Zero human intervention - runs agents in Cursor automatically
#
# This script:
# 1. Opens Cursor
# 2. Creates new chat (Cmd+L)
# 3. Pastes prompt
# 4. Presses Enter to submit
# 5. Waits for estimated completion time
# 6. Repeats for next agent
#
# Cost: $0 (uses Cursor subscription)
# Requirement: Cursor must be installed, project must be open

set -e

PROJECT_DIR="/Users/joseph.dawson/Documents/dawson-does-framework"
LOG_FILE="$PROJECT_DIR/logs/full-auto.log"
REPORTS_DIR="$PROJECT_DIR/output/shared/reports"

# Source notification helper for clickable notifications
source "$PROJECT_DIR/scripts/automation/notify.sh" 2>/dev/null || true

# Timing configuration (adjust based on typical response times)
AUDITOR_WAIT=300      # 5 minutes
STRATEGIST_WAIT=420   # 7 minutes
CURATOR_WAIT=360      # 6 minutes
EXECUTOR_WAIT=300     # 5 minutes per executor

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

mkdir -p "$PROJECT_DIR/logs"

# Function to run a prompt in Cursor
run_in_cursor() {
    local PROMPT="$1"
    local WAIT_TIME="$2"
    local AGENT_NAME="$3"
    
    log "Starting $AGENT_NAME..."
    
    # Copy prompt to clipboard
    echo "$PROMPT" | pbcopy
    
    # AppleScript to automate Cursor
    osascript << EOF
        tell application "Cursor"
            activate
            delay 2
        end tell
        
        tell application "System Events"
            tell process "Cursor"
                -- Open new AI chat (Cmd+L)
                keystroke "l" using command down
                delay 1
                
                -- Paste prompt (Cmd+V)
                keystroke "v" using command down
                delay 0.5
                
                -- Submit (Enter)
                keystroke return
            end tell
        end tell
EOF
    
    log "$AGENT_NAME submitted. Waiting ${WAIT_TIME}s for completion..."
    sleep "$WAIT_TIME"
    
    log "$AGENT_NAME complete (assumed)."
}

# Check if Cursor is running and has project open
check_cursor() {
    if ! pgrep -x "Cursor" > /dev/null; then
        log "Starting Cursor..."
        open -a "Cursor" "$PROJECT_DIR"
        sleep 10
    fi
}

log "═══════════════════════════════════════════════════════════"
log "FULL AUTO CURSOR CYCLE STARTING"
log "═══════════════════════════════════════════════════════════"

check_cursor

# ═══════════════════════════════════════════════════════════
# PHASE 1: AUDITOR
# ═══════════════════════════════════════════════════════════
AUDITOR_PROMPT="Read prompts/agents/roles/controllers/AUDITOR.md and execute a full audit cycle. Review the last 6 hours of changes, run tests, check agent activity, and produce an audit report. Save to output/shared/reports/audit-$(date +'%Y%m%d-%H%M').txt"

run_in_cursor "$AUDITOR_PROMPT" "$AUDITOR_WAIT" "AUDITOR"

# ═══════════════════════════════════════════════════════════
# PHASE 2: STRATEGIST
# ═══════════════════════════════════════════════════════════
STRATEGIST_PROMPT="Read prompts/agents/roles/controllers/STRATEGIST.md and execute a strategy cycle. Read the latest audit report from output/shared/reports/, create a strategic plan, and draft task prompts for executor agents."

run_in_cursor "$STRATEGIST_PROMPT" "$STRATEGIST_WAIT" "STRATEGIST"

# ═══════════════════════════════════════════════════════════
# PHASE 3: CURATOR
# ═══════════════════════════════════════════════════════════
CURATOR_PROMPT="Read prompts/agents/roles/controllers/CURATOR.md and execute a curation cycle. Review draft prompts, score them against quality criteria, and distribute final tasks to agent inboxes."

run_in_cursor "$CURATOR_PROMPT" "$CURATOR_WAIT" "CURATOR"

log "═══════════════════════════════════════════════════════════"
log "CONTROLLER CYCLE COMPLETE"
log "═══════════════════════════════════════════════════════════"

# Optional: Run executor agents too
if [ "$1" == "--full" ]; then
    log "Running executor agents..."
    
    # Find all tasks in inboxes
    for INBOX in "$PROJECT_DIR"/output/*-agent/inbox/*.txt; do
        if [ -f "$INBOX" ]; then
            AGENT=$(basename "$(dirname "$(dirname "$INBOX")")" | sed 's/-agent//')
            TASK_FILE=$(basename "$INBOX")
            
            EXEC_PROMPT="Read and execute the task in output/${AGENT}-agent/inbox/${TASK_FILE}"
            run_in_cursor "$EXEC_PROMPT" "$EXECUTOR_WAIT" "${AGENT^^}"
        fi
    done
    
    log "All executor agents complete."
fi

log "═══════════════════════════════════════════════════════════"
log "FULL AUTO CYCLE COMPLETE"
log "═══════════════════════════════════════════════════════════"

# Find latest report for clickable notification
LATEST_REPORT=$(ls -t "$REPORTS_DIR"/*.txt 2>/dev/null | head -1)

# Send clickable notification
if type notify &>/dev/null && [ -n "$LATEST_REPORT" ]; then
    notify "Full Auto Cycle" "All agents complete - Click to view" "$LATEST_REPORT"
else
    osascript -e 'display notification "All agents complete" with title "Full Auto Cycle" sound name "Glass"'
fi

