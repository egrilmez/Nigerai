# NigeriaAI Chatbot

A beautiful chatbot interface with Nigerian flag colors that connects to an Ollama AI service.

## Quick Start

### Option 1: Direct Browser (Simplest)
Just open `index.html` in your browser and use `http://localhost:3000` as the proxy (see proxy setup below).

### Option 2: With Local Server
```bash
# Start web server
python3 -m http.server 8000

# In another terminal, start the proxy server (required for CORS)
node proxy-server.js

# Open browser to http://localhost:8000
```

## CORS Proxy Setup

Due to CORS restrictions, you need to run the proxy server:

```bash
node proxy-server.js
```

This will start a proxy on `http://localhost:3000` that forwards requests to your Ollama service.

## Pulling Models

Your Ollama service needs models. To pull a model:

```bash
# Pull Llama 2 (recommended)
curl -X POST http://localhost:3000/api/pull -d '{"name": "llama2"}'

# Or pull a smaller model
curl -X POST http://localhost:3000/api/pull -d '{"name": "tinyllama"}'

# Or Mistral
curl -X POST http://localhost:3000/api/pull -d '{"name": "mistral"}'
```

## Features

- 🇳🇬 Nigerian flag color scheme (green and white)
- 💬 Real-time chat interface
- 🤖 Multiple model support
- 📱 Responsive design
- ⚡ Typing indicators
- 🎨 Beautiful UI with smooth animations

## Troubleshooting

1. **"No models detected"**: Pull a model using the commands above
2. **"Unable to connect"**: Make sure the proxy server is running (`node proxy-server.js`)
3. **Model not responding**: The model might still be downloading, wait a few minutes

## Requirements

- Node.js (for the proxy server)
- Python 3 or any web server (optional, for serving files)
- Internet connection to reach the Ollama service