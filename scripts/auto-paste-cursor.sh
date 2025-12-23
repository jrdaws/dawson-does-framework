#!/bin/bash
# AUTO-PASTE TO CURSOR
#
# This script opens Cursor, creates a new chat, and pastes a prompt automatically.
# Uses AppleScript for automation - NO Claude CLI costs.
#
# Usage: ./scripts/auto-paste-cursor.sh "Your prompt here"
# Or:    ./scripts/auto-paste-cursor.sh auditor|strategist|curator

set -e

PROMPT="$1"

# Handle shorthand agent names
case "$PROMPT" in
    auditor|AUDITOR)
        PROMPT="Read prompts/agents/roles/controllers/AUDITOR.md and execute a full audit cycle. Review the last 6 hours of changes, run tests, check agent activity, and produce an audit report."
        ;;
    strategist|STRATEGIST)
        PROMPT="Read prompts/agents/roles/controllers/STRATEGIST.md and execute a strategy cycle. Read the latest audit report, create a strategic plan, and draft task prompts for executor agents."
        ;;
    curator|CURATOR)
        PROMPT="Read prompts/agents/roles/controllers/CURATOR.md and execute a curation cycle. Review draft prompts, score them against quality criteria, refine as needed, and distribute final tasks to agent inboxes."
        ;;
esac

if [ -z "$PROMPT" ]; then
    echo "Usage: ./scripts/auto-paste-cursor.sh <prompt|auditor|strategist|curator>"
    exit 1
fi

echo "Opening Cursor and pasting prompt..."

# Copy prompt to clipboard
echo "$PROMPT" | pbcopy

# AppleScript to open Cursor, create new chat, and paste
osascript << 'EOF'
tell application "Cursor"
    activate
    delay 1
end tell

tell application "System Events"
    tell process "Cursor"
        -- Open new AI chat (Cmd+L is common shortcut)
        keystroke "l" using command down
        delay 0.5
        
        -- Paste the prompt (Cmd+V)
        keystroke "v" using command down
        delay 0.3
        
        -- Submit (Enter)
        -- Uncomment the next line if you want auto-submit:
        -- keystroke return
    end tell
end tell
EOF

echo ""
echo "✅ Prompt pasted into Cursor"
echo ""
echo "Press Enter in Cursor to submit, or review first."
echo ""
echo "Note: If the shortcut didn't work, manually:"
echo "  1. Press Cmd+L to open chat"
echo "  2. Press Cmd+V to paste"
echo ""

