#!/bin/bash

# Start Ollama with CORS enabled
export OLLAMA_ORIGINS="*"
export OLLAMA_HOST="0.0.0.0:${PORT:-11434}"

echo "Starting Ollama on port ${PORT:-11434}..."
echo "CORS enabled for: $OLLAMA_ORIGINS"

# Start Ollama server
ollama serve &
SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for Ollama to start..."
sleep 10

# Pull a default model if none exist
echo "Checking for models..."
if ! ollama list | grep -q "llama2"; then
    echo "Pulling llama2 model (this may take a while)..."
    ollama pull llama2
fi

# Keep the server running
echo "Ollama is ready!"
wait $SERVER_PID