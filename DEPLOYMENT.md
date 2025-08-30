# 🚀 Deployment Guide for n**AI**ja GPT

## Complete Setup Process

### Step 1: Deploy Ollama Backend to Render

1. **Navigate to the backend folder**:
   ```bash
   cd ollama-render-backend/
   ```

2. **Initialize Git and push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial Ollama backend setup"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ollama-backend.git
   git push -u origin main
   ```

3. **Deploy on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **"New +" → "Web Service"**
   - Connect your GitHub repo
   - Select the `ollama-backend` repository
   - Configure:
     - Name: `ollama-naija-api`
     - Region: Choose closest
     - Runtime: **Docker**
     - Plan: **Free** (or Starter for $7/month)
   - Click **"Create Web Service"**
   - Wait 5-10 minutes for deployment

4. **Note your API URL**: 
   `https://ollama-naija-api.onrender.com` (or your chosen name)

### Step 2: Update Frontend

1. **Update the API URL in script.js**:
   ```javascript
   const OLLAMA_API_URL = 'https://ollama-naija-api.onrender.com';
   ```

2. **Commit the change**:
   ```bash
   git add script.js
   git commit -m "Update Ollama API endpoint"
   git push
   ```

### Step 3: Deploy Frontend to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow prompts**:
   - Set up and deploy? **Y**
   - Which scope? **Your account**
   - Link to existing project? **N**
   - Project name? **naija-gpt**
   - Directory? **./** (current)
   - Override settings? **N**

4. **Your frontend is now live!**
   Example: `https://naija-gpt.vercel.app`

### Step 4: Test Everything

1. **Test backend API**:
   ```bash
   curl https://ollama-naija-api.onrender.com/api/tags
   ```

2. **Pull a model** (if needed):
   ```bash
   curl -X POST https://ollama-naija-api.onrender.com/api/pull \
     -H "Content-Type: application/json" \
     -d '{"name": "tinyllama"}'
   ```

3. **Visit your frontend**:
   Open `https://naija-gpt.vercel.app` in your browser

## 🔧 Troubleshooting

### Backend Issues

**502 Bad Gateway**:
- Check Render logs
- Redeploy the service
- Ensure Docker runtime is selected

**No models available**:
```bash
# Pull tinyllama (smallest)
curl -X POST https://your-api.onrender.com/api/pull \
  -d '{"name": "tinyllama"}'
```

### Frontend Issues

**CORS errors**:
- Backend should have `OLLAMA_ORIGINS="*"` set
- Check if backend is running
- Verify API URL is correct

**Can't connect**:
- Check if backend URL is correct in script.js
- Ensure backend is deployed and running
- Check browser console for errors

## 📊 Monitoring

- **Backend logs**: Render Dashboard → Your Service → Logs
- **Frontend logs**: Vercel Dashboard → Your Project → Functions
- **API Health**: Visit `https://your-api.onrender.com/`

## 🔄 Updating

### Update Backend:
```bash
cd ollama-render-backend/
git add .
git commit -m "Update"
git push
# Render auto-deploys
```

### Update Frontend:
```bash
git add .
git commit -m "Update"
git push
vercel --prod
```

## 💰 Costs

- **Render Free**: 750 hours/month (sleeps after 15 min inactivity)
- **Render Starter**: $7/month (always on, better performance)
- **Vercel Free**: Unlimited for personal use
- **Total**: $0-7/month

## 🎉 Success!

Your n**AI**ja GPT is now live with:
- ✅ Ollama backend with CORS enabled
- ✅ Frontend deployed on Vercel
- ✅ No proxy needed
- ✅ Ready for users worldwide!