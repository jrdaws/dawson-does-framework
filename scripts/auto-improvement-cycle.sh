#!/bin/bash
# Automated Improvement Cycle using Claude CLI
# 
# SETUP REQUIRED:
# 1. Install Claude CLI: npm install -g @anthropic-ai/claude-cli
# 2. Configure API key: claude config set api_key YOUR_KEY
# 3. Add to crontab: crontab -e
#    0 */6 * * * cd /Users/joseph.dawson/Documents/dawson-does-framework && ./scripts/auto-improvement-cycle.sh >> logs/cycles.log 2>&1
#
# This script runs all three controller agents in sequence with proper delays

set -e

PROJECT_DIR="/Users/joseph.dawson/Documents/dawson-does-framework"
LOG_DIR="$PROJECT_DIR/logs"
REPORTS_DIR="$PROJECT_DIR/output/shared/reports"
CYCLE_ID=$(date +'%Y%m%d-%H%M')

# Source notification helper for clickable notifications
source "$PROJECT_DIR/scripts/automation/notify.sh" 2>/dev/null || true

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Log function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "═══════════════════════════════════════════════════════════"
log "AUTOMATED IMPROVEMENT CYCLE STARTING"
log "Cycle ID: $CYCLE_ID"
log "═══════════════════════════════════════════════════════════"

cd "$PROJECT_DIR"

# Check if claude CLI is available
if ! command -v claude &> /dev/null; then
    log "ERROR: Claude CLI not installed. Run: npm install -g @anthropic-ai/claude-cli"
    exit 1
fi

# ═══════════════════════════════════════════════════════════
# PHASE 1: AUDITOR
# ═══════════════════════════════════════════════════════════
log "PHASE 1: Running Auditor..."

AUDITOR_PROMPT="Read prompts/agents/roles/controllers/AUDITOR.md and execute a full audit cycle. Review the last 6 hours of changes, run tests, check agent activity, and produce an audit report. Save report to output/shared/reports/audit-$CYCLE_ID.txt"

claude --print "$AUDITOR_PROMPT" > "$LOG_DIR/auditor-$CYCLE_ID.log" 2>&1

# Verify audit report was created
if [ ! -f "$REPORTS_DIR/audit-$CYCLE_ID.txt" ]; then
    log "WARNING: Audit report not found at expected path, checking for any recent audit..."
    LATEST_AUDIT=$(ls -t "$REPORTS_DIR"/audit-*.txt 2>/dev/null | head -1)
    if [ -z "$LATEST_AUDIT" ]; then
        log "ERROR: No audit report created. Aborting cycle."
        exit 1
    fi
fi

log "Auditor complete. Waiting 30 seconds before Strategist..."
sleep 30

# ═══════════════════════════════════════════════════════════
# PHASE 2: STRATEGIST
# ═══════════════════════════════════════════════════════════
log "PHASE 2: Running Strategist..."

STRATEGIST_PROMPT="Read prompts/agents/roles/controllers/STRATEGIST.md and execute a strategy cycle. Read the latest audit report, create a strategic plan, and draft task prompts for executor agents. Save strategy to output/shared/reports/strategy-$CYCLE_ID.txt"

claude --print "$STRATEGIST_PROMPT" > "$LOG_DIR/strategist-$CYCLE_ID.log" 2>&1

# Verify strategy report was created
if [ ! -f "$REPORTS_DIR/strategy-$CYCLE_ID.txt" ]; then
    log "WARNING: Strategy report not found at expected path, checking for any recent strategy..."
    LATEST_STRATEGY=$(ls -t "$REPORTS_DIR"/strategy-*.txt 2>/dev/null | head -1)
    if [ -z "$LATEST_STRATEGY" ]; then
        log "ERROR: No strategy report created. Aborting cycle."
        exit 1
    fi
fi

log "Strategist complete. Waiting 30 seconds before Curator..."
sleep 30

# ═══════════════════════════════════════════════════════════
# PHASE 3: CURATOR
# ═══════════════════════════════════════════════════════════
log "PHASE 3: Running Curator..."

CURATOR_PROMPT="Read prompts/agents/roles/controllers/CURATOR.md and execute a curation cycle. Review draft prompts, score them against quality criteria, refine as needed, and distribute final tasks to agent inboxes. Save summary to output/shared/reports/cycle-summary-$CYCLE_ID.txt"

claude --print "$CURATOR_PROMPT" > "$LOG_DIR/curator-$CYCLE_ID.log" 2>&1

log "Curator complete."

# ═══════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════
log "═══════════════════════════════════════════════════════════"
log "CYCLE $CYCLE_ID COMPLETE"
log "═══════════════════════════════════════════════════════════"

# Count tasks distributed
TASK_COUNT=$(find "$PROJECT_DIR/output" -path "*/inbox/*.txt" -newer "$REPORTS_DIR/audit-$CYCLE_ID.txt" 2>/dev/null | wc -l | tr -d ' ')
log "Tasks distributed to agent inboxes: $TASK_COUNT"

# Find latest report for clickable notification
CYCLE_SUMMARY="$REPORTS_DIR/cycle-summary-$CYCLE_ID.txt"
STRATEGY_REPORT="$REPORTS_DIR/strategy-$CYCLE_ID.txt"
AUDIT_REPORT="$REPORTS_DIR/audit-$CYCLE_ID.txt"

# Choose best report to link to
LATEST_REPORT=""
if [ -f "$CYCLE_SUMMARY" ]; then
    LATEST_REPORT="$CYCLE_SUMMARY"
elif [ -f "$STRATEGY_REPORT" ]; then
    LATEST_REPORT="$STRATEGY_REPORT"
elif [ -f "$AUDIT_REPORT" ]; then
    LATEST_REPORT="$AUDIT_REPORT"
fi

# Send clickable notification
if type notify &>/dev/null && [ -n "$LATEST_REPORT" ]; then
    notify "Improvement Cycle" "Cycle $CYCLE_ID complete. $TASK_COUNT tasks - Click to view" "$LATEST_REPORT"
else
    osascript -e "display notification \"Cycle $CYCLE_ID complete. $TASK_COUNT tasks distributed.\" with title \"Improvement Cycle\" sound name \"Glass\"" 2>/dev/null || true
fi

log "Logs saved to: $LOG_DIR/*-$CYCLE_ID.log"
log "Next cycle scheduled in 6 hours."

