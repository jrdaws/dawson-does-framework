#!/bin/bash

# Prepare for Vercel Deployment
# This script helps you commit changes and prepare for deployment

set -e

echo "🚀 Preparing for Vercel Deployment"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the website directory"
    exit 1
fi

echo "✅ In correct directory"
echo ""

# Check if git repo
cd ..
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Show current status
echo "📋 Current changes:"
git status --short website/
echo ""

# Check for uncommitted changes
if [[ -n $(git status --porcelain website/) ]]; then
    echo "📝 You have uncommitted changes in website/"
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "Committing changes..."
        git add website/
        git commit -m "feat: production-ready deployment configuration

- Added Upstash Redis rate limiting
- Enhanced error handling for production
- Added cost control safeguards
- Created comprehensive deployment documentation
- Ready for Vercel deployment"
        echo "✅ Changes committed"
    else
        echo "⚠️  Changes not committed. Commit them before deploying."
    fi
else
    echo "✅ No uncommitted changes"
fi

echo ""
echo "📦 Checking dependencies..."
cd website
if [ ! -d "node_modules/@upstash/redis" ]; then
    echo "⚠️  Missing @upstash/redis package"
    echo "   Installing..."
    npm install @upstash/redis
    echo "✅ Dependencies installed"
else
    echo "✅ All dependencies present"
fi

echo ""
echo "🏗️  Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
fi

echo ""
echo "=================================="
echo "✅ Ready for Deployment!"
echo "=================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Push to GitHub:"
echo "   cd /Users/joseph.dawson/Documents/dawson-does-framework"
echo "   git push origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   • Go to: https://vercel.com/new"
echo "   • Import your GitHub repository"
echo "   • Set root directory to: website"
echo "   • Add environment variable: ANTHROPIC_API_KEY"
echo "   • Click Deploy"
echo ""
echo "3. Or use Vercel CLI:"
echo "   cd website"
echo "   vercel --prod"
echo ""
echo "📖 Full guide: website/DEPLOY_NOW.md"
echo ""
