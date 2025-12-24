#!/bin/bash
# Vercel Production Deployment Script
# Run this from the project root directory

set -e

echo "🚀 Dawson Framework - Vercel Deployment"
echo "========================================"
echo ""

# Check if in correct directory
if [ ! -d "website" ]; then
    echo "❌ Error: Run this script from the project root (dawson-does-framework/)"
    exit 1
fi

# Check vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "📁 Changing to website directory..."
cd website

# Check if logged in
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo ""
    echo "⚠️  Not logged in to Vercel"
    echo ""
    echo "Please run: vercel login"
    echo "Then re-run this script."
    echo ""
    exit 1
fi

echo "✅ Logged in as: $(vercel whoami)"
echo ""

# Build check
echo "🔨 Verifying build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Fix errors and try again."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""

# Deploy
echo "🚀 Deploying to production..."
echo ""
vercel --prod

echo ""
echo "========================================"
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Check the deployment URL above"
echo "2. Run smoke tests: curl -s <url>/api/health"
echo "3. Test the configurator at <url>/configure"
echo ""

