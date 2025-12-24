#!/bin/bash
# Notification helper for Dawson-Does automation
# Supports clickable notifications that open files
#
# Usage:
#   source ./scripts/automation/notify.sh
#   notify "Title" "Message" "/path/to/file.txt"
#
# If terminal-notifier is installed, clicking the notification opens the file.
# Falls back to osascript if terminal-notifier is not available.

# Find terminal-notifier (check common Homebrew paths)
TERMINAL_NOTIFIER=""
if command -v terminal-notifier &> /dev/null; then
    TERMINAL_NOTIFIER="terminal-notifier"
elif [ -x "/opt/homebrew/bin/terminal-notifier" ]; then
    TERMINAL_NOTIFIER="/opt/homebrew/bin/terminal-notifier"
elif [ -x "/usr/local/bin/terminal-notifier" ]; then
    TERMINAL_NOTIFIER="/usr/local/bin/terminal-notifier"
fi

# Send notification with optional file link
# Args: $1=title, $2=message, $3=file_path (optional)
notify() {
    local title="${1:-Dawson-Does}"
    local message="${2:-Task complete}"
    local file_path="$3"
    
    if [ -n "$TERMINAL_NOTIFIER" ]; then
        if [ -n "$file_path" ] && [ -f "$file_path" ]; then
            # Clickable notification - opens file when clicked
            "$TERMINAL_NOTIFIER" \
                -title "$title" \
                -message "$message" \
                -subtitle "Click to open report" \
                -sound "Glass" \
                -open "file://$file_path" \
                -group "dawson-does" \
                2>/dev/null
        else
            # Simple notification without file link
            "$TERMINAL_NOTIFIER" \
                -title "$title" \
                -message "$message" \
                -sound "Glass" \
                -group "dawson-does" \
                2>/dev/null
        fi
    else
        # Fallback to osascript (no clickable links)
        osascript -e "display notification \"$message\" with title \"$title\" sound name \"Glass\"" 2>/dev/null || true
    fi
}

# Send multiple notifications for multiple files
# Args: $1=title, $2=message, $3+=file_paths
notify_with_files() {
    local title="${1:-Dawson-Does}"
    local message="${2:-Task complete}"
    shift 2
    local files=("$@")
    
    if [ ${#files[@]} -eq 0 ]; then
        notify "$title" "$message"
        return
    fi
    
    # Send notification for each file
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            local filename=$(basename "$file")
            notify "$title" "$message - $filename" "$file"
            sleep 0.5  # Small delay between notifications
        fi
    done
}

# Quick notification for cycle completion
# Args: $1=cycle_type, $2=report_path
notify_cycle_complete() {
    local cycle_type="${1:-Cycle}"
    local report_path="$2"
    
    notify "$cycle_type Complete" "Click to view report" "$report_path"
}

# Export functions for use in other scripts
export -f notify 2>/dev/null || true
export -f notify_with_files 2>/dev/null || true
export -f notify_cycle_complete 2>/dev/null || true

