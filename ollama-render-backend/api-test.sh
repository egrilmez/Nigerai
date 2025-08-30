#!/bin/bash

# Simple API test script
API_URL="${1:-http://localhost:11434}"

echo "Testing Ollama API at: $API_URL"
echo "================================="

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s "$API_URL/" && echo " ✓ Health check passed" || echo " ✗ Health check failed"

echo ""
echo "2. Checking available models..."
curl -s "$API_URL/api/tags" | python3 -m json.tool

echo ""
echo "3. Pulling tinyllama model (if not exists)..."
curl -X POST "$API_URL/api/pull" \
  -H "Content-Type: application/json" \
  -d '{"name": "tinyllama", "stream": false}' 

echo ""
echo "4. Testing text generation..."
curl -X POST "$API_URL/api/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tinyllama",
    "prompt": "Hello, how are you?",
    "stream": false
  }' | python3 -m json.tool

echo ""
echo "================================="
echo "API test complete!"