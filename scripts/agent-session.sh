#!/bin/bash
# Agent Session Management
# Handles session start/end with memory verification
#
# Usage:
#   ./scripts/agent-session.sh start <role>   - Start session, show memory
#   ./scripts/agent-session.sh end <role>     - End session, verify updates
#   ./scripts/agent-session.sh verify <role>  - Verify memory was updated
#
# Version: 1.0
# Last Updated: 2025-12-22

set -e

MEMORY_DIR="prompts/agents/memory"

show_usage() {
    echo "Agent Session Management"
    echo ""
    echo "Usage:"
    echo "  $0 start <role>    Start session, display memory for continuity"
    echo "  $0 end <role>      End session, verify memory updated"
    echo "  $0 verify <role>   Check if memory was recently updated"
    echo ""
    echo "Roles: CLI, Website, Template, Integration, Documentation, Testing, Platform"
    echo ""
}

get_memory_file() {
    local ROLE="$1"
    local ROLE_UPPER=$(echo "$ROLE" | tr '[:lower:]' '[:upper:]')
    echo "${MEMORY_DIR}/${ROLE_UPPER}_MEMORY.md"
}

start_session() {
    local ROLE="$1"
    local MEMORY_FILE=$(get_memory_file "$ROLE")
    
    if [ ! -f "$MEMORY_FILE" ]; then
        echo "❌ Error: Memory file not found: $MEMORY_FILE"
        exit 1
    fi
    
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           🧠 AGENT SESSION START: $ROLE                        "
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📁 Memory File: $MEMORY_FILE"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📅 RECENT SESSIONS (Prove you read this by quoting a session):"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Extract recent sessions (first 30 lines after "Session History" or "Recent Sessions")
    grep -A 30 -E "Session History|Recent Sessions" "$MEMORY_FILE" | head -35
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 CURRENT TASK QUEUE:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Extract task queue
    grep -A 20 "Task Queue" "$MEMORY_FILE" | head -25
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🐛 KNOWN ISSUES:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Extract known issues
    grep -A 10 "Known Issues" "$MEMORY_FILE" | head -15
    
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║  ⚠️  CONTINUITY REQUIREMENT                                   "
    echo "║                                                              "
    echo "║  In your FIRST response, you must state:                     "
    echo "║  1. The last session ID and what was done                    "
    echo "║  2. Current top priority from task queue                     "
    echo "║  3. Any blockers from known issues                           "
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Create session marker
    local SESSION_ID="${ROLE}-$(date +%Y%m%d-%H%M%S)"
    echo "$SESSION_ID" > ".current-session"
    echo "📍 Session ID: $SESSION_ID"
    echo ""
}

end_session() {
    local ROLE="$1"
    local MEMORY_FILE=$(get_memory_file "$ROLE")
    
    if [ ! -f "$MEMORY_FILE" ]; then
        echo "❌ Error: Memory file not found: $MEMORY_FILE"
        exit 1
    fi
    
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           🏁 AGENT SESSION END: $ROLE                          "
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Check if memory was modified recently (within last 2 hours)
    local NOW=$(date +%s)
    local MOD_TIME=$(stat -f %m "$MEMORY_FILE" 2>/dev/null || stat -c %Y "$MEMORY_FILE" 2>/dev/null)
    local AGE=$(( (NOW - MOD_TIME) / 60 ))
    
    if [ $AGE -gt 120 ]; then
        echo "⚠️  WARNING: Memory file hasn't been updated in $AGE minutes!"
        echo ""
        echo "   You MUST add a session entry before ending."
        echo "   Edit: $MEMORY_FILE"
        echo ""
        exit 1
    else
        echo "✅ Memory file updated $AGE minutes ago"
    fi
    
    # Check for uncommitted changes
    if git status --porcelain | grep -q .; then
        echo ""
        echo "⚠️  WARNING: You have uncommitted changes!"
        echo ""
        git status --short
        echo ""
        echo "   Run: git add -A && git commit -m 'your message'"
        echo ""
    else
        echo "✅ All changes committed"
    fi
    
    # Remove session marker
    rm -f ".current-session"
    
    echo ""
    echo "Session ended. Don't forget to push!"
    echo ""
}

verify_memory() {
    local ROLE="$1"
    local MEMORY_FILE=$(get_memory_file "$ROLE")
    
    if [ ! -f "$MEMORY_FILE" ]; then
        echo "❌ Memory file not found: $MEMORY_FILE"
        exit 1
    fi
    
    # Check modification time
    local NOW=$(date +%s)
    local MOD_TIME=$(stat -f %m "$MEMORY_FILE" 2>/dev/null || stat -c %Y "$MEMORY_FILE" 2>/dev/null)
    local AGE=$(( (NOW - MOD_TIME) / 60 ))
    
    echo ""
    echo "Memory Verification: $ROLE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "File: $MEMORY_FILE"
    echo "Last modified: $AGE minutes ago"
    echo ""
    
    if [ $AGE -lt 60 ]; then
        echo "✅ Memory recently updated (within 1 hour)"
    elif [ $AGE -lt 120 ]; then
        echo "⚠️  Memory updated $AGE minutes ago (consider updating)"
    else
        echo "❌ Memory is stale ($AGE minutes old)"
    fi
    echo ""
}

# Main
case "${1:-}" in
    start)
        if [ -z "${2:-}" ]; then
            echo "Error: Role required"
            show_usage
            exit 1
        fi
        start_session "$2"
        ;;
    end)
        if [ -z "${2:-}" ]; then
            echo "Error: Role required"
            show_usage
            exit 1
        fi
        end_session "$2"
        ;;
    verify)
        if [ -z "${2:-}" ]; then
            echo "Error: Role required"
            show_usage
            exit 1
        fi
        verify_memory "$2"
        ;;
    *)
        show_usage
        exit 1
        ;;
esac

