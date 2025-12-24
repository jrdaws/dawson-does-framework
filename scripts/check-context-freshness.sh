#!/bin/bash
# Context Freshness Check
# Verifies agent has current information before starting work
#
# Usage: ./scripts/check-context-freshness.sh [role]
# Example: ./scripts/check-context-freshness.sh DOC
#
# Version: 1.0
# Last Updated: 2025-12-23

set -e

ROLE="${1:-}"
ROLE_UPPER=$(echo "$ROLE" | tr '[:lower:]' '[:upper:]')

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           🔍 CONTEXT FRESHNESS CHECK                          "
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

STALE_COUNT=0

# ============================================================================
# Tier 1: Critical Files (Check EVERY session)
# ============================================================================
echo -e "${BLUE}📋 Tier 1: Critical Governance (2-hour threshold)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TIER1_FILES=(
    "AGENT_CONTEXT.md"
    "CLAUDE.md"
    "prompts/agents/AGENT_POLICIES.md"
    "output/shared/PROJECT_PRIORITIES.md"
)

for file in "${TIER1_FILES[@]}"; do
    if [ -f "$file" ]; then
        LAST_MOD=$(git log -1 --format="%ar" -- "$file" 2>/dev/null || echo "unknown")
        
        # Check if modified within last 2 hours
        HOURS_AGO=$(git log -1 --format="%cr" -- "$file" 2>/dev/null | grep -oE '[0-9]+' | head -1 || echo "99")
        IS_HOURS=$(git log -1 --format="%cr" -- "$file" 2>/dev/null | grep -q "hour" && echo "yes" || echo "no")
        IS_MINUTES=$(git log -1 --format="%cr" -- "$file" 2>/dev/null | grep -q "minute" && echo "yes" || echo "no")
        
        if [ "$IS_MINUTES" = "yes" ]; then
            echo -e "   ${GREEN}✅ FRESH${NC}: $file ($LAST_MOD)"
        elif [ "$IS_HOURS" = "yes" ] && [ "$HOURS_AGO" -le 2 ]; then
            echo -e "   ${GREEN}✅ FRESH${NC}: $file ($LAST_MOD)"
        else
            echo -e "   ${YELLOW}⚠️  REVIEW${NC}: $file ($LAST_MOD)"
            STALE_COUNT=$((STALE_COUNT + 1))
        fi
        
        # Show version if available
        VERSION=$(grep -m1 "Version:" "$file" 2>/dev/null | head -1 || echo "")
        if [ -n "$VERSION" ]; then
            echo "      └─ $VERSION"
        fi
    else
        echo -e "   ${RED}❌ MISSING${NC}: $file"
        STALE_COUNT=$((STALE_COUNT + 1))
    fi
done

echo ""

# ============================================================================
# Tier 2: Role-Specific Files (Check if role provided)
# ============================================================================
if [ -n "$ROLE_UPPER" ]; then
    echo -e "${BLUE}📋 Tier 2: Role-Specific (4-hour threshold)${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    ROLE_FILE="prompts/agents/roles/${ROLE_UPPER}_AGENT.md"
    MEMORY_FILE="prompts/agents/memory/${ROLE_UPPER}_MEMORY.md"
    
    for file in "$ROLE_FILE" "$MEMORY_FILE"; do
        if [ -f "$file" ]; then
            LAST_MOD=$(git log -1 --format="%ar" -- "$file" 2>/dev/null || echo "unknown")
            echo -e "   ${GREEN}✓${NC} $file ($LAST_MOD)"
        else
            # Try alternate paths for special agents
            ALT_FILE=$(find prompts/agents/roles -name "*${ROLE_UPPER}*" 2>/dev/null | head -1)
            if [ -n "$ALT_FILE" ]; then
                LAST_MOD=$(git log -1 --format="%ar" -- "$ALT_FILE" 2>/dev/null || echo "unknown")
                echo -e "   ${GREEN}✓${NC} $ALT_FILE ($LAST_MOD)"
            else
                echo -e "   ${YELLOW}⚠️${NC} $file (not found)"
            fi
        fi
    done
    echo ""
fi

# ============================================================================
# Tier 3: Reference Files (Quick summary)
# ============================================================================
echo -e "${BLUE}📋 Tier 3: SOPs & Standards (24-hour threshold)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

SOP_COUNT=$(find docs/sops -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
STANDARDS_COUNT=$(find docs/standards -name "*.md" 2>/dev/null | wc -l | tr -d ' ')

echo "   SOPs available: $SOP_COUNT"
echo "   Standards available: $STANDARDS_COUNT"

# Show recently modified SOPs
RECENT_SOPS=$(find docs/sops -name "*.md" -mmin -1440 2>/dev/null | head -3)
if [ -n "$RECENT_SOPS" ]; then
    echo "   Recently updated:"
    for sop in $RECENT_SOPS; do
        LAST_MOD=$(git log -1 --format="%ar" -- "$sop" 2>/dev/null || echo "unknown")
        echo "      └─ $(basename $sop) ($LAST_MOD)"
    done
fi

echo ""

# ============================================================================
# Recent Governance Changes
# ============================================================================
echo -e "${BLUE}📝 Recent Governance Changes (last 6 hours)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

RECENT_CHANGES=$(git log --oneline --since="6 hours ago" -- prompts/ docs/sops/ AGENT_CONTEXT.md CLAUDE.md .cursorrules 2>/dev/null | head -5)
if [ -n "$RECENT_CHANGES" ]; then
    echo "$RECENT_CHANGES" | while read line; do
        echo "   $line"
    done
else
    echo "   No governance changes in last 6 hours"
fi

echo ""

# ============================================================================
# Priority Check
# ============================================================================
echo -e "${BLUE}🎯 Current Priorities${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "output/shared/PROJECT_PRIORITIES.md" ]; then
    # Show P0 and P1 items
    P0_ITEMS=$(grep -E "^\| P0" output/shared/PROJECT_PRIORITIES.md 2>/dev/null | head -3)
    P1_ITEMS=$(grep -E "^\| P1" output/shared/PROJECT_PRIORITIES.md 2>/dev/null | head -3)
    
    if [ -n "$P0_ITEMS" ]; then
        echo -e "   ${RED}🚨 P0 (Urgent):${NC}"
        echo "$P0_ITEMS" | while read line; do
            echo "      $line"
        done
    fi
    
    if [ -n "$P1_ITEMS" ]; then
        echo -e "   ${YELLOW}⚠️  P1 (High):${NC}"
        echo "$P1_ITEMS" | while read line; do
            echo "      $line"
        done
    fi
    
    if [ -z "$P0_ITEMS" ] && [ -z "$P1_ITEMS" ]; then
        echo "   No urgent priorities (P0/P1)"
    fi
else
    echo "   PROJECT_PRIORITIES.md not found"
fi

echo ""

# ============================================================================
# Summary
# ============================================================================
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           📊 FRESHNESS SUMMARY                                "
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

if [ $STALE_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ CONTEXT FRESH${NC} - Safe to proceed with work"
else
    echo -e "${YELLOW}⚠️  $STALE_COUNT file(s) may need review${NC}"
    echo ""
    echo "Recommended: Re-read stale files before proceeding"
    echo ""
    echo "Quick re-read commands:"
    echo "   cat prompts/agents/AGENT_POLICIES.md | head -100"
    echo "   cat output/shared/PROJECT_PRIORITIES.md"
fi

echo ""
exit 0

