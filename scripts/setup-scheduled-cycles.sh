#!/bin/bash
# Setup automated improvement cycles on macOS
#
# This script creates a launchd plist to run improvement cycles every 6 hours
# Launchd is more reliable than cron on macOS

set -e

PROJECT_DIR="/Users/joseph.dawson/Documents/dawson-does-framework"
PLIST_NAME="dev.dawson.improvement-cycle"
PLIST_PATH="$HOME/Library/LaunchAgents/$PLIST_NAME.plist"

echo "═══════════════════════════════════════════════════════════"
echo "  SETUP AUTOMATED IMPROVEMENT CYCLES"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check for Claude CLI
echo "Checking prerequisites..."
if command -v claude &> /dev/null; then
    echo "  ✅ Claude CLI installed"
else
    echo "  ❌ Claude CLI not found"
    echo ""
    echo "  Install with: npm install -g @anthropic-ai/claude-cli"
    echo "  Configure with: claude config set api_key YOUR_API_KEY"
    echo ""
    exit 1
fi

# Create the launchd plist
echo ""
echo "Creating launchd plist..."

cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>$PLIST_NAME</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>$PROJECT_DIR/scripts/auto-improvement-cycle.sh</string>
    </array>
    
    <key>WorkingDirectory</key>
    <string>$PROJECT_DIR</string>
    
    <key>StartInterval</key>
    <integer>21600</integer><!-- 6 hours in seconds -->
    
    <key>StandardOutPath</key>
    <string>$PROJECT_DIR/logs/launchd-stdout.log</string>
    
    <key>StandardErrorPath</key>
    <string>$PROJECT_DIR/logs/launchd-stderr.log</string>
    
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin</string>
    </dict>
    
    <key>RunAtLoad</key>
    <false/>
</dict>
</plist>
EOF

echo "  ✅ Plist created at: $PLIST_PATH"

# Load the agent
echo ""
echo "Loading launchd agent..."
launchctl unload "$PLIST_PATH" 2>/dev/null || true
launchctl load "$PLIST_PATH"
echo "  ✅ Agent loaded"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  SETUP COMPLETE"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "The improvement cycle will run every 6 hours."
echo ""
echo "Commands:"
echo "  Start now:    launchctl start $PLIST_NAME"
echo "  Stop:         launchctl stop $PLIST_NAME"
echo "  Unload:       launchctl unload $PLIST_PATH"
echo "  View logs:    tail -f $PROJECT_DIR/logs/launchd-stdout.log"
echo ""
echo "To run a test cycle now:"
echo "  launchctl start $PLIST_NAME"
echo ""

