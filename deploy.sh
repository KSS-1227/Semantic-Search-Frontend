#!/bin/bash

# ContentStack Launch Deployment Script
echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Verify build output
echo "✅ Verifying build output..."
if [ -d "dist" ]; then
    echo "✅ Build directory exists"
    ls -la dist/
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html found in build output"
    else
        echo "❌ index.html NOT found in build output"
        exit 1
    fi
else
    echo "❌ Build directory does not exist"
    exit 1
fi

echo "🎉 Deployment preparation complete!"
echo "📁 Serve files from: ./dist/"