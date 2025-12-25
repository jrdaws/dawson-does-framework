#!/bin/bash
# Memory Rotation Script - Keep memory files lean
# Usage: ./scripts/rotate-memory.sh [MAX_SESSIONS]

MAX_SESSIONS=${1:-5}
MEMORY_DIR="prompts/agents/memory"
ARCHIVE_BASE="output/agents"

echo "🔄 Rotating memory files (keeping last $MAX_SESSIONS sessions)..."

for file in "$MEMORY_DIR"/*_MEMORY.md; do
  [ -f "$file" ] || continue
  
  filename=$(basename "$file")
  agent_name=$(echo "$filename" | sed 's/_MEMORY.md//' | tr '[:upper:]' '[:lower:]')
  archive_dir="$ARCHIVE_BASE/$agent_name/logs"
  
  # Get file size
  size=$(wc -c < "$file" | tr -d ' ')
  
  # Only rotate if > 15KB
  if [ "$size" -gt 15000 ]; then
    echo "  📁 $filename ($size bytes) - rotating..."
    
    # Create archive if needed
    mkdir -p "$archive_dir"
    
    # Archive full file with timestamp
    timestamp=$(date +%Y%m%d-%H%M)
    cp "$file" "$archive_dir/memory-archive-$timestamp.md"
    
    # Keep header (everything before "## Session History") + last N sessions
    # Use awk to extract header and last N session blocks
    awk -v max="$MAX_SESSIONS" '
      /^## Session History/ { in_history = 1 }
      /^## Session:/ || /^---$/ && in_history { 
        session_count++
        if (session_count > 0) sessions[session_count] = ""
      }
      in_history { 
        if (session_count > 0) sessions[session_count] = sessions[session_count] $0 "\n"
      }
      !in_history { header = header $0 "\n" }
      END {
        print header
        print "## Session History (Rotated - Last " max " Sessions)\n"
        start = session_count - max + 1
        if (start < 1) start = 1
        for (i = start; i <= session_count; i++) {
          print sessions[i]
        }
      }
    ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
    
    new_size=$(wc -c < "$file" | tr -d ' ')
    echo "    ✅ Reduced: $size → $new_size bytes"
  else
    echo "  ✓ $filename ($size bytes) - OK"
  fi
done

echo "✅ Memory rotation complete"

