# Agent Persistent Settings SOP

> **Version**: 1.0.0 | **Last Updated**: 2025-12-24
> 
> **Purpose**: Define how agents store and use persistent configuration settings
> **Audience**: All agents
> **Principle**: "Settings persist across sessions, enabling smarter agents"

---

## Table of Contents

1. [Overview](#1-overview)
2. [Config Folder Structure](#2-config-folder-structure)
3. [Settings File Format](#3-settings-file-format)
4. [Standard Settings](#4-standard-settings)
5. [Reading Settings](#5-reading-settings)
6. [Writing Settings](#6-writing-settings)
7. [Logs Folder](#7-logs-folder)
8. [Rules](#8-rules)

---

## 1. Overview

Each agent now has two new folders:

```
output/agents/[agent-name]/
├── inbox/
├── outbox/
├── done/
├── workspace/
├── config/      # NEW: Persistent settings
└── logs/        # NEW: Session logs
```

**Purpose:**
- `config/` - Store preferences, thresholds, learned patterns
- `logs/` - Detailed session transcripts for debugging/audit

---

## 2. Config Folder Structure

```
output/agents/[agent-name]/config/
├── settings.json          # Primary settings file
├── preferences.json       # User-defined preferences (optional)
├── thresholds.json        # Numeric thresholds (optional)
└── patterns.json          # Learned patterns (optional)
```

**Minimum required**: `settings.json`

---

## 3. Settings File Format

### settings.json (Required)

```json
{
  "$schema": "../../schemas/agent-settings.schema.json",
  "version": "1.0.0",
  "agent": "cli",
  "lastUpdated": "2025-12-24T10:00:00Z",
  "updatedBy": "CLI Agent",
  
  "behavior": {
    "autoConfirm": false,
    "verboseOutput": true,
    "defaultTimeout": 30000
  },
  
  "defaults": {
    "template": "saas",
    "outputPath": "./output"
  },
  
  "features": {
    "experimentalFeatures": false,
    "betaIntegrations": []
  }
}
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `$schema` | string | No | JSON schema reference |
| `version` | string | Yes | Settings file version |
| `agent` | string | Yes | Agent name (lowercase) |
| `lastUpdated` | ISO 8601 | Yes | When settings were last changed |
| `updatedBy` | string | Yes | Who/what made the change |
| `behavior` | object | No | Runtime behavior settings |
| `defaults` | object | No | Default values for operations |
| `features` | object | No | Feature flags |

---

## 4. Standard Settings

### 4.1 Behavior Settings (All Agents)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `autoConfirm` | boolean | `false` | Skip confirmation prompts |
| `verboseOutput` | boolean | `true` | Show detailed output |
| `defaultTimeout` | number | `30000` | Default timeout in ms |
| `maxRetries` | number | `3` | Retry attempts on failure |

### 4.2 Agent-Specific Settings

#### CLI Agent
```json
{
  "defaults": {
    "template": "saas",
    "outputPath": "./",
    "integrations": []
  },
  "export": {
    "includeTests": true,
    "includeReadme": true
  }
}
```

#### Website Agent
```json
{
  "preview": {
    "port": 3000,
    "openBrowser": true
  },
  "components": {
    "preferredLibrary": "shadcn"
  }
}
```

#### Testing Agent
```json
{
  "testing": {
    "runOnCommit": true,
    "coverageThreshold": 80,
    "parallelTests": true
  }
}
```

#### Auditor Agent
```json
{
  "audit": {
    "strictMode": true,
    "autoApproveThreshold": 95,
    "requireReviewBelow": 80
  }
}
```

#### Documentation Agent
```json
{
  "docs": {
    "freshnessThresholdDays": 7,
    "autoGenerateTOC": true
  }
}
```

---

## 5. Reading Settings

### At Session Start

Agents SHOULD read their settings at the beginning of each session:

```bash
# Read agent settings
cat output/agents/[agent]/config/settings.json
```

### In Code

```javascript
// Example: Reading settings in JavaScript
import { readFileSync } from 'fs';

function getAgentSettings(agentName) {
  const path = `output/agents/${agentName}/config/settings.json`;
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return getDefaultSettings(agentName);
  }
}
```

### Fallback Behavior

If `settings.json` doesn't exist:
1. Use hardcoded defaults
2. Optionally create `settings.json` with defaults
3. Continue with operation

---

## 6. Writing Settings

### When to Write

- User explicitly requests a preference change
- Agent learns a pattern that should persist
- Threshold adjustment based on feedback

### How to Write

```bash
# Update a single setting (using jq)
jq '.behavior.autoConfirm = true' output/agents/cli/config/settings.json > tmp.json \
  && mv tmp.json output/agents/cli/config/settings.json
```

### Rules for Writing

1. **Always update `lastUpdated`** timestamp
2. **Always set `updatedBy`** to the agent making the change
3. **Never delete existing settings** - only modify or add
4. **Validate JSON** before writing
5. **Commit settings changes** with `chore(config):` prefix

---

## 7. Logs Folder

### Purpose

Store detailed session transcripts for debugging and auditing.

### Structure

```
output/agents/[agent-name]/logs/
├── 2025-12-24-session-1.md
├── 2025-12-24-session-2.md
└── ...
```

### Log File Format

```markdown
# Session Log: CLI Agent
**Date**: 2025-12-24 10:30:00
**Duration**: 45 minutes
**Tasks Completed**: 3

## Summary
- Exported 2 projects
- Fixed 1 bug
- Created 1 handoff prompt

## Commands Run
1. `framework export saas ./myapp` - Success
2. `npm test` - 694 passing

## Decisions Made
- Chose to skip optional integration (user preference)
- Added extra validation for path input

## Errors Encountered
- None

## Handoffs Created
- Testing Agent: Verify export output
```

### When to Log

- **Always**: After significant sessions (15+ minutes or 3+ tasks)
- **Optional**: Quick sessions or single-task runs
- **Never**: Failed bootstrap (nothing to log)

### Log Retention

- Keep logs for 30 days
- Archive older logs to `logs/archive/` if needed
- Delete logs older than 90 days

---

## 8. Rules

### Rule 1: Settings are Optional

Agents MUST function without settings files. Settings enhance behavior but are not required.

### Rule 2: No Sensitive Data

**NEVER store in config/:**
- API keys or tokens
- Passwords or secrets
- User personal information

Use `.env` files for sensitive data.

### Rule 3: Schema Validation

Settings files SHOULD validate against a schema. Create schema at:
```
output/schemas/agent-settings.schema.json
```

### Rule 4: Human Readable

All config files MUST be:
- JSON with 2-space indentation
- Well-commented (via separate README if needed)
- Easy to edit manually

### Rule 5: Commit Config Changes

Settings changes SHOULD be committed:
```bash
git add output/agents/*/config/
git commit -m "chore(config): update [agent] settings"
```

---

## Quick Start

### Initialize Settings for an Agent

```bash
# Create default settings for CLI agent
cat > output/agents/cli/config/settings.json << 'EOF'
{
  "version": "1.0.0",
  "agent": "cli",
  "lastUpdated": "2025-12-24T00:00:00Z",
  "updatedBy": "Manual initialization",
  "behavior": {
    "autoConfirm": false,
    "verboseOutput": true,
    "defaultTimeout": 30000
  }
}
EOF
```

### Read Current Settings

```bash
cat output/agents/[agent]/config/settings.json | jq .
```

### Update a Setting

```bash
# Using jq to update
jq '.behavior.verboseOutput = false | .lastUpdated = now | .updatedBy = "User"' \
  output/agents/cli/config/settings.json > tmp.json && mv tmp.json output/agents/cli/config/settings.json
```

---

## Approval Chain

| Role | Agent | Date | Status |
|------|-------|------|--------|
| Author | Auditor Agent | 2025-12-24 | ✅ Drafted |
| Reviewer | | | ⏳ Pending |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-24 | Auditor Agent | Initial creation |

