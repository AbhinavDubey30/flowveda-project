#!/bin/bash

# FlowVeda Backend Startup Script

echo "🚀 Starting FlowVeda Backend..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env from example..."
    cp .env.example .env
    echo "⚠️  Please configure .env with your settings"
fi

# Start the server
echo "🌐 Starting server on port ${PORT:-8000}..."
npm start

