# QuizMaster - Render Deployment Guide

## Quick Deploy to Render

### Method 1: One-Click Deploy (Easiest)
1. Click this button: [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/YOUR_USERNAME/quizmaster-react-gemini)
2. Sign up/Login to Render
3. Connect your GitHub account
4. Set environment variables:
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API key
   - `VITE_GEMINI_MODEL`: gemini-1.5-flash (optional)
5. Click "Deploy Web Service"

### Method 2: Manual Deploy via Render Dashboard

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign up/Login with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your `quizmaster-react-gemini` repository

3. **Configure Build Settings**
   - **Name**: quizmaster-react-gemini (or any name you prefer)
   - **Environment**: Static Site
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: 18 (or latest)

4. **Set Environment Variables**
   - Go to Environment tab
   - Add these variables:
     - `VITE_GEMINI_API_KEY`: Your Google Gemini API key
     - `VITE_GEMINI_MODEL`: gemini-1.5-flash (optional)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete (usually 2-5 minutes)
   - Your app will be available at the provided URL

### Method 3: Using Render CLI (Advanced)

```bash
# Install Render CLI
npm install -g @render/cli

# Login to Render
render auth login

# Deploy (if you have render.yaml configured)
render deploy
```

## Environment Variables Required

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key | Yes | - |
| `VITE_GEMINI_MODEL` | Gemini model to use | No | gemini-1.5-flash |

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy the key and use it as `VITE_GEMINI_API_KEY`

## Post-Deployment

After successful deployment:
1. Your app will be available at `https://your-app-name.onrender.com`
2. The URL will be shown in your Render dashboard
3. You can set up a custom domain if needed
4. Monitor logs in the Render dashboard

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure Node.js version is compatible (18+)
- Check build logs in Render dashboard

### App Doesn't Load
- Verify environment variables are set correctly
- Check that `VITE_GEMINI_API_KEY` is valid
- Look at browser console for errors

### API Key Issues
- Ensure the API key has proper permissions
- Check if the key is correctly set in environment variables
- Verify the key is not expired

## Security Notes

⚠️ **Important**: This app exposes your API key in client-side code. For production:
- Consider using a backend proxy
- Implement rate limiting
- Use restricted API keys
- Monitor API usage

## Free Tier Limits

Render's free tier includes:
- 750 hours/month
- Automatic sleep after 15 minutes of inactivity
- Custom domains supported
- HTTPS included
- Global CDN
