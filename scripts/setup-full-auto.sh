#!/bin/bash
# Setup fully automated Cursor agent cycles
#
# IMPORTANT REQUIREMENTS:
# 1. Cursor must be installed
# 2. Grant Accessibility permissions to Terminal (or iTerm/script runner)
#    System Preferences → Security & Privacy → Privacy → Accessibility
# 3. Cursor project must be open before automation runs
#
# This uses launchd to run agents every 6 hours through Cursor (not CLI)
# Cost: $0 additional (uses Cursor subscription)

set -e

PROJECT_DIR="/Users/joseph.dawson/Documents/dawson-does-framework"
PLIST_NAME="dev.dawson.full-auto-cursor"
PLIST_PATH="$HOME/Library/LaunchAgents/$PLIST_NAME.plist"

echo "═══════════════════════════════════════════════════════════"
echo "  SETUP FULL AUTO CURSOR CYCLES"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "⚠️  IMPORTANT: Grant Accessibility permissions first!"
echo ""
echo "1. Open System Preferences → Security & Privacy → Privacy"
echo "2. Click 'Accessibility' in the left sidebar"
echo "3. Click the lock to make changes"
echo "4. Add Terminal.app (or iTerm) to the list"
echo "5. Ensure it's checked/enabled"
echo ""
read -p "Have you granted Accessibility permissions? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please grant permissions first, then run this script again."
    exit 1
fi

# Make script executable
chmod +x "$PROJECT_DIR/scripts/full-auto-cursor.sh"

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
        <string>$PROJECT_DIR/scripts/full-auto-cursor.sh</string>
    </array>
    
    <key>WorkingDirectory</key>
    <string>$PROJECT_DIR</string>
    
    <key>StartCalendarInterval</key>
    <array>
        <dict>
            <key>Hour</key>
            <integer>0</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
        <dict>
            <key>Hour</key>
            <integer>6</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
        <dict>
            <key>Hour</key>
            <integer>12</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
        <dict>
            <key>Hour</key>
            <integer>18</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
    </array>
    
    <key>StandardOutPath</key>
    <string>$PROJECT_DIR/logs/full-auto-stdout.log</string>
    
    <key>StandardErrorPath</key>
    <string>$PROJECT_DIR/logs/full-auto-stderr.log</string>
    
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin</string>
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
echo "  FULL AUTO CURSOR CYCLES ACTIVE"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Schedule: Midnight, 6am, Noon, 6pm"
echo "Cost: \$0 additional (Cursor subscription)"
echo ""
echo "⚠️  REQUIREMENTS for overnight runs:"
echo "   1. Computer must NOT be asleep (use caffeinate or disable sleep)"
echo "   2. Cursor must be open with this project"
echo "   3. Screen can be locked but not sleeping"
echo ""
echo "To prevent sleep overnight:"
echo "   caffeinate -i -w \$\$ &"
echo ""
echo "Commands:"
echo "   Run now:     launchctl start $PLIST_NAME"
echo "   View logs:   tail -f $PROJECT_DIR/logs/full-auto.log"
echo "   Stop:        launchctl unload $PLIST_PATH"
echo ""

