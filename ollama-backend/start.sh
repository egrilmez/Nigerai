#!/bin/bash

# Use PORT from Render environment
export OLLAMA_HOST="0.0.0.0:${PORT:-11434}"
export OLLAMA_ORIGINS="*"

echo "Starting Ollama on $OLLAMA_HOST"
echo "CORS enabled for all origins"

# Start Ollama
ollama serve &
OLLAMA_PID=$!

# Wait for service to be ready
sleep 5

# Check if llama2 model exists, if not pull it
echo "Checking models..."
if ! ollama list 2>/dev/null | grep -q "llama2"; then
    echo "Pulling llama2 model..."
    ollama pull llama2 || echo "Failed to pull model, continuing anyway"
fi

echo "Ollama is ready!"
echo "Available at: $OLLAMA_HOST"

# Keep the service running
wait $OLLAMA_PID