#!/bin/bash
# Agent Memory Sync
# Aggregates all agent memories into a combined view
#
# Usage: ./memory-sync.sh [project_dir] [output_format]
#   output_format: clipboard (default), file, stdout

PROJECT_DIR="${1:-$(cd "$(dirname "$0")/../.." && pwd)}"
OUTPUT_FORMAT="${2:-clipboard}"
MEMORY_DIR="$PROJECT_DIR/prompts/agents/memory"
OUTPUT_FILE="/tmp/agent-memories-combined.md"

if [ ! -d "$MEMORY_DIR" ]; then
    echo "❌ Memory directory not found: $MEMORY_DIR"
    exit 1
fi

# Generate combined memory document
{
    echo "# Combined Agent Memories"
    echo ""
    echo "> Generated: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "---"
    echo ""
    
    # Process each memory file
    for memory_file in "$MEMORY_DIR"/*_MEMORY.md; do
        if [ -f "$memory_file" ]; then
            ROLE=$(basename "$memory_file" | sed 's/_MEMORY\.md//')
            LAST_MODIFIED=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$memory_file" 2>/dev/null || \
                           stat -c "%y" "$memory_file" 2>/dev/null | cut -d'.' -f1)
            
            echo "## $ROLE Agent"
            echo ""
            echo "*Last updated: $LAST_MODIFIED*"
            echo ""
            
            # Get last 2 sessions (look for ## Session: headers)
            awk '
                /^## Session:/ { 
                    session_count++
                    if (session_count <= 2) {
                        printing = 1
                    } else {
                        printing = 0
                    }
                }
                printing { print }
            ' "$memory_file"
            
            echo ""
            echo "---"
            echo ""
        fi
    done
    
    echo ""
    echo "*End of combined memories*"
} > "$OUTPUT_FILE"

# Count what we found
ROLE_COUNT=$(ls "$MEMORY_DIR"/*_MEMORY.md 2>/dev/null | wc -l | tr -d ' ')
LINE_COUNT=$(wc -l < "$OUTPUT_FILE" | tr -d ' ')

case "$OUTPUT_FORMAT" in
    clipboard)
        cat "$OUTPUT_FILE" | pbcopy
        echo "✅ Combined memories copied to clipboard"
        echo "   Roles: $ROLE_COUNT"
        echo "   Lines: $LINE_COUNT"
        ;;
    file)
        echo "✅ Combined memories written to: $OUTPUT_FILE"
        echo "   Roles: $ROLE_COUNT"
        echo "   Lines: $LINE_COUNT"
        ;;
    stdout)
        cat "$OUTPUT_FILE"
        ;;
    summary)
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "  Agent Memory Summary"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        for memory_file in "$MEMORY_DIR"/*_MEMORY.md; do
            if [ -f "$memory_file" ]; then
                ROLE=$(basename "$memory_file" | sed 's/_MEMORY\.md//')
                LAST_MOD=$(stat -f "%Sm" -t "%H:%M" "$memory_file" 2>/dev/null || echo "??:??")
                SESSIONS=$(grep -c "^## Session:" "$memory_file" 2>/dev/null || echo "0")
                SIZE=$(wc -l < "$memory_file" | tr -d ' ')
                
                printf "  %-8s │ Last: %s │ Sessions: %2s │ Lines: %4s\n" \
                    "$ROLE" "$LAST_MOD" "$SESSIONS" "$SIZE"
            fi
        done
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        ;;
    *)
        echo "Unknown output format: $OUTPUT_FORMAT"
        echo "Use: clipboard, file, stdout, or summary"
        exit 1
        ;;
esac

