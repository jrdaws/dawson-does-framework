#!/bin/bash
# Trigger Keyboard Maestro to run the improvement cycle
#
# This script triggers a Keyboard Maestro macro instead of using AppleScript directly.
# KM is more reliable for GUI automation.
#
# SETUP REQUIRED:
# 1. Create a macro in Keyboard Maestro named "Run Improvement Cycle"
# 2. See automation/keyboard-maestro-setup.md for macro configuration
#
# USAGE (always use full path for scheduled automation):
#   /Users/joseph.dawson/Documents/dawson-does-framework/scripts/trigger-km-cycle.sh

# Full absolute paths for scheduled automation
PROJECT_DIR="/Users/joseph.dawson/Documents/dawson-does-framework"
LOG_FILE="$PROJECT_DIR/logs/km-trigger.log"
MACRO_NAME="Run Improvement Cycle"

# Ensure log directory exists
mkdir -p "$PROJECT_DIR/logs"

# Log function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Triggering Keyboard Maestro: $MACRO_NAME"

# Check if Keyboard Maestro Engine is running
if ! pgrep -x "Keyboard Maestro Engine" > /dev/null; then
    log "Starting Keyboard Maestro Engine..."
    open -a "Keyboard Maestro Engine"
    sleep 3
fi

# Trigger the macro
osascript -e "tell application \"Keyboard Maestro Engine\" to do script \"$MACRO_NAME\""

log "Macro triggered successfully."
log "Full cycle will take ~18 minutes."
log "Check Keyboard Maestro for status."

