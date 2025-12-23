#!/bin/bash
# Auto-Screenshot for Async Handoffs
# Captures screen every N minutes for documentation
#
# Usage: ./auto-screenshot.sh [interval_seconds]
#   Run in background: nohup ./auto-screenshot.sh &
#   Stop: kill $(cat /tmp/auto-screenshot.pid)

INTERVAL="${1:-900}"  # Default: 15 minutes (900 seconds)
SCREENSHOT_DIR="$HOME/.config/dawson-automation/screenshots"
PID_FILE="/tmp/auto-screenshot.pid"
MAX_SCREENSHOTS=96  # Keep ~24 hours at 15-min intervals

mkdir -p "$SCREENSHOT_DIR"

# Save PID for later termination
echo $$ > "$PID_FILE"

cleanup() {
    rm -f "$PID_FILE"
    echo "Auto-screenshot stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Auto-Screenshot Service Started"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Interval: ${INTERVAL}s ($(($INTERVAL / 60)) minutes)"
echo "Directory: $SCREENSHOT_DIR"
echo "Max screenshots: $MAX_SCREENSHOTS"
echo "PID: $$"
echo ""
echo "Stop with: kill \$(cat /tmp/auto-screenshot.pid)"
echo ""

while true; do
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    FILENAME="$SCREENSHOT_DIR/work-$TIMESTAMP.png"
    
    # Capture screen (silent, no sounds)
    screencapture -x "$FILENAME"
    
    if [ -f "$FILENAME" ]; then
        SIZE=$(du -h "$FILENAME" | cut -f1)
        echo "[$(date '+%H:%M:%S')] Screenshot saved: $(basename "$FILENAME") ($SIZE)"
    else
        echo "[$(date '+%H:%M:%S')] Warning: Screenshot failed"
    fi
    
    # Cleanup: Keep only recent screenshots
    CURRENT_COUNT=$(ls -1 "$SCREENSHOT_DIR"/work-*.png 2>/dev/null | wc -l | tr -d ' ')
    if [ "$CURRENT_COUNT" -gt "$MAX_SCREENSHOTS" ]; then
        DELETE_COUNT=$((CURRENT_COUNT - MAX_SCREENSHOTS))
        ls -1t "$SCREENSHOT_DIR"/work-*.png | tail -n "$DELETE_COUNT" | xargs rm -f
        echo "  Cleaned up $DELETE_COUNT old screenshots"
    fi
    
    sleep "$INTERVAL"
done

