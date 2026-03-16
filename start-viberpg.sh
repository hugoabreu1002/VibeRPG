#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting VibeRPG..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start the web dev server
echo "🌐 Starting web dev server..."
npm run dev

echo "✨ VibeRPG is running!"
