#!/bin/bash
# Generate hash of governance files
# Run after any governance change and update .cursorrules with new hash

FILES=".cursorrules AGENT_CONTEXT.md prompts/agents/AGENT_POLICIES.md GOVERNANCE_CARD.md"
HASH=$(cat $FILES 2>/dev/null | shasum -a 256 | cut -c1-12)

echo "Governance Hash: $HASH"
echo ""
echo "Update .cursorrules line 4 with:"
echo "# Hash: $HASH | If unchanged, skip re-reading governance files"

