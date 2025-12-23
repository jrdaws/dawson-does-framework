#!/bin/bash
# Run a complete improvement cycle with proper sequencing
# Usage: ./scripts/run-improvement-cycle.sh
#
# This script provides guidance for manual execution or can be extended
# for automation with Claude CLI

set -e

OUTPUT_DIR="output"
REPORTS_DIR="$OUTPUT_DIR/shared/reports"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  CONTINUOUS IMPROVEMENT CYCLE${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Get current timestamp for this cycle
CYCLE_ID=$(date +'%Y%m%d-%H%M')
echo -e "${BLUE}Cycle ID:${NC} $CYCLE_ID"
echo ""

# Check for recent reports
LATEST_AUDIT=$(ls -t "$REPORTS_DIR"/audit-*.txt 2>/dev/null | head -1)
LATEST_STRATEGY=$(ls -t "$REPORTS_DIR"/strategy-*.txt 2>/dev/null | head -1)

echo -e "${YELLOW}Current State:${NC}"
if [ -n "$LATEST_AUDIT" ]; then
    AUDIT_AGE=$(( ($(date +%s) - $(stat -f %m "$LATEST_AUDIT")) / 60 ))
    echo -e "  Latest Audit: $(basename "$LATEST_AUDIT") (${AUDIT_AGE}m ago)"
else
    echo -e "  Latest Audit: ${RED}None found${NC}"
fi

if [ -n "$LATEST_STRATEGY" ]; then
    STRATEGY_AGE=$(( ($(date +%s) - $(stat -f %m "$LATEST_STRATEGY")) / 60 ))
    echo -e "  Latest Strategy: $(basename "$LATEST_STRATEGY") (${STRATEGY_AGE}m ago)"
else
    echo -e "  Latest Strategy: ${RED}None found${NC}"
fi
echo ""

# Determine which phase to run
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  PHASE SEQUENCING${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Phase 1: Auditor
echo -e "${YELLOW}PHASE 1: AUDITOR${NC}"
if [ -z "$LATEST_AUDIT" ] || [ "$AUDIT_AGE" -gt 360 ]; then
    echo -e "  Status: ${GREEN}Ready to run${NC} (no recent audit)"
    echo ""
    echo -e "  ${BLUE}Copy this into a new Cursor chat:${NC}"
    echo ""
    echo "Read prompts/agents/roles/controllers/AUDITOR.md and execute a full audit cycle. Review the last 6 hours of changes, run tests, check agent activity, and produce an audit report."
    echo ""
    echo -e "  ${YELLOW}Wait for Auditor to complete before proceeding.${NC}"
else
    echo -e "  Status: ${GREEN}Complete${NC} (${AUDIT_AGE}m ago)"
fi
echo ""

# Phase 2: Strategist
echo -e "${YELLOW}PHASE 2: STRATEGIST${NC}"
if [ -z "$LATEST_AUDIT" ] || [ "$AUDIT_AGE" -gt 360 ]; then
    echo -e "  Status: ${RED}Blocked${NC} - waiting for Auditor"
elif [ -z "$LATEST_STRATEGY" ] || [ "$STRATEGY_AGE" -gt 360 ]; then
    echo -e "  Status: ${GREEN}Ready to run${NC}"
    echo ""
    echo -e "  ${BLUE}Copy this into a new Cursor chat:${NC}"
    echo ""
    echo "Read prompts/agents/roles/controllers/STRATEGIST.md and execute a strategy cycle. Read the latest audit report, create a strategic plan, and draft task prompts for executor agents."
    echo ""
    echo -e "  ${YELLOW}Wait for Strategist to complete before proceeding.${NC}"
else
    echo -e "  Status: ${GREEN}Complete${NC} (${STRATEGY_AGE}m ago)"
fi
echo ""

# Phase 3: Curator
echo -e "${YELLOW}PHASE 3: CURATOR${NC}"
if [ -z "$LATEST_STRATEGY" ] || [ "$STRATEGY_AGE" -gt 360 ]; then
    echo -e "  Status: ${RED}Blocked${NC} - waiting for Strategist"
else
    DRAFTS_COUNT=$(ls "$OUTPUT_DIR/controller-agents/strategist/outbox/drafts/"*.txt 2>/dev/null | wc -l | tr -d ' ')
    if [ "$DRAFTS_COUNT" -gt 0 ]; then
        echo -e "  Status: ${GREEN}Ready to run${NC} ($DRAFTS_COUNT draft prompts waiting)"
        echo ""
        echo -e "  ${BLUE}Copy this into a new Cursor chat:${NC}"
        echo ""
        echo "Read prompts/agents/roles/controllers/CURATOR.md and execute a curation cycle. Review draft prompts, score them against quality criteria, refine as needed, and distribute final tasks to agent inboxes."
    else
        echo -e "  Status: ${YELLOW}No drafts${NC} - Strategist may not have created prompts"
    fi
fi
echo ""

echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  AFTER CYCLE COMPLETES${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Run this to see executor agent tasks:"
echo ""
echo "./scripts/run-agent.sh all"
echo ""

