#!/bin/bash

# Custom entrypoint script to handle permissions before starting OpenEMR

echo "Setting up permissions for OpenEMR..."

# Set execute permissions on shell scripts
find /var/www/localhost/htdocs/openemr -name "*.sh" -type f -exec chmod +x {} \; 2>/dev/null || true

# Set ownership of the OpenEMR directory, excluding .git
find /var/www/localhost/htdocs/openemr -not -path "/var/www/localhost/htdocs/openemr/.git*" -exec chown ${UID:-1000}:${GID:-1000} {} \; 2>/dev/null || true

# Set proper permissions on .git directory to read-only
chmod -R 444 /var/www/localhost/htdocs/openemr/.git 2>/dev/null || true

echo "Permissions set up complete. Starting OpenEMR..."

# Execute the original entrypoint
exec "$@" 