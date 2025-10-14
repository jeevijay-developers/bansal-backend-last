#!/bin/bash

cd /var/www/bansal/bansaladmin || {
  echo "❌ Failed to cd into project directory"
  exit 1
}

# Debug: Show current directory
echo "📁 Current directory: $(pwd)"

# Clear any possibly inherited GIT_DIR
unset GIT_DIR

# Pull latest changes
echo "🔄 Pulling from git..."
git pull origin master

# Restart PM2 app
echo "🚀 Restarting app via PM2..."
pm2 restart bansalapp

