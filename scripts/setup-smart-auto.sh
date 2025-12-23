#!/bin/bash
# Setup Smart Auto Cycle - Cursor primary, CLI backup
#
# This configures scheduled automation that:
# 1. Tries Cursor automation first (FREE)
# 2. Falls back to Claude CLI if Cursor unavailable (~$0.12)

set -e

PROJECT_DIR="/Users/joseph.dawson/Documents/dawson-does-framework"
PLIST_NAME="dev.dawson.smart-auto"
PLIST_PATH="$HOME/Library/LaunchAgents/$PLIST_NAME.plist"

echo "═══════════════════════════════════════════════════════════"
echo "  SETUP SMART AUTO CYCLE"
echo "  Primary: Cursor (FREE) | Backup: CLI (~\$0.12)"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# 1. Cursor
if [ -d "/Applications/Cursor.app" ]; then
    echo "  ✅ Cursor installed"
else
    echo "  ⚠️  Cursor not found - will use CLI only"
fi

# 2. Claude CLI (backup)
if command -v claude &> /dev/null; then
    echo "  ✅ Claude CLI installed (backup ready)"
else
    echo "  ⚠️  Claude CLI not installed"
    echo "     For backup capability, run:"
    echo "     npm install -g @anthropic-ai/claude-cli"
    echo "     claude config set api_key YOUR_KEY"
fi

# 3. Accessibility permissions
echo ""
echo "⚠️  IMPORTANT: Grant Accessibility permissions!"
echo ""
echo "1. Open System Preferences → Security & Privacy → Privacy"
echo "2. Click 'Accessibility' in the left sidebar"
echo "3. Add and enable Terminal.app (or your terminal)"
echo ""
read -p "Have you granted Accessibility permissions? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "You can continue without permissions, but Cursor automation won't work."
    echo "CLI backup will still function."
    echo ""
fi

# Make scripts executable
chmod +x "$PROJECT_DIR/scripts/smart-auto-cycle.sh"
chmod +x "$PROJECT_DIR/scripts/overnight-cycle.sh" 2>/dev/null || true

# Create launchd plist
echo ""
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
        <string>$PROJECT_DIR/scripts/smart-auto-cycle.sh</string>
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
    <string>$PROJECT_DIR/logs/smart-auto-stdout.log</string>
    
    <key>StandardErrorPath</key>
    <string>$PROJECT_DIR/logs/smart-auto-stderr.log</string>
    
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

# Load service
echo "Loading service..."
launchctl unload "$PLIST_PATH" 2>/dev/null || true
launchctl load "$PLIST_PATH"
echo "✅ Service loaded"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  SMART AUTO CYCLE ACTIVE"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Schedule: Midnight, 6am, Noon, 6pm"
echo ""
echo "How it works:"
echo "  • Daytime (awake): Uses Cursor - FREE"
echo "  • Overnight (sleeping): Falls back to CLI - ~\$0.12"
echo "  • Estimated monthly cost: \$0-14 depending on usage"
echo ""
echo "Commands:"
echo "  Run now:     launchctl start $PLIST_NAME"
echo "  View logs:   tail -f $PROJECT_DIR/logs/smart-auto.log"
echo "  Stop:        launchctl unload $PLIST_PATH"
echo ""
echo "To maximize FREE runs (use Cursor more):"
echo "  • Keep Cursor open with project"
echo "  • Prevent sleep: caffeinate -i &"
echo "  • Or use 'Prevent sleep when display off' in Energy settings"
echo ""

