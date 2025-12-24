# Agent Inbox Watcher System

> **Purpose**: Automatically monitor agent inbox directories for new tasks and notify you via macOS notifications.
> **Status**: Production-ready
> **Last Updated**: 2025-12-23

---

## Overview

The agent inbox watcher system monitors `output/*/inbox/*.txt` files and sends macOS notifications when new agent tasks arrive. This allows you to be instantly notified when work is ready for an agent to process.

### How It Works

1. **Monitors directories**: Watches all `output/{agent-name}-agent/inbox/*.txt` files
2. **Detects new tasks**: Triggers when a new `.txt` file is created
3. **Sends notifications**: Shows macOS notification with agent name and task file
4. **Displays details**: Prints formatted output in terminal with file path

---

## Quick Start

### One-Command Setup

```bash
cd /path/to/dawson-does-framework
./scripts/setup-watch.sh
```

This script will:
1. ✅ Install Homebrew (if needed)
2. ✅ Install fswatch (if needed)
3. ✅ Start the inbox watcher

That's it! The watcher is now running.

---

## Detailed Setup Instructions

### Prerequisites

- **macOS** (for notifications)
- **Bash 3.x+** (included with macOS)
- **Homebrew** (auto-installed by setup script)
- **fswatch** (auto-installed by setup script)

### Manual Installation

If you prefer to install manually:

#### Step 1: Install Homebrew

If Homebrew is not installed:

```bash
# Check if brew exists
which brew

# If not found, install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Or if you have Homebrew downloaded in your Downloads folder:

```bash
sudo mv ~/Downloads/homebrew /opt/homebrew
sudo chown -R $(whoami) /opt/homebrew
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

#### Step 2: Install fswatch

```bash
brew install fswatch
```

#### Step 3: Run the Watcher

```bash
./scripts/watch-inboxes.sh
```

---

## Usage

### Starting the Watcher

**Option A: Full setup (recommended for first time)**
```bash
./scripts/setup-watch.sh
```

**Option B: Direct watcher (if dependencies installed)**
```bash
./scripts/watch-inboxes.sh
```

### Stopping the Watcher

Press **Ctrl+C** in the terminal where the watcher is running.

### Running in Background

To run the watcher in the background:

```bash
nohup ./scripts/watch-inboxes.sh > /tmp/inbox-watcher.log 2>&1 &
```

To stop background watcher:

```bash
# Find the process
ps aux | grep watch-inboxes

# Kill it
kill <PID>
```

---

## Directory Structure

The watcher monitors this directory pattern:

```
output/
├── cli-agent/
│   └── inbox/
│       └── task-001.txt          # ✅ Monitored
├── documentation-agent/
│   └── inbox/
│       └── 20251223-P2-task.txt  # ✅ Monitored
├── template-agent/
│   └── inbox/
│       └── audit-task.txt        # ✅ Monitored
└── platform-agent/
    ├── inbox/
    │   └── new-task.txt          # ✅ Monitored
    ├── outbox/                   # ❌ Not monitored
    └── done/                     # ❌ Not monitored
```

### Agent Directory Naming Convention

- **Format**: `{agent-name}-agent/`
- **Examples**: `cli-agent`, `documentation-agent`, `platform-agent`
- **Inbox**: Must contain an `inbox/` subdirectory
- **Files**: Only `.txt` files are monitored

---

## Creating Agent Tasks

### Task File Format

Create a `.txt` file in any agent's inbox:

```bash
# Example: Create a task for the CLI agent
echo "Task: Update deploy command documentation" > output/agents/cli/inbox/task-001.txt
```

### Task File Naming

**Recommended naming conventions:**

1. **Simple sequential**:
   ```
   task-001.txt
   task-002.txt
   ```

2. **Timestamped**:
   ```
   20251223-0300-task-description.txt
   20251223-1500-urgent-fix.txt
   ```

3. **Priority-based**:
   ```
   20251223-P1-critical-bug.txt
   20251223-P2-feature-request.txt
   ```

### Task File Contents

Use the standard task format from `prompts/agents/HANDOFF_TEMPLATE.md`:

```markdown
# Task: [Title]

**Priority:** P1/P2/P3
**Assigned To:** [Agent Name]
**Created:** YYYY-MM-DD HH:MM

---

## Context

[Background information]

## Task Objectives

1. [Objective 1]
2. [Objective 2]

## Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Files to Create/Modify

- `path/to/file.ts`

## Reference

- See `path/to/reference/file.ts`

## Handoff

When complete:
1. Move this file to `output/{agent}-agent/done/`
2. Create completion report in `output/{agent}-agent/outbox/`

---

*Read and execute this task. Follow governance in AGENT_CONTEXT.md.*
```

---

## What You'll See

### Terminal Output

When a new task is detected:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📬 NEW TASK DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Agent: CLI
File:  task-001.txt

Launch command:
Read and execute the task in /Users/.../output/agents/cli/inbox/task-001.txt
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### macOS Notification

A notification will appear with:
- **Title**: "Dawson-Does Framework"
- **Message**: "New task for CLI Agent"
- **Sound**: Glass notification sound

---

## Listing All Pending Tasks

To see all pending tasks across all agents:

```bash
./scripts/run-agent.sh all
```

Output:
```
═══════════════════════════════════════════════════════════════
  ALL PENDING AGENT TASKS
═══════════════════════════════════════════════════════════════

CLI (2 task(s))
  Read and execute the task in output/agents/cli/inbox/task-001.txt
  Read and execute the task in output/agents/cli/inbox/task-002.txt

DOCUMENTATION (1 task(s))
  Read and execute the task in output/agents/documentation/inbox/api-docs.txt
```

---

## Troubleshooting

### Issue: "fswatch not installed"

**Solution**:
```bash
brew install fswatch
```

### Issue: "Homebrew not found"

**Solution**: Run the full setup script:
```bash
./scripts/setup-watch.sh
```

### Issue: No notifications appearing

**Check macOS notification settings**:
1. Open **System Settings** > **Notifications**
2. Find **Terminal** or **iTerm** (whichever you're using)
3. Ensure notifications are **Enabled**
4. Set alert style to **Banners** or **Alerts**

### Issue: Watcher not detecting files

**Verify directory structure**:
```bash
# Check if output directory exists
ls -la output/

# Verify agent directories follow naming convention
ls -la output/*-agent/inbox/
```

**Test manually**:
```bash
# Create test task
mkdir -p output/test-agent/inbox
echo "Test" > output/test-agent/inbox/test.txt

# Should see notification and terminal output
```

### Issue: "bad substitution" error

This was fixed in the latest version. If you see this error:

```bash
# Pull latest changes
git pull origin main

# Or manually fix watch-inboxes.sh
# Replace ${AGENT^^} with $(echo "$AGENT" | tr '[:lower:]' '[:upper:]')
```

### Issue: Watcher stops unexpectedly

**Check for errors**:
```bash
# If running in background
cat /tmp/inbox-watcher.log

# If running in foreground
# Errors appear in terminal
```

**Restart watcher**:
```bash
./scripts/watch-inboxes.sh
```

---

## Advanced Configuration

### Changing Watch Pattern

Edit `scripts/watch-inboxes.sh`:

```bash
# Current pattern
WATCH_PATTERN="*/inbox/*.txt"

# Watch all files (not recommended)
WATCH_PATTERN="*"

# Watch specific agent only
WATCH_PATTERN="cli-agent/inbox/*.txt"
```

### Customizing Notifications

Edit the `osascript` line in `scripts/watch-inboxes.sh`:

```bash
# Change sound
osascript -e "display notification \"...\" sound name \"Submarine\""

# Add subtitle
osascript -e "display notification \"...\" with title \"...\" subtitle \"Priority: High\""

# Silent notification
osascript -e "display notification \"...\" with title \"...\" sound name \"\""
```

Available sounds: Basso, Blow, Bottle, Frog, Funk, Glass, Hero, Morse, Ping, Pop, Purr, Sosumi, Submarine, Tink

### Running on Startup

To automatically start the watcher when opening terminal:

1. **Add to ~/.zshrc or ~/.bashrc**:
   ```bash
   # Auto-start inbox watcher (optional)
   if [ -d "$HOME/Documents/dawson-does-framework" ]; then
     cd "$HOME/Documents/dawson-does-framework"
     if [ -f "scripts/watch-inboxes.sh" ]; then
       nohup ./scripts/watch-inboxes.sh > /tmp/inbox-watcher.log 2>&1 &
       echo "✓ Inbox watcher started (PID: $!)"
     fi
   fi
   ```

2. **Using launchd (macOS service)**:

   Create `~/Library/LaunchAgents/com.dawson.inbox-watcher.plist`:

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
       <key>Label</key>
       <string>com.dawson.inbox-watcher</string>
       <key>ProgramArguments</key>
       <array>
           <string>/Users/YOUR_USERNAME/Documents/dawson-does-framework/scripts/watch-inboxes.sh</string>
       </array>
       <key>RunAtLoad</key>
       <true/>
       <key>KeepAlive</key>
       <true/>
       <key>StandardOutPath</key>
       <string>/tmp/inbox-watcher.log</string>
       <key>StandardErrorPath</key>
       <string>/tmp/inbox-watcher-error.log</string>
   </dict>
   </plist>
   ```

   Load the service:
   ```bash
   launchctl load ~/Library/LaunchAgents/com.dawson.inbox-watcher.plist
   ```

---

## Integration with Agent Workflow

### Creating Tasks Programmatically

```bash
#!/bin/bash
# create-agent-task.sh

AGENT_NAME="$1"
TASK_TITLE="$2"
PRIORITY="${3:-P2}"

TIMESTAMP=$(date +"%Y%m%d-%H%M")
INBOX="output/${AGENT_NAME}-agent/inbox"
FILENAME="${INBOX}/${TIMESTAMP}-${PRIORITY}-task.txt"

mkdir -p "$INBOX"

cat > "$FILENAME" <<EOF
# Task: ${TASK_TITLE}

**Priority:** ${PRIORITY}
**Assigned To:** ${AGENT_NAME} Agent
**Created:** $(date +"%Y-%m-%d %H:%M")

---

## Context

[Add context here]

## Task Objectives

1. [Objective]

## Success Criteria

- [ ] Complete task

---

*Read and execute this task. Follow governance in AGENT_CONTEXT.md.*
EOF

echo "✓ Created: $FILENAME"
```

Usage:
```bash
./create-agent-task.sh cli "Update deploy docs" P1
```

### Moving Completed Tasks

```bash
# After completing a task
mv output/agents/cli/inbox/task-001.txt output/agents/cli/done/

# Create completion report
echo "Task completed successfully" > output/agents/cli/outbox/task-001-completion.md
```

---

## Scripts Reference

### setup-watch.sh

**Location**: `scripts/setup-watch.sh`

**Purpose**: One-command setup for Homebrew + fswatch + watcher

**Usage**:
```bash
./scripts/setup-watch.sh
```

**What it does**:
1. Checks if Homebrew is installed
2. Installs Homebrew from `/opt/homebrew` or `~/Downloads/homebrew`
3. Adds Homebrew to PATH
4. Installs fswatch via Homebrew
5. Starts watch-inboxes.sh

### watch-inboxes.sh

**Location**: `scripts/watch-inboxes.sh`

**Purpose**: Core watcher that monitors inbox directories

**Usage**:
```bash
./scripts/watch-inboxes.sh
```

**What it does**:
1. Monitors `output/` directory with fswatch
2. Filters for `*/inbox/*.txt` files
3. Extracts agent name from path
4. Sends macOS notification
5. Displays formatted terminal output

### run-agent.sh

**Location**: `scripts/run-agent.sh`

**Purpose**: List all pending agent tasks

**Usage**:
```bash
# List all tasks
./scripts/run-agent.sh all

# List tasks for specific agent
./scripts/run-agent.sh cli
```

---

## Best Practices

### 1. Task File Organization

- ✅ Use descriptive filenames
- ✅ Include priority in filename
- ✅ Use timestamps for tracking
- ✅ Move completed tasks to `done/`
- ✅ Create completion reports in `outbox/`

### 2. Notification Management

- ✅ Keep watcher running during active development
- ✅ Stop watcher when not working on agents
- ✅ Use Do Not Disturb during deep work

### 3. Agent Inbox Hygiene

- ✅ Keep inbox clean (move done tasks)
- ✅ Review pending tasks regularly with `./scripts/run-agent.sh all`
- ✅ Archive old tasks in `done/` directory
- ✅ Document completion in `outbox/`

### 4. Multi-Agent Coordination

- ✅ Use priority levels (P1, P2, P3)
- ✅ Include dependencies in task description
- ✅ Reference related tasks across agents
- ✅ Update agent memory files after task completion

---

## Examples

### Example 1: Creating a Documentation Task

```bash
# Create inbox
mkdir -p output/agents/documentation/inbox

# Create task file
cat > output/agents/documentation/inbox/20251223-P2-api-docs.txt <<'EOF'
# Task: API Documentation

**Priority:** P2
**Assigned To:** Documentation Agent
**Created:** 2025-12-23

---

## Context

Need comprehensive API documentation for the platform.

## Task Objectives

1. Document all API endpoints
2. Add code examples
3. Create integration guide

## Success Criteria

- [ ] API reference complete
- [ ] Examples added
- [ ] Published to docs/

---

*Read and execute this task.*
EOF

# Watcher will notify you immediately!
```

### Example 2: Batch Creating Tasks

```bash
# Create multiple tasks at once
for i in {1..3}; do
  echo "Task $i: Review and update" > "output/agents/cli/inbox/task-00$i.txt"
done

# Watcher detects all 3 files
```

### Example 3: Priority-Based Tasks

```bash
# P1 - Urgent
echo "Fix critical bug" > output/agents/platform/inbox/$(date +%Y%m%d)-P1-critical-bug.txt

# P2 - Normal
echo "Add new feature" > output/agents/platform/inbox/$(date +%Y%m%d)-P2-feature.txt

# P3 - Low priority
echo "Update docs" > output/agents/documentation/inbox/$(date +%Y%m%d)-P3-docs.txt
```

---

## Related Documentation

- **Agent Organization**: `prompts/agents/AGENT_ORG_STRUCTURE.md`
- **Handoff Template**: `prompts/agents/HANDOFF_TEMPLATE.md`
- **Memory Protocol**: `prompts/agents/MEMORY_PROTOCOL.md`
- **Agent Context**: `AGENT_CONTEXT.md`

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review script logs: `cat /tmp/inbox-watcher.log`
3. Test manually with a sample task
4. Ensure macOS notifications are enabled for Terminal

---

*Last updated: 2025-12-23*
