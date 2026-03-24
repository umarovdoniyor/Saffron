#!/bin/bash

set -euo pipefail

# Optional pull step (enable if this script runs from CI or directly on server)
# git pull origin main

echo "Installing dependencies..."
yarn install --frozen-lockfile

echo "Building frontend..."
yarn build

echo "Starting/reloading PM2 app..."
if pm2 describe BURAK-REACT >/dev/null 2>&1; then
	pm2 restart BURAK-REACT --update-env
else
	pm2 start ecosystem.config.cjs
fi

pm2 save
pm2 status
