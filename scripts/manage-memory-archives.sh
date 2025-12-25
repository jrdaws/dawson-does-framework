#!/bin/bash
# Memory Archive Management - Compress old archives, flag for review
# Usage: ./scripts/manage-memory-archives.sh

ARCHIVE_BASE="output/agents"
SHARED_ARCHIVE="output/shared/archive/memory"
REVIEW_FILE="output/shared/archive/memory/NEEDS_REVIEW.txt"

echo "📦 Managing memory archives..."

# Create shared archive if needed
mkdir -p "$SHARED_ARCHIVE"

# Process each agent's logs
for agent_dir in "$ARCHIVE_BASE"/*/logs; do
  [ -d "$agent_dir" ] || continue
  agent_name=$(basename "$(dirname "$agent_dir")")
  
  for archive in "$agent_dir"/memory-archive-*.md; do
    [ -f "$archive" ] || continue
    
    filename=$(basename "$archive")
    # Extract date from filename (memory-archive-YYYYMMDD-HHMM.md)
    archive_date=$(echo "$filename" | grep -oE '[0-9]{8}')
    
    if [ -z "$archive_date" ]; then
      continue
    fi
    
    # Calculate age in days (macOS compatible)
    archive_epoch=$(date -j -f "%Y%m%d" "$archive_date" "+%s" 2>/dev/null || date -d "$archive_date" "+%s" 2>/dev/null)
    now_epoch=$(date "+%s")
    age_days=$(( (now_epoch - archive_epoch) / 86400 ))
    
    if [ "$age_days" -gt 90 ]; then
      # Flag for manual review (DO NOT DELETE)
      echo "  ⚠️  $agent_name/$filename ($age_days days) - flagged for review"
      echo "[$agent_name] $filename - $age_days days old - $(date)" >> "$REVIEW_FILE"
      # Move to shared archive for centralized review
      mkdir -p "$SHARED_ARCHIVE/$agent_name"
      mv "$archive" "$SHARED_ARCHIVE/$agent_name/"
      
    elif [ "$age_days" -gt 30 ]; then
      # Move to shared archive (keep uncompressed for easy access)
      echo "  📁 $agent_name/$filename ($age_days days) - moving to shared archive"
      mkdir -p "$SHARED_ARCHIVE/$agent_name"
      mv "$archive" "$SHARED_ARCHIVE/$agent_name/"
      
    elif [ "$age_days" -gt 7 ]; then
      # Compress in place
      if [ ! -f "${archive}.gz" ]; then
        echo "  🗜️  $agent_name/$filename ($age_days days) - compressing"
        gzip -k "$archive" && rm "$archive"
      fi
    else
      echo "  ✓ $agent_name/$filename ($age_days days) - keeping"
    fi
  done
done

# Report files needing review
if [ -f "$REVIEW_FILE" ]; then
  review_count=$(wc -l < "$REVIEW_FILE" | tr -d ' ')
  echo ""
  echo "📋 $review_count archives need manual review"
  echo "   See: $REVIEW_FILE"
  echo "   Location: $SHARED_ARCHIVE/"
fi

echo "✅ Archive management complete"

