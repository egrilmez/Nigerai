# Naija GPT Chatbot

A beautiful AI chatbot interface with Nigerian flag colors (green and white) that connects to an Ollama AI service.

## 🚀 Quick Start

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/naija-gpt)

Or deploy manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

### Local Development

```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js
npx http-server -p 8000

# Option 3: Direct file
Open index.html in your browser
```

## ⚠️ IMPORTANT: CORS Configuration

For the chatbot to work, the Ollama server at `https://ollama-xoa4.onrender.com` needs to be configured with CORS headers.

### On the Ollama Server

The server needs to be started with CORS enabled:

```bash
# Allow all origins (development)
OLLAMA_ORIGINS="*" ollama serve

# Or for production (replace with your Vercel domain)
OLLAMA_ORIGINS="https://your-app.vercel.app" ollama serve
```

### Alternative: Environment Variable

```bash
export OLLAMA_ORIGINS="*"
ollama serve
```

## 📦 Pulling Models

Before using the chatbot, ensure models are available on the Ollama server:

```bash
# On the server running Ollama
ollama pull llama2
ollama pull mistral
ollama pull codellama
ollama pull tinyllama  # Smaller, faster model
```

## ✨ Features

- 🇳🇬 **Nigerian Flag Colors** - Green and white theme
- 💬 **Real-time Chat** - Streaming responses for better UX
- 🤖 **Multiple Models** - Switch between different AI models
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Fast & Lightweight** - No backend required
- 🎨 **Beautiful UI** - Smooth animations and transitions
- 🚫 **Cancel Requests** - Press ESC to stop generation

## 🛠️ Configuration

To change the Ollama server URL, edit `script.js`:

```javascript
const OLLAMA_API_URL = 'https://your-ollama-server.com';
```

## 📝 Environment Setup

No environment variables or backend setup required! The app runs entirely in the browser.

## 🔧 Troubleshooting

### "CORS Configuration Required"
The Ollama server needs to allow cross-origin requests. See CORS Configuration section above.

### "No models detected"
Models need to be pulled on the Ollama server first. Use `ollama pull [model-name]`.

### "Unable to connect"
1. Check if the Ollama service is running
2. Verify CORS is properly configured
3. Ensure you have internet connection

## 🏗️ Project Structure

```
naija-gpt/
├── index.html       # Main HTML file
├── styles.css       # Styling with Nigerian colors
├── script.js        # Chat logic and Ollama integration
├── vercel.json      # Vercel deployment config
├── package.json     # Project metadata
└── README.md        # Documentation
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy (no build settings needed)

### Netlify

1. Drag and drop the folder to Netlify
2. Or connect GitHub repository

### GitHub Pages

1. Enable GitHub Pages in repository settings
2. Select main branch and root folder

## 📄 License

MIT License - Feel free to use this project for any purpose!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 🇳🇬 About Naija GPT

Naija GPT celebrates Nigerian innovation in AI, featuring the vibrant colors of the Nigerian flag while providing a modern, accessible interface for AI interactions.