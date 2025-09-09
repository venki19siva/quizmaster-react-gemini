#!/bin/bash

echo "🚀 QuizMaster - Render Deployment Helper"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Check if dist directory exists
if [ -d "dist" ]; then
    echo "✅ Build output directory 'dist' created successfully"
    echo "📁 Contents of dist directory:"
    ls -la dist/
else
    echo "❌ Build output directory 'dist' not found"
    exit 1
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://render.com"
echo "2. Sign up/Login with GitHub"
echo "3. Click 'New +' → 'Web Service'"
echo "4. Connect your GitHub repository"
echo "5. Configure:"
echo "   - Environment: Static Site"
echo "   - Build Command: npm install && npm run build"
echo "   - Publish Directory: dist"
echo "6. Add environment variables:"
echo "   - VITE_GEMINI_API_KEY: Your Gemini API key"
echo "   - VITE_GEMINI_MODEL: gemini-1.5-flash (optional)"
echo "7. Click 'Create Web Service'"
echo ""
echo "📖 For detailed instructions, see RENDER_DEPLOYMENT.md"
