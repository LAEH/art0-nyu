#!/bin/bash

# Deployment Script for art0-NYU
# Builds and deploys the application to Firebase Hosting
# Project: art0-nyu

set -e

echo "🎨 art0-NYU - Deployment"
echo "================================"
echo ""

# Check dependencies
echo "📦 Checking dependencies..."
npm install
echo ""

# Build the project with performance optimizations
echo "🔨 Building project..."
echo "   ⚡ Optimizing images and assets..."
npm run build
echo ""

# Verify build output
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

# Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy --only hosting

# Get Firebase project info
PROJECT_ID=$(grep -A 1 '"projects"' .firebaserc 2>/dev/null | grep '"default"' | sed 's/.*: "\(.*\)".*/\1/' || echo "art0-nyu")

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app is live at: https://${PROJECT_ID}.web.app"
echo ""
echo "📊 Performance optimizations:"
echo "   • Progressive image loading"
echo "   • 60fps+ animations"
echo "   • Responsive srcset (290w, 580w, 1450w, 2000w)"
echo "   • Browser-specific tier adaptation"
echo ""
