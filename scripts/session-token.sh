#!/bin/bash
# Session Token Generator
# Creates unique tokens that agents must acknowledge in their responses
# This provides lightweight "authentication" that an agent is in the right session
#
# Usage:
#   ./scripts/session-token.sh generate <role>  - Generate new token
#   ./scripts/session-token.sh show             - Show current token
#   ./scripts/session-token.sh verify <token>   - Verify a token is valid
#   ./scripts/session-token.sh clear            - Clear current token
#
# Version: 1.0
# Last Updated: 2025-12-22

TOKEN_FILE=".session-token"

generate_token() {
    local ROLE="$1"
    
    if [ -z "$ROLE" ]; then
        echo "Error: Role required"
        echo "Usage: $0 generate <role>"
        exit 1
    fi
    
    # Generate a readable token: adjective-noun-number
    ADJECTIVES=("swift" "brave" "calm" "eager" "fair" "kind" "neat" "proud" "sharp" "warm")
    NOUNS=("eagle" "falcon" "hawk" "lion" "tiger" "wolf" "bear" "fox" "owl" "raven")
    
    ADJ_IDX=$((RANDOM % 10))
    NOUN_IDX=$((RANDOM % 10))
    NUM=$((RANDOM % 9000 + 1000))
    
    TOKEN="${ADJECTIVES[$ADJ_IDX]}-${NOUNS[$NOUN_IDX]}-$NUM"
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S %Z')
    ROLE_UPPER=$(echo "$ROLE" | tr '[:lower:]' '[:upper:]')
    
    # Store token info
    cat > "$TOKEN_FILE" << EOF
TOKEN=$TOKEN
ROLE=$ROLE_UPPER
CREATED=$TIMESTAMP
EPOCH=$(date +%s)
HOST=$USER@$(hostname)
EOF
    
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           🔑 SESSION TOKEN GENERATED                          "
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    echo "   Token:  $TOKEN"
    echo "   Role:   $ROLE_UPPER Agent"
    echo "   Time:   $TIMESTAMP"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "   The AI agent MUST include this in their first response:"
    echo ""
    echo "   ## Session Verification"
    echo "   - Token: $TOKEN"
    echo "   - Role: $ROLE_UPPER Agent"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "   If the agent doesn't include this token, they may not have"
    echo "   properly read the governance files."
    echo ""
}

show_token() {
    if [ ! -f "$TOKEN_FILE" ]; then
        echo "No active session token."
        echo "Generate one with: $0 generate <role>"
        exit 0
    fi
    
    source "$TOKEN_FILE"
    
    NOW=$(date +%s)
    AGE=$(( (NOW - EPOCH) / 60 ))
    
    echo ""
    echo "Current Session Token"
    echo "━━━━━━━━━━━━━━━━━━━━━"
    echo "Token:   $TOKEN"
    echo "Role:    $ROLE Agent"
    echo "Created: $CREATED"
    echo "Age:     $AGE minutes"
    echo "Host:    $HOST"
    echo ""
    
    if [ $AGE -gt 120 ]; then
        echo "⚠️  Token is stale (> 2 hours). Consider regenerating."
    fi
    echo ""
}

verify_token() {
    local INPUT_TOKEN="$1"
    
    if [ -z "$INPUT_TOKEN" ]; then
        echo "Error: Token required"
        echo "Usage: $0 verify <token>"
        exit 1
    fi
    
    if [ ! -f "$TOKEN_FILE" ]; then
        echo "❌ No active session token to verify against."
        exit 1
    fi
    
    source "$TOKEN_FILE"
    
    if [ "$INPUT_TOKEN" = "$TOKEN" ]; then
        echo ""
        echo "✅ TOKEN VERIFIED"
        echo ""
        echo "   The agent correctly acknowledged the session token."
        echo "   Role: $ROLE Agent"
        echo ""
        exit 0
    else
        echo ""
        echo "❌ TOKEN MISMATCH"
        echo ""
        echo "   Expected: $TOKEN"
        echo "   Got:      $INPUT_TOKEN"
        echo ""
        echo "   The agent may not have properly read governance files,"
        echo "   or may be from a different session."
        echo ""
        exit 1
    fi
}

clear_token() {
    if [ -f "$TOKEN_FILE" ]; then
        rm -f "$TOKEN_FILE"
        echo "Session token cleared."
    else
        echo "No token to clear."
    fi
}

# Main
case "${1:-}" in
    generate)
        generate_token "$2"
        ;;
    show)
        show_token
        ;;
    verify)
        verify_token "$2"
        ;;
    clear)
        clear_token
        ;;
    *)
        echo "Session Token Management"
        echo ""
        echo "Usage:"
        echo "  $0 generate <role>  Generate new session token"
        echo "  $0 show             Show current token"
        echo "  $0 verify <token>   Verify a token"
        echo "  $0 clear            Clear current token"
        echo ""
        exit 1
        ;;
esac

