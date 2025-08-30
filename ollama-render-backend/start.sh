#!/bin/bash

# Set up environment
export OLLAMA_HOST="0.0.0.0:${PORT:-11434}"
export OLLAMA_ORIGINS="*"
export OLLAMA_MODELS="/root/.ollama/models"

echo "========================================="
echo "Starting Ollama Server"
echo "========================================="
echo "Host: $OLLAMA_HOST"
echo "CORS: Enabled for all origins"
echo "Port: ${PORT:-11434}"
echo "========================================="

# Start Ollama server in background
ollama serve &
SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for Ollama to start..."
for i in {1..30}; do
    if curl -s http://localhost:${PORT:-11434}/ > /dev/null 2>&1; then
        echo "Ollama server is ready!"
        break
    fi
    echo "Waiting... ($i/30)"
    sleep 2
done

# Check if any models are installed
echo "Checking for installed models..."
MODELS=$(ollama list 2>/dev/null | tail -n +2)

if [ -z "$MODELS" ]; then
    echo "No models found. Pulling tinyllama (smallest model for quick start)..."
    ollama pull tinyllama || {
        echo "Warning: Could not pull tinyllama model"
        echo "You can pull models manually using the API"
    }
else
    echo "Found models:"
    echo "$MODELS"
fi

echo "========================================="
echo "Ollama is ready to receive requests!"
echo "API available at: http://0.0.0.0:${PORT:-11434}"
echo "========================================="

# Keep the server running
wait $SERVER_PID