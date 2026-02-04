#!/bin/bash

# Local Development Script for art0-NYU
# Runs the development server for local testing

set -e

echo "🎨 art0-NYU - Local Development"
echo "================================"
echo ""

# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the development server
echo "🔨 Starting dev server..."
echo "📍 Local: http://localhost:5173"
echo ""
npm run dev -- --open
