#!/bin/bash
# Quick Export with Interactive Template/Integration Selection
# Requires: fzf (brew install fzf)
#
# Usage: ./quick-export.sh [output_dir]

set -e

PROJECT_DIR="${1:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$PROJECT_DIR"

# Check for fzf
if ! command -v fzf &> /dev/null; then
    echo "❌ fzf not found. Install with: brew install fzf"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Quick Export - Dawson Does Framework"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Template selection
echo "Step 1: Select a template"
TEMPLATE=$(echo -e "saas\ndashboard\nblog\nlanding-page\nseo-directory\nflagship-saas" | \
    fzf --prompt="Template: " --height=10 --border --header="Choose your template")

if [ -z "$TEMPLATE" ]; then
    echo "❌ No template selected, exiting."
    exit 1
fi

echo "✓ Template: $TEMPLATE"
echo ""

# Step 2: Project name
echo "Step 2: Enter project name"
read -p "Project name (default: my-$TEMPLATE-app): " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then
    PROJECT_NAME="my-$TEMPLATE-app"
fi

# Sanitize project name
PROJECT_NAME=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')
echo "✓ Project: $PROJECT_NAME"
echo ""

# Step 3: Output directory
echo "Step 3: Enter output directory"
read -p "Output directory (default: ./$PROJECT_NAME): " OUTPUT_DIR
if [ -z "$OUTPUT_DIR" ]; then
    OUTPUT_DIR="./$PROJECT_NAME"
fi

echo "✓ Output: $OUTPUT_DIR"
echo ""

# Step 4: Integration selection (multi-select)
echo "Step 4: Select integrations (TAB to multi-select, ENTER when done)"
INTEGRATIONS=$(echo -e "auth:supabase\nauth:clerk\npayments:stripe\npayments:paddle\ndatabase:supabase\ndatabase:planetscale\nemail:resend\nemail:sendgrid\nai:anthropic\nai:openai\nanalytics:posthog\nanalytics:plausible\nstorage:supabase\nstorage:s3\nstorage:cloudinary" | \
    fzf --multi --prompt="Integrations: " --height=18 --border --header="Select integrations (TAB to toggle)")

# Build command
CMD="node bin/framework.js export $TEMPLATE $OUTPUT_DIR"

# Parse integrations into flags
if [ -n "$INTEGRATIONS" ]; then
    echo ""
    echo "Selected integrations:"
    while IFS= read -r integration; do
        if [ -n "$integration" ]; then
            TYPE=$(echo "$integration" | cut -d: -f1)
            PROVIDER=$(echo "$integration" | cut -d: -f2)
            CMD="$CMD --$TYPE $PROVIDER"
            echo "  ✓ $TYPE: $PROVIDER"
        fi
    done <<< "$INTEGRATIONS"
fi

# Step 5: Additional options
echo ""
echo "Step 5: Additional options"
read -p "Add --cursor flag for AI context files? [Y/n]: " ADD_CURSOR
if [ "$ADD_CURSOR" != "n" ] && [ "$ADD_CURSOR" != "N" ]; then
    CMD="$CMD --cursor"
fi

read -p "Initialize git remote? (enter URL or leave empty): " GIT_REMOTE
if [ -n "$GIT_REMOTE" ]; then
    CMD="$CMD --remote $GIT_REMOTE --push"
fi

# Display final command
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Command to execute:"
echo ""
echo "  $CMD"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Confirm and execute
read -p "Execute this command? [Y/n]: " CONFIRM
if [ "$CONFIRM" != "n" ] && [ "$CONFIRM" != "N" ]; then
    echo ""
    echo "Executing..."
    echo ""
    eval "$CMD"
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Project created successfully!"
    echo ""
    echo "Next steps:"
    echo "  cd $OUTPUT_DIR"
    echo "  npm install"
    echo "  npm run dev"
    echo ""
    
    # Offer to open in Cursor
    read -p "Open in Cursor now? [Y/n]: " OPEN_CURSOR
    if [ "$OPEN_CURSOR" != "n" ] && [ "$OPEN_CURSOR" != "N" ]; then
        cursor "$OUTPUT_DIR" 2>/dev/null || open -a "Cursor" "$OUTPUT_DIR"
    fi
else
    echo ""
    echo "Command not executed. You can run it manually:"
    echo "  $CMD"
fi

