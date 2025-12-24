#!/bin/bash
# Quick Certification Update for Mindframe
#
# Usage: ./scripts/certify.sh [AGENT_CODE] [AREA] [STATUS] [VIBE] "[NOTES]"
#
# Agent Codes: TST, DOC, PLT, WEB, CLI, TPL, INT, QUA, AUD, STR, CUR, RES, MED
# Vibes: good, caution, concern
#
# Examples:
#   ./scripts/certify.sh TST "Code Quality" "693 passing" "good" "Full suite green"
#   ./scripts/certify.sh DOC "Documentation" "Current" "good" "3 new SOPs"
#   ./scripts/certify.sh PLT "Deployment" "Pending" "caution" "Awaiting approval"
#
# Version: 1.0
# Last Updated: 2025-12-23

set -e

# Arguments
AGENT_CODE="${1:-}"
AREA="${2:-}"
STATUS="${3:-}"
VIBE="${4:-}"
NOTES="${5:-}"

# Validate
if [ -z "$AGENT_CODE" ] || [ -z "$AREA" ] || [ -z "$STATUS" ] || [ -z "$VIBE" ]; then
    echo ""
    echo "Usage: ./scripts/certify.sh [AGENT_CODE] [AREA] [STATUS] [VIBE] \"[NOTES]\""
    echo ""
    echo "Agent Codes:"
    echo "  TST - Testing Agent"
    echo "  DOC - Documentation Agent"
    echo "  PLT - Platform Agent"
    echo "  WEB - Website Agent"
    echo "  CLI - CLI Agent"
    echo "  TPL - Template Agent"
    echo "  INT - Integration Agent"
    echo "  QUA - Quality Agent"
    echo "  AUD - Auditor Agent"
    echo "  STR - Strategist Agent"
    echo "  CUR - Curator Agent"
    echo "  RES - Research Agent"
    echo "  MED - Media Agent"
    echo ""
    echo "Vibes:"
    echo "  good    - 🟢 Working well"
    echo "  caution - 🟡 Needs attention"
    echo "  concern - 🔴 Broken/blocking"
    echo ""
    echo "Example:"
    echo "  ./scripts/certify.sh TST \"Code Quality\" \"693 passing\" \"good\" \"Full suite green\""
    echo ""
    exit 1
fi

# Map agent code to full name
case "$AGENT_CODE" in
    TST) AGENT_NAME="Testing Agent" ;;
    DOC) AGENT_NAME="Documentation Agent" ;;
    PLT) AGENT_NAME="Platform Agent" ;;
    WEB) AGENT_NAME="Website Agent" ;;
    CLI) AGENT_NAME="CLI Agent" ;;
    TPL) AGENT_NAME="Template Agent" ;;
    INT) AGENT_NAME="Integration Agent" ;;
    QUA) AGENT_NAME="Quality Agent" ;;
    AUD) AGENT_NAME="Auditor Agent" ;;
    STR) AGENT_NAME="Strategist Agent" ;;
    CUR) AGENT_NAME="Curator Agent" ;;
    RES) AGENT_NAME="Research Agent" ;;
    MED) AGENT_NAME="Media Agent" ;;
    *) AGENT_NAME="$AGENT_CODE Agent" ;;
esac

# Map vibe to emoji
case "$VIBE" in
    good)    VIBE_EMOJI="🟢" ; VIBE_TEXT="Good" ;;
    caution) VIBE_EMOJI="🟡" ; VIBE_TEXT="Caution" ;;
    concern) VIBE_EMOJI="🔴" ; VIBE_TEXT="Concern" ;;
    *)       VIBE_EMOJI="⚪" ; VIBE_TEXT="$VIBE" ;;
esac

# Get current date
DATE=$(date +%Y-%m-%d)
DATETIME=$(date +"%Y-%m-%d %H:%M")

MINDFRAME="output/shared/MINDFRAME.md"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           🏆 CERTIFICATION UPDATE                             "
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "  Agent: $AGENT_NAME ($AGENT_CODE)"
echo "  Area: $AREA"
echo "  Status: $STATUS"
echo "  Vibe: $VIBE_EMOJI $VIBE_TEXT"
echo "  Notes: $NOTES"
echo "  Date: $DATE"
echo ""

# Check if mindframe exists
if [ ! -f "$MINDFRAME" ]; then
    echo "❌ Mindframe file not found: $MINDFRAME"
    exit 1
fi

# Create certification entry for manual paste
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Add this row to the '$AREA' section in MINDFRAME.md:"
echo ""
echo "| $AGENT_NAME | $DATE | $STATUS | $VIBE_EMOJI $VIBE_TEXT | $NOTES |"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Log certification to a tracking file
CERT_LOG="output/shared/certification-log.csv"
if [ ! -f "$CERT_LOG" ]; then
    echo "datetime,agent_code,agent_name,area,status,vibe,notes" > "$CERT_LOG"
fi
echo "$DATETIME,$AGENT_CODE,$AGENT_NAME,$AREA,$STATUS,$VIBE_TEXT,$NOTES" >> "$CERT_LOG"

echo "✅ Certification logged to: $CERT_LOG"
echo ""
echo "Next: Open MINDFRAME.md and update the relevant certification table."
echo ""
echo "Quick open command:"
echo "cd /Users/joseph.dawson/Documents/dawson-does-framework && open output/shared/MINDFRAME.md"
echo ""

