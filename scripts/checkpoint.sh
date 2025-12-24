#!/bin/bash
# Checkpoint script - ensures memory update before commit
# Usage: ./scripts/checkpoint.sh [AGENT_CODE]

set -e

AGENT_CODE="${1:-UNKNOWN}"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           🔄 CHECKPOINT: $AGENT_CODE Agent                    "
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# 1. Run tests
echo "📋 Step 1: Running tests..."
if npm test > /dev/null 2>&1; then
  TESTS=$(npm test 2>&1 | grep -E "^ℹ tests" | awk '{print $3}')
  echo "   ✅ Tests passing: $TESTS"
else
  echo "   ❌ Tests failed - fix before checkpoint"
  exit 1
fi

# 2. Check memory file
MEMORY_FILE="prompts/agents/memory/${AGENT_CODE}_MEMORY.md"
if [ -f "$MEMORY_FILE" ]; then
  MEMORY_MTIME=$(stat -f %m "$MEMORY_FILE" 2>/dev/null || stat -c %Y "$MEMORY_FILE" 2>/dev/null)
  NOW=$(date +%s)
  AGE=$((NOW - MEMORY_MTIME))
  
  if [ $AGE -gt 1800 ]; then  # 30 minutes
    echo ""
    echo "⚠️  Step 2: Memory file not updated recently!"
    echo "   File: $MEMORY_FILE"
    echo "   Last modified: $((AGE / 60)) minutes ago"
    echo ""
    echo "   Before continuing, update your memory with:"
    echo "   - Work Completed"
    echo "   - Key Decisions"
    echo "   - Time Spent"
    echo "   - Files Changed"
    echo ""
    read -p "   Have you updated your memory file? (y/N): " CONFIRM
    if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
      echo "   ❌ Please update memory file first"
      exit 1
    fi
  else
    echo "   ✅ Memory file recently updated"
  fi
else
  echo "   ⚠️ Memory file not found: $MEMORY_FILE"
fi

# 3. Stage all changes
echo ""
echo "📋 Step 3: Staging changes..."
git add -A

# 4. Check for changes to commit
if git diff --cached --quiet; then
  echo "   ℹ️ No changes to commit"
  COMMITTED="false"
else
  # Count changed files
  CHANGED=$(git diff --cached --name-only | wc -l | tr -d ' ')
  echo "   📁 $CHANGED files staged"
  
  # 5. Commit
  echo ""
  echo "📋 Step 4: Committing..."
  if [ -z "$2" ]; then
    read -p "   Commit message: " MSG
  else
    MSG="$2"
  fi
  
  git commit -m "$MSG"
  COMMIT_HASH=$(git rev-parse --short HEAD)
  echo "   ✅ Committed: $COMMIT_HASH"
  COMMITTED="true"
fi

# 6. Push
if [ "$COMMITTED" = "true" ]; then
  echo ""
  echo "📋 Step 5: Pushing..."
  if ./scripts/git-push-safe.sh 2>/dev/null; then
    echo "   ✅ Pushed to origin/main"
  else
    echo "   ⚠️ Push failed - try manually"
  fi
fi

# 7. Summary
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           ✅ CHECKPOINT COMPLETE                              "
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "   Tests:    ✅ $TESTS passing"
echo "   Memory:   ✅ Updated"
if [ "$COMMITTED" = "true" ]; then
  echo "   Commit:   ✅ $COMMIT_HASH"
  echo "   Push:     ✅ origin/main"
else
  echo "   Commit:   ⏭️ No changes"
fi
echo ""

