#!/usr/bin/env bash

# start-viberpg.sh
# Simple helper script for starting the VibeRPG local dev environment.

set -euo pipefail

# Required SQLite mode only
: "${DATABASE_URL:=file:./dev.db}"

export DATABASE_URL

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$root_dir"

echo "🚀 Starting VibeRPG dev environment from $root_dir"

# Ensure Node version is supported
node_major=$(node -v | sed 's/v\([0-9]*\).*/\1/')
if [ "$node_major" -lt 20 ]; then
  echo "⚠️ Node version $(node -v) is unsupported. Please use Node 20+ (e.g. nvm install 24; nvm use 24)."
  exit 1
fi

# Ensure dependencies installed
echo "📦 Installing dependencies (if needed)"
if [ "${SKIP_DEP_INSTALL:-0}" = "0" ]; then
  npm config set legacy-peer-deps true
  npm install --legacy-peer-deps || {
    echo "⚠️ npm install failed, continuing with existing node_modules."
  }
else
  echo "ℹ️ SKIP_DEP_INSTALL=1 set; skipping npm install."
fi

# Validate database config
if [ -z "${DATABASE_URL:-}" ]; then
  echo "⚠️  DATABASE_URL is not set. Export it before running this script."
  echo "Example: export DATABASE_URL='file:./dev.db'"
  exit 1
fi

echo "ℹ️  SQLite active; using DATABASE_URL=$DATABASE_URL"

# Push DB schema
echo "🗄️  Pushing database schema"
npm --workspace @workspace/db run push

# Start API server in background
echo "🌐 Starting API server (localhost:8080)"
PORT=8080 npm --workspace @workspace/api-server run dev &
api_pid=$!

# Start web client server in background
echo "🌍 Starting browser web client (localhost:5173)"
PORT=5173 npm --workspace @workspace/mockup-sandbox run dev &
web_pid=$!

echo "✅ Servers started. API PID=$api_pid, Web PID=$web_pid"

echo "Press CTRL-C to stop"

trap 'echo "\nStopping servers..."; kill $api_pid $web_pid; exit' INT TERM

# Wait for background processes
wait $api_pid $web_pid
