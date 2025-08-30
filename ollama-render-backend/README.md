# Ollama Backend for n**AI**ja GPT

This is the Ollama API backend for n**AI**ja GPT, configured with CORS support for web deployment.

## 🚀 Quick Deploy to Render

### Option 1: Deploy with Render Blueprint (Easiest)

1. **Fork/Clone this repository** to your GitHub account
2. **Go to [Render Dashboard](https://dashboard.render.com)**
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub account and select this repository
5. Configure:
   - **Name**: `ollama-api-naija` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Runtime**: `Docker`
   - **Instance Type**: `Free` (or `Starter` for better performance)
6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. Your API will be available at: `https://[your-service-name].onrender.com`

### Option 2: Deploy with Render CLI

```bash
# Install Render CLI
brew install render/render/render

# Deploy
render blueprint launch
```

## 📝 Environment Variables

These are already configured in the Dockerfile, but you can override in Render dashboard:

- `OLLAMA_ORIGINS` - CORS origins (default: `*` for all origins)
- `OLLAMA_HOST` - Host binding (default: `0.0.0.0`)
- `PORT` - Automatically set by Render

## 🔧 Post-Deployment Setup

### 1. Pull a Model

After deployment, you need to pull at least one model. The startup script will try to pull `tinyllama` automatically.

To pull additional models via API:

```bash
# Pull a model
curl -X POST https://your-service.onrender.com/api/pull \
  -H "Content-Type: application/json" \
  -d '{"name": "llama2"}'

# Check available models
curl https://your-service.onrender.com/api/tags
```

### 2. Update Your Frontend

Update the `OLLAMA_API_URL` in your n**AI**ja GPT frontend:

```javascript
const OLLAMA_API_URL = 'https://your-service.onrender.com';
```

## 📊 Available Models

Recommended models by size:

- **tinyllama** (637MB) - Fastest, good for testing
- **phi** (1.6GB) - Small but capable
- **mistral** (4.1GB) - Good balance
- **llama2** (3.8GB) - Popular choice
- **codellama** (3.8GB) - For code generation

## 🔍 API Endpoints

- `GET /` - Health check
- `GET /api/tags` - List available models
- `POST /api/pull` - Pull a new model
- `POST /api/generate` - Generate text
- `POST /api/chat` - Chat completion

## 🚨 Troubleshooting

### Service won't start
- Check Render logs for errors
- Ensure Docker runtime is selected
- Try redeploying

### CORS errors
- Verify `OLLAMA_ORIGINS` is set correctly
- For production, set it to your frontend domain

### No models available
- Models need to be pulled after first deployment
- Use the pull endpoint or SSH into container

### Slow responses
- Free tier has limited resources
- Consider upgrading to Starter ($7/month)
- Use smaller models like tinyllama

## 🔄 Updating

To update Ollama version:

1. Update the Dockerfile if needed
2. Push to GitHub
3. Render will auto-deploy if enabled

## 📈 Monitoring

- Check service health: `https://your-service.onrender.com/`
- View logs in Render dashboard
- Monitor metrics in Render dashboard

## 🛡️ Security

For production:
1. Change `OLLAMA_ORIGINS` from `*` to your specific domain
2. Add authentication if needed
3. Use environment variables for sensitive data

## 💰 Cost

- **Free Tier**: 750 hours/month (perfect for testing)
- **Starter**: $7/month (better performance, always on)
- **Standard**: $25/month (production ready)

## 📞 Support

- [Ollama Documentation](https://github.com/ollama/ollama)
- [Render Documentation](https://render.com/docs)
- Create an issue in this repository