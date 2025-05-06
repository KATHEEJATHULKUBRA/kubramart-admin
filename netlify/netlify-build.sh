#!/bin/bash

# This script helps prepare the build for Netlify deployment

echo "Starting Netlify build process for Kubra Market Admin..."

# Create production .env file from environment variables
echo "Creating .env file from Netlify environment variables..."
echo "NODE_ENV=production" > .env
echo "SESSION_SECRET=$SESSION_SECRET" >> .env
echo "DATABASE_URL=$DATABASE_URL" >> .env

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run the build
echo "Building application..."
npm run build

echo "Build completed successfully!"