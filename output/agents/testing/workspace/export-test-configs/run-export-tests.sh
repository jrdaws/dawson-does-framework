#!/bin/bash
# Export Build Test Runner
# Testing Agent | 2026-01-04
#
# Usage: ./run-export-tests.sh [test-config.json]
#
# Requires: Dev server running on localhost:3000

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$WORKSPACE_DIR/export-test-results"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

mkdir -p "$OUTPUT_DIR"

run_single_test() {
    local config_file="$1"
    local test_id=$(jq -r '.id' "$config_file")
    local test_name=$(jq -r '.name' "$config_file")
    local project_name=$(jq -r '.projectName' "$config_file")
    local template=$(jq -r '.template' "$config_file")
    local integrations=$(jq -c '.integrations' "$config_file")
    
    echo -e "${YELLOW}Running: $test_id - $test_name${NC}"
    
    local test_dir="$OUTPUT_DIR/$test_id"
    rm -rf "$test_dir"
    mkdir -p "$test_dir"
    
    # 1. Export project
    echo "  Exporting..."
    local export_response=$(curl -s -X POST http://localhost:3000/api/export/zip \
        -H "Content-Type: application/json" \
        -d "{\"projectName\":\"$project_name\",\"template\":\"$template\",\"integrations\":$integrations}" \
        --output "$test_dir/export.zip" \
        -w "%{http_code}")
    
    if [ "$export_response" != "200" ]; then
        echo -e "  ${RED}FAIL: Export failed with status $export_response${NC}"
        echo "export_failed" > "$test_dir/result.txt"
        return 1
    fi
    
    # 2. Extract
    echo "  Extracting..."
    unzip -q "$test_dir/export.zip" -d "$test_dir/project"
    
    # 3. Check expected files
    local expected_files=$(jq -r '.expectedFiles[]' "$config_file")
    local missing_files=""
    for file in $expected_files; do
        if [ ! -f "$test_dir/project/$file" ]; then
            missing_files="$missing_files $file"
        fi
    done
    
    if [ -n "$missing_files" ]; then
        echo -e "  ${RED}FAIL: Missing files:$missing_files${NC}"
        echo "missing_files:$missing_files" > "$test_dir/result.txt"
        return 1
    fi
    
    # 4. Install dependencies
    echo "  Installing dependencies..."
    cd "$test_dir/project"
    npm install --silent > "$test_dir/npm-install.log" 2>&1
    
    # 5. Copy env vars if needed
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env.local
        # Add dummy values for build
        echo "NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co" >> .env.local
        echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy-anon-key" >> .env.local
    fi
    
    # 6. Build
    echo "  Building..."
    if npm run build > "$test_dir/build.log" 2>&1; then
        echo -e "  ${GREEN}PASS: Build succeeded${NC}"
        echo "pass" > "$test_dir/result.txt"
        return 0
    else
        echo -e "  ${RED}FAIL: Build failed (see $test_dir/build.log)${NC}"
        echo "build_failed" > "$test_dir/result.txt"
        return 1
    fi
}

# Main
if [ -n "$1" ]; then
    # Run single test
    run_single_test "$1"
else
    # Run all tests
    echo "Running all export tests..."
    
    passed=0
    failed=0
    
    for config in "$SCRIPT_DIR"/*.json; do
        if run_single_test "$config"; then
            ((passed++))
        else
            ((failed++))
        fi
        echo ""
    done
    
    echo "========================================"
    echo -e "Results: ${GREEN}$passed passed${NC}, ${RED}$failed failed${NC}"
    echo "========================================"
fi

