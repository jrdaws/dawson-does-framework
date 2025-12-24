#!/bin/bash
# Documentation Freshness Check Script
# Usage: ./scripts/check-doc-freshness.sh

echo ""
echo "📚 Documentation Freshness Check"
echo "================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track issues
ISSUES=0

# Function to check file freshness
check_freshness() {
    local file=$1
    local name=$2
    local max_days=${3:-30}  # Default 30 days
    
    if [ ! -f "$file" ]; then
        echo -e "   ${RED}❌ NOT FOUND${NC}: $file"
        ((ISSUES++))
        return
    fi
    
    # Get days since last modification
    if command -v git &> /dev/null; then
        last_modified=$(git log -1 --format="%ar" -- "$file" 2>/dev/null)
        days_ago=$(git log -1 --format="%cr" -- "$file" 2>/dev/null | grep -oE '[0-9]+' | head -1)
        
        if echo "$last_modified" | grep -qE "month|year"; then
            echo -e "   ${RED}🔴 STALE${NC}: $name ($last_modified)"
            ((ISSUES++))
        elif echo "$last_modified" | grep -qE "week"; then
            echo -e "   ${YELLOW}🟡 AGING${NC}: $name ($last_modified)"
        else
            echo -e "   ${GREEN}✅ FRESH${NC}: $name ($last_modified)"
        fi
    else
        # Fallback if git not available
        echo -e "   ${YELLOW}⚠️ UNKNOWN${NC}: $name (git not available)"
    fi
}

# 1. Core Documentation
echo "1. Core Documentation"
echo "---------------------"
check_freshness "README.md" "README.md"
check_freshness "AGENT_CONTEXT.md" "AGENT_CONTEXT.md"
check_freshness "CLAUDE.md" "CLAUDE.md"
check_freshness "FRAMEWORK_MAP.md" "FRAMEWORK_MAP.md"

# 2. Setup & Configuration
echo ""
echo "2. Setup & Configuration"
echo "------------------------"
check_freshness "docs/COMPLETE_SETUP_GUIDE.md" "Complete Setup Guide"
check_freshness ".env.example" ".env.example" 60
check_freshness "package.json" "package.json"

# 3. Standards & Policies
echo ""
echo "3. Standards & Policies"
echo "-----------------------"
check_freshness "docs/standards/API_CONTRACTS.md" "API Contracts"
check_freshness "docs/standards/PROMPT_STANDARDS.md" "Prompt Standards"
check_freshness "prompts/agents/AGENT_POLICIES.md" "Agent Policies"
check_freshness "docs/FILE_UPDATE_POLICY.md" "File Update Policy"

# 4. SOPs
echo ""
echo "4. Standard Operating Procedures"
echo "---------------------------------"
check_freshness "docs/sops/BUG_TRIAGE_SOP.md" "Bug Triage SOP"
check_freshness "docs/sops/DOCUMENTATION_SYNC_SOP.md" "Doc Sync SOP"
check_freshness "docs/sops/DEPLOYMENT_SOP.md" "Deployment SOP"

# 5. Agent Memory Files
echo ""
echo "5. Agent Memory Files"
echo "---------------------"
for mem in prompts/agents/memory/*_MEMORY.md; do
    if [ -f "$mem" ]; then
        name=$(basename "$mem" .md)
        check_freshness "$mem" "$name" 7
    fi
done

# 6. Check for dead links (basic)
echo ""
echo "6. Link Check (sampling)"
echo "------------------------"
DEAD_LINKS=$(grep -roh '\[.*\](.*\.md)' docs/ 2>/dev/null | grep -v node_modules | head -5)
if [ -n "$DEAD_LINKS" ]; then
    echo "   Checking first 5 markdown links..."
    echo "$DEAD_LINKS" | while read link; do
        # Extract path
        path=$(echo "$link" | grep -oE '\(.*\)' | tr -d '()')
        if [ -n "$path" ] && [ ! -f "docs/$path" ] && [ ! -f "$path" ]; then
            echo -e "   ${YELLOW}⚠️ POTENTIAL DEAD LINK${NC}: $link"
        fi
    done
else
    echo -e "   ${GREEN}✅${NC} No obvious dead links found"
fi

# 7. Version Check
echo ""
echo "7. Version Consistency"
echo "----------------------"
PKG_VERSION=$(node -p "require('./package.json').version" 2>/dev/null)
echo "   package.json version: ${PKG_VERSION:-unknown}"

# 8. API Route vs Documentation Check
echo ""
echo "8. API Routes"
echo "-------------"
if [ -d "website/app/api" ]; then
    ROUTE_COUNT=$(find website/app/api -name "route.ts" | wc -l | tr -d ' ')
    echo "   API routes in code: $ROUTE_COUNT"
    echo "   Verify: docs/standards/API_CONTRACTS.md is current"
else
    echo "   No website/app/api directory found"
fi

# Summary
echo ""
echo "================================="
if [ $ISSUES -gt 0 ]; then
    echo -e "${RED}Found $ISSUES documentation issue(s) requiring attention${NC}"
    exit 1
else
    echo -e "${GREEN}All documentation appears fresh ✅${NC}"
    exit 0
fi

