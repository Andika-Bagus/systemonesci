#!/bin/bash

echo "🚀 Starting Laravel Application..."

# Set permissions
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/

# Clear cache safely
rm -rf bootstrap/cache/*.php 2>/dev/null
rm -rf storage/framework/cache/data/* 2>/dev/null
rm -rf storage/framework/sessions/* 2>/dev/null
rm -rf storage/framework/views/*.php 2>/dev/null

# Create cache directories
mkdir -p bootstrap/cache
mkdir -p storage/framework/cache/data
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs

# Set permissions again
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/

# Generate key if needed
if ! grep -q "APP_KEY=base64:" .env; then
    php artisan key:generate --force
fi

# Run migrations if needed
php artisan migrate --force 2>/dev/null || echo "Migrations already up to date"

# Create super admin if not exists
php artisan make:superadmin itmaintainance@gmail.com SuperAdmin123! "IT Maintenance" 2>/dev/null || echo "Super admin already exists"

echo "✅ Laravel Application Ready!"
echo "🌐 Access: https://speed-api.syntax.co.id"
echo "👤 Login: itmaintainance@gmail.com / SuperAdmin123!"