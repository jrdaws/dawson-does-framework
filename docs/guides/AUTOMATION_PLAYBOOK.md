# Automation Playbook

> **Version**: 1.0 | **Last Updated**: 2025-12-23
>
> Transform Cursor + Dawson Does Framework into an autonomous development studio.

---

## Overview

This playbook covers integration with:

| Tool | Purpose | Setup Effort |
|------|---------|--------------|
| **Keyboard Maestro** | High-level workflow macros | 30 min |
| **Hammerspoon** | Lua-based Mac automation | 1 hour |
| **BetterTouchTool** | Gestures & Stream Deck | 20 min |
| **GitHub Actions** | CI/CD automation | 30 min |
| **n8n/Zapier** | External event triggers | 1 hour |

---

## Table of Contents

1. [Quick Setup](#quick-setup)
2. [Daily Dev Macro](#daily-dev-macro)
3. [Quick Export Palette](#quick-export-palette)
4. [Context Injection Pipeline](#context-injection-pipeline)
5. [Agent Memory Sync](#agent-memory-sync)
6. [Autonomous Test-Fix Loop](#autonomous-test-fix-loop)
7. [Self-Documenting Codebase](#self-documenting-codebase)
8. [Continuous AI Development](#continuous-ai-development)
9. [Team Sync System](#team-sync-system)
10. [Pro Tips & Advanced Patterns](#pro-tips)

---

## Quick Setup

### Prerequisites

```bash
# Install Homebrew packages
brew install cliclick
brew install --cask hammerspoon
brew install --cask keyboard-maestro  # $36 license required

# Install framework globally
npm install -g @jrdaws/framework

# Verify setup
framework doctor .
```

### Directory Structure

```
~/.config/
├── hammerspoon/
│   └── init.lua              # Hammerspoon config
├── keyboard-maestro/
│   └── macros/               # Exported macros
└── dawson-automation/
    ├── state.json            # Current automation state
    ├── screenshots/          # Auto-captured screenshots
    └── logs/                 # Automation logs
```

---

## Daily Dev Macro

**Goal**: One hotkey to start your day with full context.

### Flow

```
⌘⇧D pressed
    │
    ├─► git pull origin main
    │
    ├─► npm test (background check)
    │
    ├─► Open Cursor
    │
    ├─► Inject AGENT_CONTEXT.md + START_PROMPT.md
    │
    └─► Display test status notification
```

### Shell Script

Create `scripts/automation/daily-dev.sh`:

```bash
#!/bin/bash
# Daily Dev Startup Script
# Usage: ./scripts/automation/daily-dev.sh [role]

set -e

ROLE="${1:-CLI}"
PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"
LOG_FILE="$HOME/.config/dawson-automation/logs/daily-dev-$(date +%Y%m%d).log"

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

log() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

notify() {
    osascript -e "display notification \"$1\" with title \"Daily Dev\""
}

# Step 1: Sync
log "Pulling latest changes..."
cd "$PROJECT_DIR"
git pull origin main 2>&1 | tee -a "$LOG_FILE"

# Step 2: Run tests in background
log "Running tests in background..."
npm test > /tmp/test-results.txt 2>&1 &
TEST_PID=$!

# Step 3: Prepare context
log "Preparing context..."
CONTEXT=$(cat <<EOF
## ✓ Daily Dev Session Started
- Role: $ROLE Agent
- Time: $(date '+%Y-%m-%d %H:%M')
- Branch: $(git branch --show-current)
- Last commit: $(git log -1 --oneline)

---

$(cat AGENT_CONTEXT.md 2>/dev/null || echo "No AGENT_CONTEXT.md found")

---

$(cat START_PROMPT.md 2>/dev/null || echo "No START_PROMPT.md found")
EOF
)

# Copy context to clipboard
echo "$CONTEXT" | pbcopy
log "Context copied to clipboard ($(echo "$CONTEXT" | wc -l) lines)"

# Step 4: Open Cursor
log "Opening Cursor..."
cursor "$PROJECT_DIR"

# Step 5: Wait for tests and notify
wait $TEST_PID
TEST_EXIT=$?

if [ $TEST_EXIT -eq 0 ]; then
    TEST_COUNT=$(grep -o "pass [0-9]*" /tmp/test-results.txt | tail -1 || echo "unknown")
    notify "✅ Tests passed ($TEST_COUNT)"
    log "Tests passed"
else
    FAIL_COUNT=$(grep -o "fail [0-9]*" /tmp/test-results.txt | tail -1 || echo "unknown")
    notify "❌ Tests failed ($FAIL_COUNT)"
    log "Tests failed - check /tmp/test-results.txt"
fi

log "Daily dev startup complete!"
echo ""
echo "📋 Context is in your clipboard - paste into Cursor chat with ⌘V"
```

### Keyboard Maestro Macro

Export and import `scripts/automation/keyboard-maestro/daily-dev.kmmacros`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN">
<plist version="1.0">
<dict>
    <key>Name</key>
    <string>Daily Dev Startup</string>
    <key>Trigger</key>
    <string>⌘⇧D</string>
    <key>Actions</key>
    <array>
        <dict>
            <key>Type</key>
            <string>ExecuteShellScript</string>
            <key>Script</key>
            <string>~/Documents/dawson-does-framework/scripts/automation/daily-dev.sh CLI</string>
        </dict>
        <dict>
            <key>Type</key>
            <string>Pause</string>
            <key>Duration</key>
            <string>2</string>
        </dict>
        <dict>
            <key>Type</key>
            <string>TypeKeystroke</string>
            <key>Keystroke</key>
            <string>⌘L</string>
            <key>Comment</key>
            <string>Open Cursor Composer</string>
        </dict>
        <dict>
            <key>Type</key>
            <string>Pause</string>
            <key>Duration</key>
            <string>0.5</string>
        </dict>
        <dict>
            <key>Type</key>
            <string>TypeKeystroke</string>
            <key>Keystroke</key>
            <string>⌘V</string>
            <key>Comment</key>
            <string>Paste context</string>
        </dict>
    </array>
</dict>
</plist>
```

---

## Quick Export Palette

**Goal**: Hotkey triggers a selection palette for rapid project generation.

### Shell Script

Create `scripts/automation/quick-export.sh`:

```bash
#!/bin/bash
# Quick Export with Template/Integration Selection
# Requires: fzf (brew install fzf)

set -e

PROJECT_DIR="${1:-$(pwd)}"
cd "$PROJECT_DIR"

# Template selection
TEMPLATE=$(echo -e "saas\ndashboard\nblog\nlanding-page\nseo-directory\nflagship-saas" | \
    fzf --prompt="Select template: " --height=10)

if [ -z "$TEMPLATE" ]; then
    echo "No template selected"
    exit 1
fi

# Project name
read -p "Project name (e.g., my-app): " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then
    PROJECT_NAME="my-$TEMPLATE-app"
fi

# Integration selection (multi-select)
INTEGRATIONS=$(echo -e "auth:supabase\nauth:clerk\npayments:stripe\npayments:paddle\nemail:resend\nemail:sendgrid\nai:anthropic\nai:openai\nanalytics:posthog\nanalytics:plausible\nstorage:supabase\nstorage:s3" | \
    fzf --multi --prompt="Select integrations (TAB to multi-select): " --height=15)

# Build command
CMD="framework export $TEMPLATE ./$PROJECT_NAME"

while IFS= read -r integration; do
    if [ -n "$integration" ]; then
        TYPE=$(echo "$integration" | cut -d: -f1)
        PROVIDER=$(echo "$integration" | cut -d: -f2)
        CMD="$CMD --$TYPE $PROVIDER"
    fi
done <<< "$INTEGRATIONS"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Command to run:"
echo "$CMD"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Execute? [Y/n]: " CONFIRM
if [ "$CONFIRM" != "n" ] && [ "$CONFIRM" != "N" ]; then
    eval "$CMD"
    
    echo ""
    echo "✅ Project created! Next steps:"
    echo "   cd $PROJECT_NAME"
    echo "   npm install"
    echo "   npm run dev"
fi
```

### Keyboard Maestro Integration

Trigger: `⌘⇧E`

```
1. Open Terminal (or iTerm)
2. Execute: ~/Documents/dawson-does-framework/scripts/automation/quick-export.sh
```

---

## Context Injection Pipeline

**Goal**: Automatically inject full project context into Cursor chat sessions.

### The Problem

When starting a new Cursor chat, Claude doesn't know:
- Project structure
- Coding standards
- Current agent role
- Recent changes
- Test status

### The Solution: Multi-Layer Context

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTEXT LAYERS                            │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Static Context (rarely changes)                   │
│  ├── AGENT_CONTEXT.md - Philosophy, standards               │
│  ├── FRAMEWORK_MAP.md - Architecture overview               │
│  └── .cursorrules - AI behavior rules                       │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Session Context (per-session)                     │
│  ├── Current role (CLI/WEB/DOC/etc.)                        │
│  ├── Active task from inbox                                 │
│  └── Memory file for role                                   │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Dynamic Context (real-time)                       │
│  ├── git status                                             │
│  ├── Last test results                                      │
│  ├── Recent commits                                         │
│  └── Active agents (lock status)                            │
└─────────────────────────────────────────────────────────────┘
```

### Implementation

Create `scripts/automation/context-pipeline.sh`:

```bash
#!/bin/bash
# Context Injection Pipeline
# Generates layered context for Cursor injection

ROLE="${1:-CLI}"
PROJECT_DIR="${2:-$(pwd)}"
OUTPUT_FORMAT="${3:-clipboard}"  # clipboard, file, stdout

cd "$PROJECT_DIR"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Layer 1: Static Context
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STATIC_CONTEXT=$(cat <<'STATIC'
## ✓ Governance Acknowledgment
- I have read AGENT_CONTEXT.md and understand the export-first philosophy
- I understand: Fenced Output Integrity (one block, no splits)
- I will NOT: delete protected files, create branches, skip sync
STATIC
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Layer 2: Session Context
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Get active task
ACTIVE_TASK=""
INBOX_DIR="output/${ROLE,,}-agent/inbox"
if [ -d "$INBOX_DIR" ]; then
    ACTIVE_TASK=$(ls -1 "$INBOX_DIR"/*.txt 2>/dev/null | head -1)
    if [ -n "$ACTIVE_TASK" ]; then
        ACTIVE_TASK="**Active Task**: $(basename "$ACTIVE_TASK")

$(head -20 "$ACTIVE_TASK")"
    fi
fi

# Get memory highlights
MEMORY_FILE="prompts/agents/memory/${ROLE}_MEMORY.md"
MEMORY_CONTEXT=""
if [ -f "$MEMORY_FILE" ]; then
    # Get last session entry
    MEMORY_CONTEXT=$(awk '/^## Session:/{p=1} p; /^---$/ && p{exit}' "$MEMORY_FILE" | head -30)
fi

SESSION_CONTEXT=$(cat <<SESSION
## Session Context

**Role**: $ROLE Agent
**Time**: $(date '+%Y-%m-%d %H:%M:%S')
**Tab**: \`$ROLE $(date '+%H:%M')\`

$ACTIVE_TASK

### Recent Memory
$MEMORY_CONTEXT
SESSION
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Layer 3: Dynamic Context
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Git status
GIT_STATUS=$(git status --short 2>/dev/null | head -10)
GIT_BRANCH=$(git branch --show-current 2>/dev/null)
GIT_LAST_COMMIT=$(git log -1 --oneline 2>/dev/null)

# Test status (if recent)
TEST_STATUS="Unknown"
if [ -f "/tmp/test-results.txt" ]; then
    if grep -q "fail 0" /tmp/test-results.txt; then
        TEST_COUNT=$(grep -o "pass [0-9]*" /tmp/test-results.txt | tail -1)
        TEST_STATUS="✅ All tests passing ($TEST_COUNT)"
    else
        FAIL_COUNT=$(grep -o "fail [0-9]*" /tmp/test-results.txt | tail -1)
        TEST_STATUS="❌ Tests failing ($FAIL_COUNT)"
    fi
fi

# Lock status
LOCK_STATUS="No locks"
if [ -f ".agent-lock" ]; then
    LOCK_STATUS="🔒 Locked by: $(cat .agent-lock)"
fi

DYNAMIC_CONTEXT=$(cat <<DYNAMIC
## Current State

| Metric | Value |
|--------|-------|
| Branch | \`$GIT_BRANCH\` |
| Last Commit | \`$GIT_LAST_COMMIT\` |
| Tests | $TEST_STATUS |
| Lock | $LOCK_STATUS |

### Uncommitted Changes
\`\`\`
$GIT_STATUS
\`\`\`
DYNAMIC
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Combine and Output
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FULL_CONTEXT=$(cat <<FULL
$STATIC_CONTEXT

---

$SESSION_CONTEXT

---

$DYNAMIC_CONTEXT

---

**Ready to work. What's the task?**

($ROLE Agent)
FULL
)

case "$OUTPUT_FORMAT" in
    clipboard)
        echo "$FULL_CONTEXT" | pbcopy
        echo "✅ Context copied to clipboard ($(echo "$FULL_CONTEXT" | wc -l) lines)"
        ;;
    file)
        echo "$FULL_CONTEXT" > /tmp/cursor-context.md
        echo "✅ Context written to /tmp/cursor-context.md"
        ;;
    stdout)
        echo "$FULL_CONTEXT"
        ;;
esac
```

### Hammerspoon Auto-Injection

Add to `~/.hammerspoon/init.lua`:

```lua
-- Auto-inject context when Cursor gains focus with new chat
local lastCursorWindow = nil

hs.application.watcher.new(function(appName, eventType, app)
    if appName == "Cursor" and eventType == hs.application.watcher.activated then
        -- Check if this is a new window
        local win = app:focusedWindow()
        if win and win:id() ~= lastCursorWindow then
            lastCursorWindow = win:id()
            -- Could auto-inject context here
            hs.notify.show("Cursor", "Context Ready", "Press ⌘⇧C to inject context")
        end
    end
end):start()

-- Hotkey to inject context
hs.hotkey.bind({"cmd", "shift"}, "C", function()
    local role = os.getenv("AGENT_ROLE") or "CLI"
    hs.execute("~/Documents/dawson-does-framework/scripts/automation/context-pipeline.sh " .. role)
    hs.timer.doAfter(0.5, function()
        hs.eventtap.keyStroke({"cmd"}, "l")  -- Open composer
        hs.timer.doAfter(0.3, function()
            hs.eventtap.keyStroke({"cmd"}, "v")  -- Paste
        end)
    end)
end)
```

---

## Agent Memory Sync

**Goal**: Keep agent memories synchronized across multiple Cursor windows.

### The Problem

When running multiple agents (CLI, WEB, DOC), they each update their memory files. Other agents don't see these updates in real-time.

### The Solution: File Watcher + Notifications

### Hammerspoon Implementation

Add to `~/.hammerspoon/init.lua`:

```lua
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Agent Memory Sync System
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

local projectPath = os.getenv("HOME") .. "/Documents/dawson-does-framework"
local memoryPath = projectPath .. "/prompts/agents/memory"

-- Track memory file states
local memoryStates = {}

-- Watch for memory file changes
local memoryWatcher = hs.pathwatcher.new(memoryPath, function(paths, flags)
    for i, path in ipairs(paths) do
        local filename = path:match("([^/]+)$")
        if filename and filename:match("_MEMORY%.md$") then
            local role = filename:gsub("_MEMORY%.md$", "")
            
            -- Get file modification time
            local attrs = hs.fs.attributes(path)
            local mtime = attrs and attrs.modification
            
            -- Only notify if actually changed
            if mtime and mtime ~= memoryStates[filename] then
                memoryStates[filename] = mtime
                
                -- Parse last session
                local file = io.open(path, "r")
                if file then
                    local content = file:read("*all")
                    file:close()
                    
                    -- Extract last session title
                    local lastSession = content:match("## Session: ([^\n]+)")
                    
                    -- Notify other agents
                    hs.notify.new({
                        title = "Agent Memory Updated",
                        subTitle = role .. " Agent",
                        informativeText = "Last session: " .. (lastSession or "Unknown"),
                        withdrawAfter = 10
                    }):send()
                    
                    -- Log the sync event
                    local logFile = io.open(os.getenv("HOME") .. "/.config/dawson-automation/logs/memory-sync.log", "a")
                    if logFile then
                        logFile:write(os.date("%Y-%m-%d %H:%M:%S") .. " - " .. role .. " memory updated\n")
                        logFile:close()
                    end
                end
            end
        end
    end
end)

memoryWatcher:start()
print("✅ Agent Memory Sync active - watching: " .. memoryPath)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Memory Dashboard (optional floating window)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

local function showMemoryDashboard()
    local roles = {"CLI", "WEB", "DOC", "TST", "TPL"}
    local status = {}
    
    for _, role in ipairs(roles) do
        local memFile = memoryPath .. "/" .. role .. "_MEMORY.md"
        local attrs = hs.fs.attributes(memFile)
        if attrs then
            local mtime = os.date("%H:%M", attrs.modification)
            status[role] = "✅ " .. mtime
        else
            status[role] = "⚪ No memory"
        end
    end
    
    local text = "Agent Memory Status:\n"
    for role, stat in pairs(status) do
        text = text .. role .. ": " .. stat .. "\n"
    end
    
    hs.alert.show(text, 5)
end

-- Hotkey to show memory dashboard
hs.hotkey.bind({"cmd", "shift"}, "M", showMemoryDashboard)
```

### Shell Script for Manual Sync

Create `scripts/automation/memory-sync.sh`:

```bash
#!/bin/bash
# Manual memory sync - aggregates all agent memories

PROJECT_DIR="${1:-$(pwd)}"
MEMORY_DIR="$PROJECT_DIR/prompts/agents/memory"
OUTPUT_FILE="/tmp/agent-memories-combined.md"

echo "# Combined Agent Memories" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "Generated: $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for memory_file in "$MEMORY_DIR"/*_MEMORY.md; do
    if [ -f "$memory_file" ]; then
        ROLE=$(basename "$memory_file" | sed 's/_MEMORY\.md//')
        echo "---" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "## $ROLE Agent" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        # Get last 2 sessions
        awk '/^## Session:/{count++} count<=2' "$memory_file" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
done

echo "✅ Combined memories written to: $OUTPUT_FILE"
echo "   Roles found: $(ls "$MEMORY_DIR"/*_MEMORY.md 2>/dev/null | wc -l | tr -d ' ')"

# Copy to clipboard
cat "$OUTPUT_FILE" | pbcopy
echo "   (Also copied to clipboard)"
```

---

## Autonomous Test-Fix Loop

**Goal**: Automatically fix failing tests without human intervention.

### The Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  AUTONOMOUS TEST-FIX LOOP                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│    ┌──────────┐                                             │
│    │ Run Tests│◄────────────────────────────┐               │
│    └────┬─────┘                             │               │
│         │                                    │               │
│         ▼                                    │               │
│    ┌──────────┐    Yes    ┌──────────┐      │               │
│    │ Passing? ├──────────►│  Done!   │      │               │
│    └────┬─────┘           └──────────┘      │               │
│         │ No                                 │               │
│         ▼                                    │               │
│    ┌──────────────┐                         │               │
│    │ Extract Error│                         │               │
│    └──────┬───────┘                         │               │
│           │                                  │               │
│           ▼                                  │               │
│    ┌──────────────┐                         │               │
│    │ Inject into  │                         │               │
│    │ Cursor Chat  │                         │               │
│    └──────┬───────┘                         │               │
│           │                                  │               │
│           ▼                                  │               │
│    ┌──────────────┐                         │               │
│    │ Wait for Fix │                         │               │
│    └──────┬───────┘                         │               │
│           │                                  │               │
│           ▼                                  │               │
│    ┌──────────────┐                         │               │
│    │ Accept       │                         │               │
│    │ Changes      ├─────────────────────────┘               │
│    └──────────────┘                                         │
│                                                              │
│    Max iterations: 5                                        │
│    Timeout per fix: 2 minutes                               │
└─────────────────────────────────────────────────────────────┘
```

### Implementation

Create `scripts/automation/test-fix-loop.sh`:

```bash
#!/bin/bash
# Autonomous Test-Fix Loop
# Runs tests, extracts errors, injects into Cursor for fixing

set -e

PROJECT_DIR="${1:-$(pwd)}"
MAX_ITERATIONS="${2:-5}"
FIX_TIMEOUT="${3:-120}"  # seconds

cd "$PROJECT_DIR"

LOG_FILE="$HOME/.config/dawson-automation/logs/test-fix-$(date +%Y%m%d-%H%M%S).log"
mkdir -p "$(dirname "$LOG_FILE")"

log() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

notify() {
    osascript -e "display notification \"$1\" with title \"Test-Fix Loop\""
}

extract_error() {
    # Extract the first failing test's error message
    grep -A 20 "✖\|FAIL\|Error:" /tmp/test-output.txt | head -30
}

inject_into_cursor() {
    local error_msg="$1"
    
    # Build the fix prompt
    local prompt="Fix this failing test:

\`\`\`
$error_msg
\`\`\`

Apply the minimal fix needed. Don't refactor unrelated code."

    # Copy to clipboard
    echo "$prompt" | pbcopy
    
    # Focus Cursor and paste
    osascript -e 'tell application "Cursor" to activate'
    sleep 0.5
    
    # Open composer and paste
    cliclick kp:cmd+l
    sleep 0.3
    cliclick kp:cmd+v
    sleep 0.3
    cliclick kp:return  # Send
}

wait_for_fix() {
    local timeout=$1
    local start_time=$(date +%s)
    
    log "Waiting for fix (timeout: ${timeout}s)..."
    
    while true; do
        local current_time=$(date +%s)
        local elapsed=$((current_time - start_time))
        
        if [ $elapsed -ge $timeout ]; then
            log "Timeout waiting for fix"
            return 1
        fi
        
        # Check if Cursor is still processing
        # This is a heuristic - look for the composer to close
        sleep 5
        
        # For now, just wait a reasonable time
        if [ $elapsed -ge 30 ]; then
            log "Assuming fix is ready after 30s"
            return 0
        fi
    done
}

accept_changes() {
    log "Accepting changes..."
    osascript -e 'tell application "Cursor" to activate'
    sleep 0.3
    # Accept all in composer (adjust based on your Cursor setup)
    cliclick kp:cmd+return
    sleep 1
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Main Loop
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

log "Starting Autonomous Test-Fix Loop"
log "Project: $PROJECT_DIR"
log "Max iterations: $MAX_ITERATIONS"

for i in $(seq 1 $MAX_ITERATIONS); do
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "Iteration $i/$MAX_ITERATIONS"
    
    # Run tests
    log "Running tests..."
    npm test > /tmp/test-output.txt 2>&1 || true
    
    # Check if passing
    if grep -q "fail 0" /tmp/test-output.txt; then
        TEST_COUNT=$(grep -o "pass [0-9]*" /tmp/test-output.txt | tail -1)
        log "✅ All tests passing! ($TEST_COUNT)"
        notify "All tests passing after $i iteration(s)"
        exit 0
    fi
    
    # Extract error
    ERROR_MSG=$(extract_error)
    log "Found failing test:"
    echo "$ERROR_MSG" | head -10 >> "$LOG_FILE"
    
    # Inject into Cursor
    log "Injecting error into Cursor..."
    inject_into_cursor "$ERROR_MSG"
    
    # Wait for fix
    wait_for_fix "$FIX_TIMEOUT"
    
    # Accept changes
    accept_changes
    
    log "Iteration $i complete, running tests again..."
    sleep 2
done

log "❌ Max iterations reached, tests still failing"
notify "Test-Fix Loop: Max iterations reached"
exit 1
```

### Keyboard Maestro Trigger

Hotkey: `⌘⇧T` (T for Test-Fix)

---

## Self-Documenting Codebase

**Goal**: Automatically update documentation when code changes significantly.

### Hammerspoon File Watcher

Add to `~/.hammerspoon/init.lua`:

```lua
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Self-Documenting Codebase
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

local projectPath = os.getenv("HOME") .. "/Documents/dawson-does-framework"
local watchPaths = {
    projectPath .. "/src",
    projectPath .. "/bin",
    projectPath .. "/website/app",
    projectPath .. "/templates"
}

local changeBuffer = {}
local bufferTimeout = nil
local SIGNIFICANT_CHANGES_THRESHOLD = 5

local function triggerDocUpdate()
    if #changeBuffer < SIGNIFICANT_CHANGES_THRESHOLD then
        changeBuffer = {}
        return
    end
    
    local changedFiles = table.concat(changeBuffer, "\n")
    changeBuffer = {}
    
    -- Create task for DOC agent
    local taskContent = string.format([[
================================================================================
TASK ASSIGNMENT: Auto-Documentation Update
================================================================================
Priority: P3 (LOW)
Target Agent: Documentation Agent
Created By: Hammerspoon (Self-Documenting System)
Date: %s

## Task Description

Significant code changes detected. Review and update relevant documentation.

## Files Changed

%s

## Suggested Actions

1. Check if any API signatures changed → update docs/api/
2. Check if CLI behavior changed → update docs/cli/
3. Check if new patterns introduced → update docs/patterns/
4. Update FRAMEWORK_MAP.md if structure changed

## Success Criteria

- [ ] Affected documentation updated
- [ ] No broken examples
- [ ] CHANGELOG updated if user-facing

================================================================================
END OF TASK
================================================================================
]], os.date("%Y-%m-%d %H:%M"), changedFiles)

    local taskFile = projectPath .. "/output/documentation-agent/inbox/auto-doc-" .. os.date("%Y%m%d-%H%M%S") .. ".txt"
    local file = io.open(taskFile, "w")
    if file then
        file:write(taskContent)
        file:close()
        hs.notify.show("Self-Doc", "Task Created", #changeBuffer .. " files changed")
    end
end

local function onFileChange(paths, flags)
    for _, path in ipairs(paths) do
        -- Filter to significant files
        if path:match("%.ts$") or path:match("%.tsx$") or path:match("%.mjs$") or path:match("%.js$") then
            table.insert(changeBuffer, path)
        end
    end
    
    -- Reset the buffer timeout
    if bufferTimeout then
        bufferTimeout:stop()
    end
    
    -- Wait 30 seconds for more changes before triggering
    bufferTimeout = hs.timer.doAfter(30, triggerDocUpdate)
end

-- Start watchers
local watchers = {}
for _, path in ipairs(watchPaths) do
    if hs.fs.attributes(path) then
        table.insert(watchers, hs.pathwatcher.new(path, onFileChange):start())
        print("✅ Watching: " .. path)
    end
end

print("✅ Self-Documenting System active")
```

### GitHub Action for Doc Checks

Create `.github/workflows/doc-sync.yml`:

```yaml
name: Documentation Sync Check

on:
  push:
    paths:
      - 'src/**'
      - 'bin/**'
      - 'website/app/**'
    branches: [main]

jobs:
  check-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check for doc updates needed
        run: |
          # Get changed files
          CHANGED=$(git diff --name-only HEAD~1)
          
          # Check if docs were updated with code
          if echo "$CHANGED" | grep -q "^src/\|^bin/"; then
            if ! echo "$CHANGED" | grep -q "^docs/"; then
              echo "⚠️ Code changed but no docs updated"
              echo "Consider updating documentation for:"
              echo "$CHANGED" | grep "^src/\|^bin/"
            fi
          fi
      
      - name: Create doc task issue
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Documentation may need update',
              body: 'Code changed in recent commit but docs were not updated.',
              labels: ['documentation', 'auto-generated']
            })
```

---

## Continuous AI Development

**Goal**: GitHub Issues trigger autonomous development cycles.

### GitHub Action

Create `.github/workflows/ai-development.yml`:

```yaml
name: AI Development

on:
  issues:
    types: [labeled]

jobs:
  generate-from-issue:
    if: contains(github.event.label.name, 'ai-generate')
    runs-on: macos-latest  # Needed for Cursor
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install framework
        run: npm install -g @jrdaws/framework
      
      - name: Parse issue for project spec
        id: parse
        uses: actions/github-script@v7
        with:
          script: |
            const body = context.payload.issue.body;
            
            // Extract template (look for "template: xxx" or default to saas)
            const templateMatch = body.match(/template:\s*(\w+)/i);
            const template = templateMatch ? templateMatch[1] : 'saas';
            
            // Extract project name
            const nameMatch = body.match(/project:\s*([^\n]+)/i);
            const projectName = nameMatch ? nameMatch[1].trim().toLowerCase().replace(/\s+/g, '-') : 
                                `issue-${context.payload.issue.number}`;
            
            // Extract integrations
            const integrationsMatch = body.match(/integrations:\s*([^\n]+)/i);
            const integrations = integrationsMatch ? integrationsMatch[1].trim() : '';
            
            return { template, projectName, integrations };
      
      - name: Generate project
        run: |
          TEMPLATE="${{ fromJson(steps.parse.outputs.result).template }}"
          NAME="${{ fromJson(steps.parse.outputs.result).projectName }}"
          
          framework export $TEMPLATE ./$NAME --cursor
          
          # Create summary
          echo "## Generated Project" > $NAME/GENERATION_SUMMARY.md
          echo "" >> $NAME/GENERATION_SUMMARY.md
          echo "- Template: $TEMPLATE" >> $NAME/GENERATION_SUMMARY.md
          echo "- Issue: #${{ github.event.issue.number }}" >> $NAME/GENERATION_SUMMARY.md
          echo "- Generated: $(date)" >> $NAME/GENERATION_SUMMARY.md
      
      - name: Create PR
        uses: peter-evans/create-pull-request@v5
        with:
          title: "feat: Generate project from #${{ github.event.issue.number }}"
          body: |
            Auto-generated from issue #${{ github.event.issue.number }}
            
            ## What was generated
            - Template: ${{ fromJson(steps.parse.outputs.result).template }}
            - Project: ${{ fromJson(steps.parse.outputs.result).projectName }}
            
            ## Next steps
            1. Review the generated code
            2. Run tests locally
            3. Customize as needed
          branch: "ai-gen/issue-${{ github.event.issue.number }}"
          labels: "ai-generated,needs-review"
      
      - name: Comment on issue
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.payload.issue.number,
              body: '🤖 Project generated! See PR for review.'
            })
```

### Issue Template

Create `.github/ISSUE_TEMPLATE/ai-generate.yml`:

```yaml
name: AI Project Generation
description: Request AI to generate a project
title: "[Generate] "
labels: ["ai-generate"]
body:
  - type: input
    id: project
    attributes:
      label: Project Name
      description: Name for the generated project
      placeholder: my-awesome-app
    validations:
      required: true

  - type: dropdown
    id: template
    attributes:
      label: Template
      options:
        - saas
        - dashboard
        - blog
        - landing-page
        - seo-directory
    validations:
      required: true

  - type: input
    id: integrations
    attributes:
      label: Integrations
      description: Comma-separated list
      placeholder: auth:supabase, payments:stripe, email:resend

  - type: textarea
    id: description
    attributes:
      label: Project Description
      description: Describe what you want to build
      placeholder: |
        I want to build a project management tool with:
        - User authentication
        - Task boards
        - Team collaboration
```

---

## Team Sync System

**Goal**: n8n monitors Slack and routes tasks to agents.

### n8n Workflow JSON

Save as `scripts/automation/n8n/team-sync.json`:

```json
{
  "name": "Team Sync System",
  "nodes": [
    {
      "name": "Slack Trigger",
      "type": "n8n-nodes-base.slackTrigger",
      "parameters": {
        "channel": "dev-tasks",
        "events": ["message"]
      }
    },
    {
      "name": "Parse Task",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const text = $input.item.json.text;\n\n// Parse task format: @agent ROLE: task description\nconst match = text.match(/@agent\\s+(\\w+):\\s*(.+)/i);\n\nif (match) {\n  return {\n    role: match[1].toUpperCase(),\n    task: match[2],\n    user: $input.item.json.user,\n    timestamp: new Date().toISOString()\n  };\n}\n\nreturn null;"
      }
    },
    {
      "name": "Create Task File",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "https://api.github.com/repos/YOUR/REPO/contents/output/{{ $json.role.toLowerCase() }}-agent/inbox/slack-{{ $now.format('yyyyMMdd-HHmmss') }}.txt",
        "authentication": "genericCredentialType",
        "body": "base64 encoded task content"
      }
    },
    {
      "name": "Notify Slack",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "dev-tasks",
        "text": "✅ Task routed to {{ $json.role }} Agent"
      }
    }
  ]
}
```

### Daily Summary Workflow

```json
{
  "name": "Daily Agent Summary",
  "nodes": [
    {
      "name": "Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": { "cronExpression": "0 18 * * *" }
      }
    },
    {
      "name": "Fetch Agent Memories",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.github.com/repos/YOUR/REPO/contents/prompts/agents/memory"
      }
    },
    {
      "name": "Aggregate Progress",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Parse all memory files and extract today's work\nconst today = new Date().toISOString().split('T')[0];\nconst summary = [];\n\nfor (const file of $input.all()) {\n  const content = Buffer.from(file.json.content, 'base64').toString();\n  // Extract today's session\n  const match = content.match(new RegExp(`## Session: ${today}[\\\\s\\\\S]*?(?=## Session:|$)`));\n  if (match) {\n    summary.push({\n      role: file.json.name.replace('_MEMORY.md', ''),\n      work: match[0]\n    });\n  }\n}\n\nreturn summary;"
      }
    },
    {
      "name": "Post to Slack",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "dev-updates",
        "text": "📊 Daily Agent Summary\n\n{{ $json.summary }}"
      }
    }
  ]
}
```

---

## Pro Tips

### 1. Auto-Screenshot Every 15 Minutes

Create `scripts/automation/auto-screenshot.sh`:

```bash
#!/bin/bash
# Run in background: nohup ./auto-screenshot.sh &

SCREENSHOT_DIR="$HOME/.config/dawson-automation/screenshots"
INTERVAL=900  # 15 minutes

mkdir -p "$SCREENSHOT_DIR"

while true; do
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    FILENAME="$SCREENSHOT_DIR/work-$TIMESTAMP.png"
    
    # Capture screen
    screencapture -x "$FILENAME"
    
    # Keep only last 24 hours (96 screenshots)
    ls -t "$SCREENSHOT_DIR"/work-*.png | tail -n +97 | xargs rm -f 2>/dev/null
    
    echo "Screenshot saved: $FILENAME"
    sleep $INTERVAL
done
```

### 2. Unattended Overnight Generation

```bash
#!/bin/bash
# scripts/automation/overnight-generation.sh
# Run at night to process queued generation requests

LOG="$HOME/.config/dawson-automation/logs/overnight-$(date +%Y%m%d).log"

echo "Starting overnight generation at $(date)" >> "$LOG"

# Process all pending tasks
for task in output/*/inbox/*.txt; do
    if [ -f "$task" ]; then
        echo "Processing: $task" >> "$LOG"
        # Extract role from path
        ROLE=$(echo "$task" | grep -oP '\w+(?=-agent)')
        
        # Run the daily-dev script for this role
        ./scripts/automation/daily-dev.sh "$ROLE" >> "$LOG" 2>&1
        
        # Move to processing
        mv "$task" "$(dirname "$task")/../processing/"
        
        # Give Cursor time to work
        sleep 300  # 5 minutes per task
    fi
done

echo "Overnight generation complete at $(date)" >> "$LOG"
```

### 3. Stream Deck Button Colors

Create `scripts/automation/test-status-button.sh`:

```bash
#!/bin/bash
# Returns status for Stream Deck button coloring

if npm test --silent > /dev/null 2>&1; then
    echo '{"state": "success", "color": "#00ff00"}'
else
    echo '{"state": "failure", "color": "#ff0000"}'
fi
```

### 4. Touch Bar Test Status (BetterTouchTool)

Widget script:
```bash
#!/bin/bash
if [ -f /tmp/test-results.txt ]; then
    if grep -q "fail 0" /tmp/test-results.txt; then
        echo "✅ Tests OK"
    else
        FAILS=$(grep -o "fail [0-9]*" /tmp/test-results.txt | tail -1)
        echo "❌ $FAILS"
    fi
else
    echo "⚪ No tests"
fi
```

---

## Complete Hammerspoon Config

Save as `~/.hammerspoon/init.lua`:

```lua
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Dawson Does Framework - Hammerspoon Automation
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

local projectPath = os.getenv("HOME") .. "/Documents/dawson-does-framework"

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 1. Window Management for Multi-Agent
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Auto-tile Cursor windows
hs.hotkey.bind({"cmd", "shift"}, "G", function()
    local wins = hs.window.filter.new("Cursor"):getWindows()
    local screen = hs.screen.mainScreen()
    local frame = screen:frame()
    
    local layouts = {
        [1] = {{x=0, y=0, w=1, h=1}},
        [2] = {{x=0, y=0, w=0.5, h=1}, {x=0.5, y=0, w=0.5, h=1}},
        [3] = {{x=0, y=0, w=0.5, h=0.5}, {x=0.5, y=0, w=0.5, h=0.5}, {x=0, y=0.5, w=1, h=0.5}},
        [4] = {{x=0, y=0, w=0.5, h=0.5}, {x=0.5, y=0, w=0.5, h=0.5}, 
               {x=0, y=0.5, w=0.5, h=0.5}, {x=0.5, y=0.5, w=0.5, h=0.5}}
    }
    
    local layout = layouts[math.min(#wins, 4)] or layouts[4]
    
    for i, win in ipairs(wins) do
        if layout[i] then
            local l = layout[i]
            win:setFrame({
                x = frame.x + (frame.w * l.x),
                y = frame.y + (frame.h * l.y),
                w = frame.w * l.w,
                h = frame.h * l.h
            })
        end
    end
    
    hs.alert.show("Tiled " .. #wins .. " Cursor windows")
end)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 2. Context Injection
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

hs.hotkey.bind({"cmd", "shift"}, "C", function()
    local role = os.getenv("AGENT_ROLE") or "CLI"
    hs.execute(projectPath .. "/scripts/automation/context-pipeline.sh " .. role)
    
    hs.timer.doAfter(0.5, function()
        hs.eventtap.keyStroke({"cmd"}, "l")  -- Open composer
        hs.timer.doAfter(0.3, function()
            hs.eventtap.keyStroke({"cmd"}, "v")  -- Paste
        end)
    end)
    
    hs.alert.show("Context injected for " .. role .. " Agent")
end)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 3. Agent Memory Sync
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

local memoryPath = projectPath .. "/prompts/agents/memory"
local memoryStates = {}

local memoryWatcher = hs.pathwatcher.new(memoryPath, function(paths)
    for _, path in ipairs(paths) do
        local filename = path:match("([^/]+)$")
        if filename and filename:match("_MEMORY%.md$") then
            local role = filename:gsub("_MEMORY%.md$", "")
            local attrs = hs.fs.attributes(path)
            local mtime = attrs and attrs.modification
            
            if mtime and mtime ~= memoryStates[filename] then
                memoryStates[filename] = mtime
                hs.notify.new({
                    title = "Memory Updated",
                    subTitle = role .. " Agent",
                    withdrawAfter = 5
                }):send()
            end
        end
    end
end)
memoryWatcher:start()

-- Show memory dashboard
hs.hotkey.bind({"cmd", "shift"}, "M", function()
    local roles = {"CLI", "WEB", "DOC", "TST", "TPL"}
    local text = "Agent Memory Status:\n"
    
    for _, role in ipairs(roles) do
        local memFile = memoryPath .. "/" .. role .. "_MEMORY.md"
        local attrs = hs.fs.attributes(memFile)
        if attrs then
            text = text .. role .. ": ✅ " .. os.date("%H:%M", attrs.modification) .. "\n"
        else
            text = text .. role .. ": ⚪ None\n"
        end
    end
    
    hs.alert.show(text, 5)
end)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 4. Self-Documenting Watcher
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

local changeBuffer = {}
local bufferTimeout = nil

local function triggerDocUpdate()
    if #changeBuffer < 5 then
        changeBuffer = {}
        return
    end
    
    local taskPath = projectPath .. "/output/documentation-agent/inbox/auto-doc-" .. 
                     os.date("%Y%m%d-%H%M%S") .. ".txt"
    
    local content = string.format([[
================================================================================
TASK ASSIGNMENT: Auto-Documentation Update
================================================================================
Priority: P3 (LOW)
Target Agent: Documentation Agent
Created By: Hammerspoon
Date: %s

## Files Changed (%d files)

%s

## Action Required

Review if documentation needs updating.
================================================================================
]], os.date("%Y-%m-%d %H:%M"), #changeBuffer, table.concat(changeBuffer, "\n"))

    local file = io.open(taskPath, "w")
    if file then
        file:write(content)
        file:close()
        hs.notify.show("Self-Doc", "Task Created", #changeBuffer .. " files changed")
    end
    
    changeBuffer = {}
end

local srcWatcher = hs.pathwatcher.new(projectPath .. "/src", function(paths)
    for _, path in ipairs(paths) do
        if path:match("%.mjs$") or path:match("%.ts$") then
            table.insert(changeBuffer, path:gsub(projectPath .. "/", ""))
        end
    end
    
    if bufferTimeout then bufferTimeout:stop() end
    bufferTimeout = hs.timer.doAfter(30, triggerDocUpdate)
end)
srcWatcher:start()

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- 5. Quick Actions
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Run tests
hs.hotkey.bind({"cmd", "shift"}, "T", function()
    hs.alert.show("Running tests...")
    hs.task.new("/usr/local/bin/npm", function(exitCode, stdOut, stdErr)
        if exitCode == 0 then
            hs.notify.show("Tests", "✅ Passed", "")
        else
            hs.notify.show("Tests", "❌ Failed", "")
        end
    end, {"test"}):setWorkingDirectory(projectPath):start()
end)

-- Quick export
hs.hotkey.bind({"cmd", "shift"}, "E", function()
    hs.execute("open -a Terminal " .. projectPath .. "/scripts/automation/quick-export.sh")
end)

-- Daily dev
hs.hotkey.bind({"cmd", "shift"}, "D", function()
    hs.execute(projectPath .. "/scripts/automation/daily-dev.sh CLI")
    hs.timer.doAfter(3, function()
        hs.application.launchOrFocus("Cursor")
    end)
end)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Startup
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

hs.alert.show("🚀 Dawson Automation Loaded")
print("Dawson Does Framework automation loaded")
print("Hotkeys:")
print("  ⌘⇧D - Daily Dev")
print("  ⌘⇧E - Quick Export")
print("  ⌘⇧T - Run Tests")
print("  ⌘⇧C - Inject Context")
print("  ⌘⇧M - Memory Dashboard")
print("  ⌘⇧G - Grid Cursor Windows")
```

---

## Summary

| Feature | Tool | Hotkey |
|---------|------|--------|
| Daily Dev | Keyboard Maestro + Shell | `⌘⇧D` |
| Quick Export | Shell + fzf | `⌘⇧E` |
| Inject Context | Hammerspoon | `⌘⇧C` |
| Memory Dashboard | Hammerspoon | `⌘⇧M` |
| Run Tests | Hammerspoon | `⌘⇧T` |
| Grid Windows | Hammerspoon | `⌘⇧G` |
| Test-Fix Loop | Shell | Manual |
| Self-Doc | Hammerspoon | Auto |
| Overnight Gen | Shell + cron | Scheduled |

---

*Happy automating! 🤖*

