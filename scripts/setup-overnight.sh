#!/bin/bash
# Setup overnight automation with launchd
#
# This creates a macOS launchd job that runs the improvement cycle
# every 6 hours, even when you're sleeping.

set -e

PROJECT_DIR="/Users/joseph.dawson/Documents/dawson-does-framework"
PLIST_NAME="dev.dawson.overnight-cycle"
PLIST_PATH="$HOME/Library/LaunchAgents/$PLIST_NAME.plist"

echo "═══════════════════════════════════════════════════════════"
echo "  SETUP OVERNIGHT AUTOMATION"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Test the overnight script first
echo "Testing overnight cycle setup..."
if ! "$PROJECT_DIR/scripts/overnight-cycle.sh" --test; then
    echo ""
    echo "❌ Setup test failed. Fix the issues above first."
    exit 1
fi
echo ""

# Create launchd plist
echo "Creating launchd service..."

cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>$PLIST_NAME</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>$PROJECT_DIR/scripts/overnight-cycle.sh</string>
    </array>
    
    <key>WorkingDirectory</key>
    <string>$PROJECT_DIR</string>
    
    <key>StartCalendarInterval</key>
    <array>
        <!-- Run at midnight -->
        <dict>
            <key>Hour</key>
            <integer>0</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
        <!-- Run at 6am -->
        <dict>
            <key>Hour</key>
            <integer>6</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
        <!-- Run at noon -->
        <dict>
            <key>Hour</key>
            <integer>12</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
        <!-- Run at 6pm -->
        <dict>
            <key>Hour</key>
            <integer>18</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
    </array>
    
    <key>StandardOutPath</key>
    <string>$PROJECT_DIR/logs/overnight-stdout.log</string>
    
    <key>StandardErrorPath</key>
    <string>$PROJECT_DIR/logs/overnight-stderr.log</string>
    
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:$HOME/.npm-global/bin</string>
        <key>HOME</key>
        <string>$HOME</string>
    </dict>
</dict>
</plist>
EOF

echo "✅ Plist created"

# Load the service
echo "Loading service..."
launchctl unload "$PLIST_PATH" 2>/dev/null || true
launchctl load "$PLIST_PATH"
echo "✅ Service loaded"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  OVERNIGHT AUTOMATION ACTIVE"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Schedule: Midnight, 6am, Noon, 6pm (every 6 hours)"
echo "Est. cost: ~\$0.12 per cycle = ~\$0.48/day = ~\$14/month"
echo ""
echo "Commands:"
echo "  Run now:     launchctl start $PLIST_NAME"
echo "  View logs:   tail -f $PROJECT_DIR/logs/overnight.log"
echo "  Stop:        launchctl unload $PLIST_PATH"
echo ""
echo "When you wake up:"
echo "  ./scripts/run-agent.sh all    # See overnight tasks"
echo ""

