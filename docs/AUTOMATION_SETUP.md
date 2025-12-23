# Automation Setup Guide

> **Last Updated:** 2025-12-23
> **Status:** ✅ Active (Cron Job configured)

## Overview

The dawson-does-framework uses automated improvement cycles that run the 3 controller agents (Auditor → Strategist → Curator) on a schedule to continuously identify and prioritize improvements.

## Current Setup: Cron Job

### Schedule
- **Midnight** (00:00)
- **6am** (06:00)
- **Noon** (12:00)
- **6pm** (18:00)

### Configuration

**Crontab entry:**
```cron
# Set PATH to include Claude CLI location
PATH=/Users/joseph.dawson/.local/bin:/usr/local/bin:/usr/bin:/bin

# Automated Improvement Cycle - runs at midnight, 6am, noon, 6pm
0 0,6,12,18 * * * cd /Users/joseph.dawson/Documents/dawson-does-framework && ./scripts/auto-improvement-cycle.sh >> logs/cycles.log 2>&1
```

### Scripts

1. **`scripts/auto-improvement-cycle.sh`** (Main automation script)
   - Runs Auditor → Strategist → Curator in sequence
   - Creates reports in `output/shared/reports/`
   - Distributes tasks to agent inboxes
   - Sends macOS notification when complete

2. **`scripts/run-improvement-cycle.sh`** (Manual guidance)
   - Shows cycle status
   - Provides prompts to copy into Cursor
   - Checks for recent reports

3. **`scripts/setup-scheduled-cycles.sh`** (Launchd setup)
   - Alternative to cron (macOS launchd)
   - Runs every 6 hours

## Prerequisites

### 1. Claude CLI
```bash
# Install
npm install -g @anthropic-ai/claude-cli

# Configure API key
claude config set api_key YOUR_ANTHROPIC_API_KEY

# Verify
which claude
claude --version
```

### 2. Logs Directory
```bash
mkdir -p logs
```

## Management Commands

### View Crontab
```bash
crontab -l
```

### Edit Crontab
```bash
crontab -e
```

### Remove Crontab
```bash
crontab -r
```

### View Logs
```bash
# All cycles
tail -f logs/cycles.log

# Specific cycle
tail -f logs/auditor-YYYYMMDD-HHMM.log
tail -f logs/strategist-YYYYMMDD-HHMM.log
tail -f logs/curator-YYYYMMDD-HHMM.log
```

### Manual Test Run
```bash
# Test the automation script
./scripts/auto-improvement-cycle.sh

# Run manual cycle with guidance
./scripts/run-improvement-cycle.sh
```

## Output Structure

```
output/
├── shared/
│   └── reports/
│       ├── audit-YYYYMMDD-HHMM.txt
│       ├── strategy-YYYYMMDD-HHMM.txt
│       └── cycle-summary-YYYYMMDD-HHMM.txt
└── [agent-name]/
    └── inbox/
        └── YYYYMMDD-HHMM-P[1-3]-task-*.txt
```

## How It Works

### Phase 1: Auditor (15-20 min)
- Reviews last 6 hours of git changes
- Runs test suite
- Checks agent memory files
- Identifies issues and opportunities
- Creates `audit-YYYYMMDD-HHMM.txt`

### Phase 2: Strategist (10-15 min)
- Reads latest audit report
- Prioritizes improvements
- Creates strategic plan
- Drafts task prompts for executor agents
- Creates `strategy-YYYYMMDD-HHMM.txt`

### Phase 3: Curator (5-10 min)
- Reviews draft prompts
- Scores against quality criteria
- Refines prompts as needed
- Distributes to agent inboxes
- Creates `cycle-summary-YYYYMMDD-HHMM.txt`

**Total cycle time: ~30-45 minutes**

## Monitoring

### Check Last Run
```bash
ls -lt logs/cycles.log | head -1
tail -20 logs/cycles.log
```

### Check Task Distribution
```bash
# Count tasks in inboxes
find output -path "*/inbox/*.txt" | wc -l

# List recent tasks
find output -path "*/inbox/*.txt" -mtime -1
```

### Check Reports
```bash
ls -lt output/shared/reports/ | head -5
```

## Troubleshooting

### Cron Not Running
```bash
# Check if cron is enabled
launchctl list | grep cron

# Check system logs
log show --predicate 'process == "cron"' --last 1h
```

### Claude CLI Not Found
```bash
# Verify PATH in crontab includes .local/bin
crontab -l | grep PATH

# Test PATH
env - PATH=/Users/joseph.dawson/.local/bin:/usr/bin:/bin which claude
```

### Script Errors
```bash
# Run script manually to see errors
./scripts/auto-improvement-cycle.sh

# Check logs
tail -50 logs/cycles.log
```

### No Tasks Generated
- Check if audit report was created
- Verify Strategist ran after Auditor
- Check draft prompts in `output/controller-agents/strategist/outbox/drafts/`

## Alternative: Launchd (macOS)

If you prefer launchd over cron:

```bash
# One-time setup
./scripts/setup-scheduled-cycles.sh

# Control commands
launchctl start dev.dawson.improvement-cycle
launchctl stop dev.dawson.improvement-cycle
launchctl unload ~/Library/LaunchAgents/dev.dawson.improvement-cycle.plist

# View logs
tail -f logs/launchd-stdout.log
tail -f logs/launchd-stderr.log
```

## Disabling Automation

To disable the automated cycles:

```bash
# Remove crontab
crontab -r

# Or comment out in crontab
crontab -e
# Add # to beginning of cycle line
```

## Manual Workflow

If you prefer manual cycles:

1. Run guidance script:
   ```bash
   ./scripts/run-improvement-cycle.sh
   ```

2. Copy the provided prompts into Cursor chats

3. Wait for each phase to complete before starting next

4. Check for tasks in agent inboxes:
   ```bash
   ./scripts/run-agent.sh all
   ```

---

**Status:** ✅ Cron job active, next run scheduled
**Logs:** `logs/cycles.log`
**Reports:** `output/shared/reports/`
