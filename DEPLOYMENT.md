# QuizMaster Deployment Guide

## Option 1: Vercel (Recommended - Free)

### Method A: Vercel Web Interface (Easiest)
1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Set environment variables:
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API key
   - `VITE_GEMINI_MODEL`: gemini-1.5-flash (optional)
5. Click "Deploy"

### Method B: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Option 2: Netlify (Alternative - Free)

### Method A: Netlify Web Interface
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "New site from Git"
3. Connect your GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in Site settings > Environment variables
6. Deploy

### Method B: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

## Option 3: GitHub Pages (Free)

1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Source: GitHub Actions
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Environment Variables Required

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key
- `VITE_GEMINI_MODEL`: gemini-1.5-flash (optional, defaults to gemini-1.5-flash)

## Important Security Note

⚠️ **Warning**: This app exposes your API key in the client-side code. For production use, consider:
1. Using a backend proxy to hide the API key
2. Implementing rate limiting
3. Using environment-specific API keys with restricted permissions
