#!/bin/bash

# Agent Creation Script
# Usage: ./scripts/create-agent.sh <agent-name> [category]
# Example: ./scripts/create-agent.sh security executor
#
# Categories: executor, controller, pipeline

set -e

AGENT_NAME=$1
CATEGORY=${2:-executor}

if [ -z "$AGENT_NAME" ]; then
  echo "❌ Error: Agent name required"
  echo ""
  echo "Usage: ./scripts/create-agent.sh <agent-name> [category]"
  echo ""
  echo "Arguments:"
  echo "  agent-name    Name of the new agent (lowercase, no spaces)"
  echo "  category      Optional: executor (default), controller, pipeline"
  echo ""
  echo "Examples:"
  echo "  ./scripts/create-agent.sh security"
  echo "  ./scripts/create-agent.sh compliance controller"
  echo "  ./scripts/create-agent.sh video pipeline"
  exit 1
fi

# Lowercase the name
AGENT_NAME=$(echo "$AGENT_NAME" | tr '[:upper:]' '[:lower:]')
AGENT_NAME_UPPER=$(echo "$AGENT_NAME" | tr '[:lower:]' '[:upper:]')
AGENT_NAME_CAPITALIZED="$(tr '[:lower:]' '[:upper:]' <<< ${AGENT_NAME:0:1})${AGENT_NAME:1}"

# Check if agent already exists
if [ -d "output/agents/$AGENT_NAME" ]; then
  echo "❌ Error: Agent '$AGENT_NAME' already exists at output/agents/$AGENT_NAME/"
  exit 1
fi

echo "🤖 Creating agent: $AGENT_NAME ($CATEGORY)"
echo ""

# Step 1: Create folders
echo "📁 Step 1: Creating folders..."
mkdir -p output/agents/$AGENT_NAME/{inbox,outbox,done,workspace,config,logs}
for folder in inbox outbox done workspace config logs; do
  touch output/agents/$AGENT_NAME/$folder/.gitkeep
done
echo "   ✅ Created 6 folders"

# Step 2: Create settings.json
echo "⚙️  Step 2: Creating settings.json..."
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
echo "   ✅ Created settings.json"

# Step 3: Create role file
echo "📋 Step 3: Creating role file..."
cat > prompts/agents/roles/${AGENT_NAME_UPPER}_AGENT.md << EOF
# $AGENT_NAME_CAPITALIZED Agent Role

> **Version**: 1.0.0 | **Category**: $(tr '[:lower:]' '[:upper:]' <<< ${CATEGORY:0:1})${CATEGORY:1}

## Purpose

[Define this agent's primary purpose - EDIT THIS]

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
- Perform tasks outside its defined scope
- Modify files owned by other agents without coordination

## Settings

This agent's configuration is stored in:
\`output/agents/$AGENT_NAME/config/settings.json\`

## Handoff Triggers

| Condition | Hand off to |
|-----------|-------------|
| [When X happens] | [Other Agent] |
| Task complete | Next agent in workflow |

## Quick Start

\`\`\`
Confirm you are the $AGENT_NAME_CAPITALIZED Agent.
cd /Users/joseph.dawson/Documents/dawson-does-framework && cat output/agents/$AGENT_NAME/inbox/
\`\`\`

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | $(date +%Y-%m-%d) | create-agent.sh | Initial creation |
EOF
echo "   ✅ Created prompts/agents/roles/${AGENT_NAME_UPPER}_AGENT.md"

# Step 4: Create memory file
echo "🧠 Step 4: Creating memory file..."
cat > prompts/agents/memory/${AGENT_NAME_UPPER}_MEMORY.md << EOF
# $AGENT_NAME_CAPITALIZED Agent Memory

> **Purpose**: Persistent memory across sessions
> **Format**: Append-only, never delete entries
> **Created**: $(date +%Y-%m-%d)

---

## Quick Reference

| Item | Value |
|------|-------|
| Sessions completed | 0 |
| Last active | Never |
| Primary focus | TBD |
| Category | $CATEGORY |

---

## Session History

(No sessions yet)

---

## Patterns & Insights

(To be populated as agent learns)

---

## FAQ

(To be populated based on common questions)

---

## Metrics

| Metric | Value |
|--------|-------|
| Tasks completed | 0 |
| Handoffs created | 0 |
| Errors encountered | 0 |
EOF
echo "   ✅ Created prompts/agents/memory/${AGENT_NAME_UPPER}_MEMORY.md"

# Step 5: Add to protected files
echo "🛡️  Step 5: Updating .protected-files..."
echo "" >> .protected-files
echo "# $AGENT_NAME_CAPITALIZED Agent" >> .protected-files
echo "prompts/agents/roles/${AGENT_NAME_UPPER}_AGENT.md" >> .protected-files
echo "prompts/agents/memory/${AGENT_NAME_UPPER}_MEMORY.md" >> .protected-files
echo "   ✅ Added to .protected-files"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ Agent '$AGENT_NAME' created successfully!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📂 Folders created:"
echo "   output/agents/$AGENT_NAME/"
echo "   ├── inbox/"
echo "   ├── outbox/"
echo "   ├── done/"
echo "   ├── workspace/"
echo "   ├── config/settings.json"
echo "   └── logs/"
echo ""
echo "📄 Files created:"
echo "   prompts/agents/roles/${AGENT_NAME_UPPER}_AGENT.md"
echo "   prompts/agents/memory/${AGENT_NAME_UPPER}_MEMORY.md"
echo ""
echo "⚠️  MANUAL STEPS REQUIRED:"
echo "   1. Edit prompts/agents/roles/${AGENT_NAME_UPPER}_AGENT.md"
echo "      - Define purpose and responsibilities"
echo "   2. Update docs/sops/AGENT_FOLDER_STRUCTURE_SOP.md"
echo "      - Add agent to the folder locations table"
echo "   3. Update CLAUDE.md and .cursorrules"
echo "      - Add role code to the table"
echo "   4. Update prompts/agents/AGENT_ORG_STRUCTURE.md"
echo "      - Add agent to org chart"
echo ""
echo "📝 Commit command:"
echo "   git add -A && git commit -m 'feat(agents): add $AGENT_NAME agent'"
echo ""
echo "🚀 Activation prompt:"
echo "   Confirm you are the $AGENT_NAME_CAPITALIZED Agent."
echo "   cd /Users/joseph.dawson/Documents/dawson-does-framework && cat output/agents/$AGENT_NAME/inbox/"
echo ""

