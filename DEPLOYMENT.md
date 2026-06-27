# Deployment Checklist

## Pre-Deployment Checklist ✅

### 0. **PHP Version Compatibility** 🚨
- ✅ **IMPORTANT:** Server PHP version: 8.2.29
- ✅ Composer.json sudah disesuaikan untuk PHP ^8.2
- ✅ Laravel Framework diturunkan ke v11 (kompatibel dengan PHP 8.2)
- ✅ Script fix-php-version tersedia untuk deployment

### 1. **Environment Configuration**
- ✅ Production `.env` sudah dikonfigurasi
- ✅ `APP_ENV=production`
- ✅ `APP_DEBUG=false`
- ✅ `APP_URL=https://speed-api.syntax.co.id`
- ✅ `FRONTEND_URL=https://pagespeed.syntax.co.id`

### 2. **Database Configuration**
- ✅ Database MySQL production sudah dikonfigurasi
- ✅ Credentials database sudah benar
- ✅ Migrations siap dijalankan

### 3. **Security Configuration**
- ✅ `APP_KEY` sudah di-generate
- ✅ Session domain: `.syntax.co.id`
- ✅ Secure cookies enabled
- ✅ CORS dikonfigurasi untuk domain production

### 4. **User Management**
- ✅ Super Admin user sudah dibuat
- ✅ Email: `itmaintainance@gmail.com`
- ✅ Password: `SuperAdmin123!`

### 5. **API Configuration**
- ✅ Rate limiting dikonfigurasi
- ✅ Sanctum stateful domains sudah benar
- ✅ Security headers dikonfigurasi

## Deployment Steps

### 1. **Upload Files**
```bash
# Upload semua file ke server
# Pastikan folder vendor/ tidak di-upload (akan di-generate)
```

### 2. **Server Setup**
```bash
# IMPORTANT: Fix PHP compatibility first!
chmod +x fix-php-version.sh
./fix-php-version.sh

# OR on Windows:
fix-php-version.bat

# Manual steps if script doesn't work:
rm -rf vendor/ composer.lock
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
php artisan make:superadmin itmaintainance@gmail.com SuperAdmin123! "IT Maintenance"
php artisan config:cache
php artisan route:cache

# Set permissions
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
```

### 3. **Web Server Configuration**

#### Apache (.htaccess)
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name speed-api.syntax.co.id;
    root /path/to/your/app/public;
    
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### 4. **SSL Certificate**
```bash
# Install SSL certificate untuk speed-api.syntax.co.id
# Pastikan HTTPS berfungsi dengan baik
```

### 5. **Frontend Deployment**
```bash
# Build frontend dengan environment production
npm run build

# Upload build files ke pagespeed.syntax.co.id
# Pastikan API URL mengarah ke speed-api.syntax.co.id
```

## Post-Deployment Verification

### 1. **Test API Endpoints**
```bash
# Test login
curl -X POST https://speed-api.syntax.co.id/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"itmaintainance@gmail.com","password":"SuperAdmin123!"}'

# Test protected endpoint
curl -X GET https://speed-api.syntax.co.id/api/websites \
  -H "Authorization: Bearer {token}"
```

### 2. **Test Frontend**
- ✅ Akses https://pagespeed.syntax.co.id
- ✅ Test login dengan super admin
- ✅ Test semua fitur utama

### 3. **Test CORS**
- ✅ Pastikan frontend bisa komunikasi dengan API
- ✅ No CORS errors di browser console

## Troubleshooting Commands

```bash
# Clear all cache
php artisan optimize:clear

# Check logs
tail -f storage/logs/laravel.log

# Check database connection
php artisan tinker --execute="DB::connection()->getPdo();"

# Recreate super admin if needed
php artisan make:superadmin itmaintainance@gmail.com SuperAdmin123! "IT Maintenance"

# Clear rate limiting
php artisan auth:clear-rate-limit
```

## Important Files for Production

### Required Files:
- ✅ `.env` (production config)
- ✅ `composer.json` & `composer.lock`
- ✅ All `app/` files
- ✅ All `config/` files
- ✅ All `database/` files
- ✅ All `routes/` files
- ✅ `public/` folder

### Generated on Server:
- `vendor/` (via composer install)
- `bootstrap/cache/` (via artisan cache)
- `storage/framework/cache/` (auto-generated)

## Security Notes

1. **Never commit `.env` to git**
2. **Use strong passwords in production**
3. **Enable HTTPS only**
4. **Monitor logs regularly**
5. **Keep Laravel updated**

## Backup Strategy

1. **Database backup** - Daily automated backup
2. **File backup** - Weekly full backup
3. **Config backup** - Before any changes

Ready for deployment! 🚀