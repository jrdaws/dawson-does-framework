#!/bin/bash
# OVERNIGHT AUTOMATION - Runs while you sleep
#
# Cost optimization strategies:
# 1. Uses claude-3-haiku (cheapest model) for Auditor & Strategist
# 2. Uses claude-3-5-sonnet only for Curator (quality matters for final prompts)
# 3. Minimal prompts - just references to files, not full instructions
# 4. Estimated cost: ~$0.10-0.30 per cycle (vs $1.50-5.00 unoptimized)
#
# SETUP:
# 1. Install: npm install -g @anthropic-ai/claude-cli
# 2. Config: claude config set api_key YOUR_KEY
# 3. Test: ./scripts/overnight-cycle.sh --test
# 4. Schedule: ./scripts/setup-overnight.sh

set -e

PROJECT_DIR="/Users/joseph.dawson/Documents/dawson-does-framework"
LOG_DIR="$PROJECT_DIR/logs"
REPORTS_DIR="$PROJECT_DIR/output/shared/reports"
CYCLE_ID=$(date +'%Y%m%d-%H%M')

# Source notification helper for clickable notifications
source "$PROJECT_DIR/scripts/automation/notify.sh" 2>/dev/null || true

# Cost-saving: Use Haiku for routine tasks, Sonnet only for Curator
MODEL_CHEAP="claude-3-haiku-20240307"
MODEL_QUALITY="claude-3-5-sonnet-20241022"

mkdir -p "$LOG_DIR" "$REPORTS_DIR"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_DIR/overnight.log"
}

# Test mode - just verify setup
if [ "$1" == "--test" ]; then
    echo "Testing overnight cycle setup..."
    
    if ! command -v claude &> /dev/null; then
        echo "❌ Claude CLI not installed"
        echo "   Run: npm install -g @anthropic-ai/claude-cli"
        exit 1
    fi
    echo "✅ Claude CLI installed"
    
    # Quick API test with minimal tokens
    if claude --model "$MODEL_CHEAP" --print "Say 'OK'" 2>/dev/null | grep -q "OK"; then
        echo "✅ API key configured"
    else
        echo "❌ API key not configured or invalid"
        echo "   Run: claude config set api_key YOUR_KEY"
        exit 1
    fi
    
    echo "✅ Setup complete - ready for overnight automation"
    exit 0
fi

log "═══════════════════════════════════════════════════════════"
log "OVERNIGHT CYCLE STARTING - $CYCLE_ID"
log "═══════════════════════════════════════════════════════════"

cd "$PROJECT_DIR"

# ═══════════════════════════════════════════════════════════
# PHASE 1: AUDITOR (Haiku - cheap)
# ═══════════════════════════════════════════════════════════
log "Phase 1: Auditor (using $MODEL_CHEAP)"

# Gather data first (free - no AI)
COMMITS=$(git log --oneline --since="6 hours ago" 2>/dev/null | head -20)
TEST_OUTPUT=$(npm test 2>&1 | tail -20 || echo "Tests failed")
PENDING=$(find output -path "*/inbox/*.txt" -type f 2>/dev/null | wc -l | tr -d ' ')
DONE=$(find output -path "*/done/*.txt" -mmin -360 -type f 2>/dev/null | wc -l | tr -d ' ')

# Minimal prompt - just ask for analysis
AUDITOR_PROMPT="Analyze this project state and output a brief audit report:

COMMITS (last 6h):
$COMMITS

TEST RESULTS:
$TEST_OUTPUT

TASKS: $PENDING pending, $DONE completed

Output format:
1. Summary (2 sentences)
2. Top 3 issues
3. Top 3 priorities for next cycle

Be concise - max 300 words."

AUDIT_RESULT=$(claude --model "$MODEL_CHEAP" --print "$AUDITOR_PROMPT" 2>&1)

# Save audit report
cat > "$REPORTS_DIR/audit-$CYCLE_ID.txt" << EOF
# Audit Report - $CYCLE_ID
Generated: $(date)
Model: $MODEL_CHEAP (cost-optimized)

## Raw Data
- Commits: $(echo "$COMMITS" | wc -l | tr -d ' ')
- Pending tasks: $PENDING
- Completed tasks: $DONE

## Analysis
$AUDIT_RESULT
EOF

log "Audit complete. Waiting 10s..."
sleep 10

# ═══════════════════════════════════════════════════════════
# PHASE 2: STRATEGIST (Haiku - cheap)
# ═══════════════════════════════════════════════════════════
log "Phase 2: Strategist (using $MODEL_CHEAP)"

# Read the audit we just created
AUDIT_CONTENT=$(cat "$REPORTS_DIR/audit-$CYCLE_ID.txt")

STRATEGIST_PROMPT="Based on this audit, create task assignments for these agents:
- CLI, Website, Platform, Testing, Template, Documentation, Integration

AUDIT:
$AUDIT_CONTENT

For each task, output ONLY:
AGENT: [name]
TASK: [one sentence]
PRIORITY: P1/P2/P3

Max 5 tasks total. Be concise."

STRATEGY_RESULT=$(claude --model "$MODEL_CHEAP" --print "$STRATEGIST_PROMPT" 2>&1)

# Save strategy report
cat > "$REPORTS_DIR/strategy-$CYCLE_ID.txt" << EOF
# Strategy Report - $CYCLE_ID
Generated: $(date)
Model: $MODEL_CHEAP (cost-optimized)

## Task Assignments
$STRATEGY_RESULT
EOF

log "Strategy complete. Waiting 10s..."
sleep 10

# ═══════════════════════════════════════════════════════════
# PHASE 3: CURATOR (Sonnet - quality for final prompts)
# ═══════════════════════════════════════════════════════════
log "Phase 3: Curator (using $MODEL_QUALITY for quality)"

STRATEGY_CONTENT=$(cat "$REPORTS_DIR/strategy-$CYCLE_ID.txt")

CURATOR_PROMPT="Convert these task assignments into executable prompts.

STRATEGY:
$STRATEGY_CONTENT

For each task, create a prompt file. Output in this exact format for each:

---FILE: output/[agent]-agent/inbox/$CYCLE_ID-[P1/P2/P3]-task-[slug].txt---
# Task: [Title]

Priority: [P1/P2/P3]
Agent: [Name]

## Objective
[Clear instruction]

## Success Criteria
- [ ] [Measurable outcome]

## Files
- [relevant file paths]
---END FILE---

Create prompts only for valid tasks. Skip any unclear items."

CURATOR_RESULT=$(claude --model "$MODEL_QUALITY" --print "$CURATOR_PROMPT" 2>&1)

# Parse and save individual task files
echo "$CURATOR_RESULT" | while IFS= read -r line; do
    if [[ "$line" =~ ^---FILE:\ (.+)---$ ]]; then
        CURRENT_FILE="${BASH_REMATCH[1]}"
        mkdir -p "$(dirname "$CURRENT_FILE")"
        > "$CURRENT_FILE"  # Create/clear file
    elif [[ "$line" == "---END FILE---" ]]; then
        CURRENT_FILE=""
    elif [ -n "$CURRENT_FILE" ]; then
        echo "$line" >> "$CURRENT_FILE"
    fi
done

# Save cycle summary
TASKS_CREATED=$(find output -path "*/inbox/*$CYCLE_ID*.txt" -type f 2>/dev/null | wc -l | tr -d ' ')

cat > "$REPORTS_DIR/cycle-summary-$CYCLE_ID.txt" << EOF
# Cycle Summary - $CYCLE_ID
Generated: $(date)
Mode: Overnight (cost-optimized)

## Models Used
- Auditor: $MODEL_CHEAP
- Strategist: $MODEL_CHEAP  
- Curator: $MODEL_QUALITY

## Results
- Tasks created: $TASKS_CREATED
- Reports: audit, strategy, summary

## Cost Estimate
- Haiku calls (2): ~\$0.02
- Sonnet call (1): ~\$0.10
- Total: ~\$0.12

## Next Steps
Run ./scripts/run-agent.sh all to see tasks
EOF

log "═══════════════════════════════════════════════════════════"
log "CYCLE COMPLETE - $CYCLE_ID"
log "Tasks created: $TASKS_CREATED"
log "Est. cost: ~\$0.12"
log "═══════════════════════════════════════════════════════════"

# Find latest report for clickable notification
CYCLE_SUMMARY="$REPORTS_DIR/cycle-summary-$CYCLE_ID.txt"
LATEST_REPORT=""
if [ -f "$CYCLE_SUMMARY" ]; then
    LATEST_REPORT="$CYCLE_SUMMARY"
else
    LATEST_REPORT=$(ls -t "$REPORTS_DIR"/*.txt 2>/dev/null | head -1)
fi

# Send clickable notification (click to open report)
if type notify &>/dev/null && [ -n "$LATEST_REPORT" ]; then
    notify "Overnight Cycle Complete" "$TASKS_CREATED tasks ready - Click to view" "$LATEST_REPORT"
else
    osascript -e "display notification \"$TASKS_CREATED tasks ready for review\" with title \"Overnight Cycle Complete\" sound name \"Glass\"" 2>/dev/null || true
fi

