#!/bin/bash
# CHEAP TRIGGER: Minimal Claude CLI usage
# 
# This script uses ONE cheap Claude CLI call just to assess state,
# then notifies you to run the actual agents in Cursor (free).
#
# Cost: ~$0.02-0.05 per trigger (just a quick assessment)
# vs Full automation: ~$1.50-5.00 per cycle

set -e

PROJECT_DIR="/Users/joseph.dawson/Documents/dawson-does-framework"
CYCLE_ID=$(date +'%Y%m%d-%H%M')

echo "═══════════════════════════════════════════════════════════"
echo "  CHEAP CYCLE TRIGGER"
echo "  Cycle ID: $CYCLE_ID"
echo "═══════════════════════════════════════════════════════════"

cd "$PROJECT_DIR"

# Quick state check (no Claude CLI needed for this)
echo ""
echo "Gathering state..."

COMMIT_COUNT=$(git log --oneline --since="6 hours ago" 2>/dev/null | wc -l | tr -d ' ')
TEST_RESULT=$(npm test 2>&1 | tail -3 || echo "Tests could not run")
PENDING_TASKS=$(find output -path "*/inbox/*.txt" 2>/dev/null | wc -l | tr -d ' ')
COMPLETED_TASKS=$(find output -path "*/done/*.txt" -mmin -360 2>/dev/null | wc -l | tr -d ' ')

# Create a state summary file
STATE_FILE="$PROJECT_DIR/output/shared/reports/state-$CYCLE_ID.txt"
cat > "$STATE_FILE" << EOF
# Cycle State Summary
Generated: $(date)
Cycle ID: $CYCLE_ID

## Quick Stats
- Commits (last 6h): $COMMIT_COUNT
- Pending tasks: $PENDING_TASKS
- Completed tasks (last 6h): $COMPLETED_TASKS

## Test Results
$TEST_RESULT

## Recent Commits
$(git log --oneline --since="6 hours ago" 2>/dev/null | head -10)

## Action Required
Launch the Auditor agent in Cursor with this prompt:

Read prompts/agents/roles/controllers/AUDITOR.md and execute a full audit cycle.
EOF

echo "State summary saved to: $STATE_FILE"

# Send macOS notification with action prompt
osascript << EOF
display dialog "Improvement Cycle Ready

Commits: $COMMIT_COUNT
Pending: $PENDING_TASKS tasks
Completed: $COMPLETED_TASKS tasks

Launch Auditor in Cursor?" buttons {"Skip", "Open Cursor"} default button "Open Cursor" with title "Dawson-Does Framework"

if button returned of result is "Open Cursor" then
    tell application "Cursor" to activate
end if
EOF

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  NEXT STEPS (Run in Cursor - FREE)"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Step 1: Copy this into a new Cursor chat:"
echo ""
echo "Read prompts/agents/roles/controllers/AUDITOR.md and execute a full audit cycle."
echo ""
echo "Step 2: After Auditor completes, run Strategist, then Curator."
echo ""
echo "Or run: ./scripts/run-improvement-cycle.sh for guided steps"
echo ""

