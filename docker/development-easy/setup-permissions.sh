#!/bin/bash

# Script to set up proper permissions for OpenEMR development environment
# This script sets the UID and GID environment variables to match your user

echo "Setting up permissions for OpenEMR development environment..."

# Get current user's UID and GID
CURRENT_UID=$(id -u)
CURRENT_GID=$(id -g)

echo "Current user UID: $CURRENT_UID"
echo "Current user GID: $CURRENT_GID"

# Export the variables for docker-compose
export UID=$CURRENT_UID
export GID=$CURRENT_GID

echo "Environment variables set:"
echo "UID=$UID"
echo "GID=$GID"

echo ""
echo "You can now run: docker-compose up -d"
echo "Or if you want to see the logs: docker-compose up" 