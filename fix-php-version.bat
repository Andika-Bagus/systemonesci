@echo off
echo 🔧 Fixing PHP version compatibility...

:: Remove vendor and composer.lock
echo Removing vendor directory and composer.lock...
if exist "vendor" rmdir /s /q "vendor"
if exist "composer.lock" del "composer.lock"

:: Update composer dependencies
echo Installing compatible dependencies for PHP 8.2...
composer install --no-dev --optimize-autoloader

:: Generate application key if needed
echo Generating application key...
php artisan key:generate --force

:: Clear all caches
echo Clearing caches...
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

:: Run migrations
echo Running migrations...
php artisan migrate --force

:: Create super admin
echo Creating super admin...
php artisan make:superadmin itmaintainance@gmail.com SuperAdmin123! "IT Maintenance"

:: Cache config for production
echo Caching configuration...
php artisan config:cache
php artisan route:cache

echo ✅ PHP version compatibility fixed!
echo 🚀 Application ready for deployment!
pause