# Agent Creation SOP

> **Version**: 1.0.0 | **Last Updated**: 2025-12-24
> 
> **Purpose**: Define the complete process for creating a new agent
> **Audience**: Strategist Agent, Auditor Agent, humans adding new agents
> **Principle**: "New agents are fully operational from day one"

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Creation Checklist](#3-creation-checklist)
4. [Step-by-Step Process](#4-step-by-step-process)
5. [Automation Script](#5-automation-script)
6. [Verification](#6-verification)
7. [Rules](#7-rules)

---

## 1. Overview

Every new agent requires:

| Component | Location | Purpose |
|-----------|----------|---------|
| **Work Folders** | `output/agents/[name]/` | Task management (6 folders) |
| **Role Definition** | `prompts/agents/roles/[NAME]_AGENT.md` | Purpose, capabilities, rules |
| **Memory File** | `prompts/agents/memory/[NAME]_MEMORY.md` | Persistent session history |
| **Settings File** | `output/agents/[name]/config/settings.json` | Persistent configuration |
| **Protected Files Entry** | `.protected-files` | Prevent accidental deletion |

---

## 2. Prerequisites

Before creating a new agent:

1. **Justify the need** - Is this role distinct from existing agents?
2. **Define the scope** - What will this agent do that others won't?
3. **Identify category** - Executor, Controller, or Pipeline agent?
4. **Choose a name** - Short, descriptive, lowercase for folders

### Agent Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **Executor** | Performs specific technical tasks | CLI, Website, Template, Testing |
| **Controller** | Oversees, audits, strategizes | Auditor, Strategist, Curator |
| **Pipeline** | Part of a multi-agent workflow | Research, Media, Quality |

---

## 3. Creation Checklist

```markdown
## New Agent Checklist: [AGENT_NAME]

### Folders
- [ ] `output/agents/[name]/inbox/`
- [ ] `output/agents/[name]/outbox/`
- [ ] `output/agents/[name]/done/`
- [ ] `output/agents/[name]/workspace/`
- [ ] `output/agents/[name]/config/`
- [ ] `output/agents/[name]/logs/`

### Files
- [ ] `output/agents/[name]/config/settings.json`
- [ ] `prompts/agents/roles/[NAME]_AGENT.md`
- [ ] `prompts/agents/memory/[NAME]_MEMORY.md`

### Governance
- [ ] Added to `.protected-files`
- [ ] Added to `AGENT_FOLDER_STRUCTURE_SOP.md` agent list
- [ ] Added to `prompts/agents/AGENT_ORG_STRUCTURE.md`
- [ ] Added to `CLAUDE.md` role codes table
- [ ] Added to `.cursorrules` role codes table

### Verification
- [ ] Folders verified with verification script
- [ ] Settings.json is valid JSON
- [ ] Role file follows template
- [ ] Memory file follows template
```

---

## 4. Step-by-Step Process

### Step 1: Create Work Folders

```bash
AGENT_NAME="newagent"  # Replace with actual name (lowercase)

mkdir -p output/agents/$AGENT_NAME/{inbox,outbox,done,workspace,config,logs}
touch output/agents/$AGENT_NAME/{inbox,outbox,done,workspace,config,logs}/.gitkeep
```

### Step 2: Create Settings File

```bash
cat > output/agents/$AGENT_NAME/config/settings.json << 'EOF'
{
  "version": "1.0.0",
  "agent": "AGENT_NAME_HERE",
  "lastUpdated": "2025-12-24T00:00:00Z",
  "updatedBy": "Agent Creation SOP",
  "behavior": {
    "autoConfirm": false,
    "verboseOutput": true,
    "defaultTimeout": 30000,
    "maxRetries": 3
  },
  "defaults": {},
  "features": {
    "experimentalFeatures": false
  }
}
EOF
```

### Step 3: Create Role Definition

Create `prompts/agents/roles/[NAME]_AGENT.md`:

```markdown
# [Name] Agent Role

> **Version**: 1.0.0 | **Category**: [Executor/Controller/Pipeline]

## Purpose

[One sentence describing this agent's primary purpose]

## Responsibilities

1. [Primary responsibility]
2. [Secondary responsibility]
3. [Additional responsibilities...]

## Capabilities

- [Capability 1]
- [Capability 2]
- [Capability 3]

## Boundaries

**This agent SHOULD:**
- [What it should do]

**This agent should NOT:**
- [What it should avoid]

## Settings

This agent's configuration is stored in:
`output/agents/[name]/config/settings.json`

## Handoff Triggers

| Condition | Hand off to |
|-----------|-------------|
| [When X happens] | [Other Agent] |

## Quick Start

\`\`\`
Confirm you are the [Name] Agent.
cd /Users/joseph.dawson/Documents/dawson-does-framework && cat output/agents/[name]/inbox/
\`\`\`
```

### Step 4: Create Memory File

Create `prompts/agents/memory/[NAME]_MEMORY.md`:

```markdown
# [Name] Agent Memory

> **Purpose**: Persistent memory across sessions
> **Format**: Append-only, never delete entries

---

## Quick Reference

| Item | Value |
|------|-------|
| Sessions completed | 0 |
| Last active | Never |
| Primary focus | [TBD] |

---

## Session History

### Session 1 - [DATE]

**Duration**: X minutes
**Tasks**: 
- [Task 1]

**Key Decisions**:
- [Decision 1]

**Handoffs Created**:
- None

---

## Patterns & Insights

[To be populated as agent learns]

---

## FAQ

[To be populated based on common questions]
```

### Step 5: Update Protected Files

Add to `.protected-files`:

```
prompts/agents/roles/[NAME]_AGENT.md
prompts/agents/memory/[NAME]_MEMORY.md
```

### Step 6: Update Governance Files

1. **AGENT_FOLDER_STRUCTURE_SOP.md** - Add to agent list table
2. **prompts/agents/AGENT_ORG_STRUCTURE.md** - Add to org chart
3. **CLAUDE.md** - Add to role codes table
4. **.cursorrules** - Add to role codes table

---

## 5. Automation Script

Save as `scripts/create-agent.sh`:

```bash
#!/bin/bash

# Usage: ./scripts/create-agent.sh <agent-name> <category>
# Example: ./scripts/create-agent.sh security executor

AGENT_NAME=$1
CATEGORY=${2:-executor}  # Default to executor

if [ -z "$AGENT_NAME" ]; then
  echo "Usage: ./scripts/create-agent.sh <agent-name> [category]"
  echo "Categories: executor, controller, pipeline"
  exit 1
fi

# Lowercase the name
AGENT_NAME=$(echo "$AGENT_NAME" | tr '[:upper:]' '[:lower:]')
AGENT_NAME_UPPER=$(echo "$AGENT_NAME" | tr '[:lower:]' '[:upper:]')

echo "Creating agent: $AGENT_NAME ($CATEGORY)"

# Step 1: Create folders
echo "  Creating folders..."
mkdir -p output/agents/$AGENT_NAME/{inbox,outbox,done,workspace,config,logs}
for folder in inbox outbox done workspace config logs; do
  touch output/agents/$AGENT_NAME/$folder/.gitkeep
done

# Step 2: Create settings.json
echo "  Creating settings.json..."
cat > output/agents/$AGENT_NAME/config/settings.json << EOF
{
  "version": "1.0.0",
  "agent": "$AGENT_NAME",
  "lastUpdated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "updatedBy": "create-agent.sh",
  "behavior": {
    "autoConfirm": false,
    "verboseOutput": true,
    "defaultTimeout": 30000,
    "maxRetries": 3
  },
  "defaults": {},
  "features": {
    "experimentalFeatures": false
  }
}
EOF

# Step 3: Create role file
echo "  Creating role file..."
cat > prompts/agents/roles/${AGENT_NAME_UPPER}_AGENT.md << EOF
# ${AGENT_NAME^} Agent Role

> **Version**: 1.0.0 | **Category**: ${CATEGORY^}

## Purpose

[Define this agent's primary purpose]

## Responsibilities

1. [Primary responsibility]
2. [Secondary responsibility]

## Capabilities

- [Capability 1]
- [Capability 2]

## Boundaries

**This agent SHOULD:**
- [What it should do]

**This agent should NOT:**
- [What it should avoid]

## Settings

This agent's configuration is stored in:
\`output/agents/$AGENT_NAME/config/settings.json\`

## Handoff Triggers

| Condition | Hand off to |
|-----------|-------------|
| [When X happens] | [Other Agent] |

## Quick Start

\`\`\`
Confirm you are the ${AGENT_NAME^} Agent.
cd /Users/joseph.dawson/Documents/dawson-does-framework && cat output/agents/$AGENT_NAME/inbox/
\`\`\`
EOF

# Step 4: Create memory file
echo "  Creating memory file..."
cat > prompts/agents/memory/${AGENT_NAME_UPPER}_MEMORY.md << EOF
# ${AGENT_NAME^} Agent Memory

> **Purpose**: Persistent memory across sessions
> **Format**: Append-only, never delete entries

---

## Quick Reference

| Item | Value |
|------|-------|
| Sessions completed | 0 |
| Last active | Never |
| Primary focus | TBD |

---

## Session History

(No sessions yet)

---

## Patterns & Insights

(To be populated as agent learns)

---

## FAQ

(To be populated based on common questions)
EOF

# Step 5: Add to protected files
echo "  Updating .protected-files..."
echo "" >> .protected-files
echo "# ${AGENT_NAME^} Agent" >> .protected-files
echo "prompts/agents/roles/${AGENT_NAME_UPPER}_AGENT.md" >> .protected-files
echo "prompts/agents/memory/${AGENT_NAME_UPPER}_MEMORY.md" >> .protected-files

echo ""
echo "✅ Agent '$AGENT_NAME' created successfully!"
echo ""
echo "Next steps:"
echo "  1. Edit prompts/agents/roles/${AGENT_NAME_UPPER}_AGENT.md to define purpose"
echo "  2. Update AGENT_FOLDER_STRUCTURE_SOP.md agent list"
echo "  3. Update CLAUDE.md and .cursorrules role codes"
echo "  4. Commit: git add -A && git commit -m 'feat(agents): add $AGENT_NAME agent'"
```

Make executable:
```bash
chmod +x scripts/create-agent.sh
```

---

## 6. Verification

### Verify Folder Structure

```bash
AGENT_NAME="newagent"

echo "=== Verifying $AGENT_NAME ==="
for folder in inbox outbox done workspace config logs; do
  if [ -d "output/agents/$AGENT_NAME/$folder" ]; then
    echo "  ✅ $folder"
  else
    echo "  ❌ $folder (missing)"
  fi
done

# Verify settings.json
if [ -f "output/agents/$AGENT_NAME/config/settings.json" ]; then
  echo "  ✅ settings.json exists"
  if jq empty "output/agents/$AGENT_NAME/config/settings.json" 2>/dev/null; then
    echo "  ✅ settings.json is valid JSON"
  else
    echo "  ❌ settings.json is invalid JSON"
  fi
else
  echo "  ❌ settings.json missing"
fi
```

### Verify All Required Files

```bash
AGENT_NAME="newagent"
AGENT_UPPER=$(echo "$AGENT_NAME" | tr '[:lower:]' '[:upper:]')

echo "=== File Verification ==="
[ -f "prompts/agents/roles/${AGENT_UPPER}_AGENT.md" ] && echo "✅ Role file" || echo "❌ Role file missing"
[ -f "prompts/agents/memory/${AGENT_UPPER}_MEMORY.md" ] && echo "✅ Memory file" || echo "❌ Memory file missing"
grep -q "${AGENT_UPPER}_AGENT.md" .protected-files && echo "✅ In protected files" || echo "❌ Not in protected files"
```

---

## 7. Rules

### Rule 1: Use the Script

Always use `scripts/create-agent.sh` for consistency. Manual creation is error-prone.

### Rule 2: Complete All Steps

A partially created agent causes confusion. Complete all steps before announcing.

### Rule 3: Immediate Verification

Run verification immediately after creation. Fix any issues before committing.

### Rule 4: Governance Updates Required

Agent creation is NOT complete until governance files are updated (CLAUDE.md, .cursorrules).

### Rule 5: Strategist Approval

New agents should be proposed and approved by the Strategist Agent before creation.

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

