#!/bin/bash

PORT=${1:-3000}
BASE_URL="http://localhost:$PORT"

echo "Testing API endpoints at $BASE_URL"
echo ""

echo "=== Test 1: Save project ==="
RESPONSE=$(curl -L -X POST $BASE_URL/api/projects/save \
  -H "Content-Type: application/json" \
  -d '{"template":"saas","project_name":"test-api-endpoints","output_dir":"./test"}' \
  -s)
echo "$RESPONSE" | grep -q '"success":true' && echo "✓ Save successful" || echo "✗ Save failed"
TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"

echo ""
echo "=== Test 2: Fetch project ==="
FETCH_RESPONSE=$(curl -L $BASE_URL/api/projects/$TOKEN -s)
echo "$FETCH_RESPONSE" | grep -q '"success":true' && echo "✓ Fetch successful" || echo "✗ Fetch failed"
echo "$FETCH_RESPONSE" | grep -q '"project_name":"test-api-endpoints"' && echo "✓ Correct project data" || echo "✗ Wrong project data"

echo ""
echo "=== Test 3: Download endpoint ==="
DOWNLOAD_RESPONSE=$(curl -L $BASE_URL/api/projects/$TOKEN/download -s)
echo "$DOWNLOAD_RESPONSE" | grep -q '"version":"1.0.0"' && echo "✓ Download successful" || echo "✗ Download failed"
echo "$DOWNLOAD_RESPONSE" | grep -q '"template":"saas"' && echo "✓ Correct template" || echo "✗ Wrong template"

echo ""
echo "=== Test 4: Invalid token (should be 404) ==="
INVALID_RESPONSE=$(curl -L $BASE_URL/api/projects/invalid-token-999 -s)
echo "$INVALID_RESPONSE" | grep -q '"error":"Not found"' && echo "✓ 404 error returned" || echo "✗ Wrong error response"

echo ""
echo "=== Test 5: Validation - missing project_name ==="
VALIDATION_RESPONSE=$(curl -L -X POST $BASE_URL/api/projects/save \
  -H "Content-Type: application/json" \
  -d '{"template":"saas"}' \
  -s)
echo "$VALIDATION_RESPONSE" | grep -q '"error":"Validation failed"' && echo "✓ Validation error returned" || echo "✗ Wrong validation response"
echo "$VALIDATION_RESPONSE" | grep -q '"message":"Project name is required"' && echo "✓ Correct error message" || echo "✗ Wrong error message"

echo ""
echo "=== Test 6: CORS headers ==="
CORS_RESPONSE=$(curl -L -X OPTIONS $BASE_URL/api/projects/save -I -s | grep -i "access-control")
[ ! -z "$CORS_RESPONSE" ] && echo "✓ CORS headers present" || echo "✗ CORS headers missing"

echo ""
echo "All tests completed!"
