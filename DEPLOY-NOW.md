# 🚀 Deploy ke Server - Quick Guide

## ✅ PRE-DEPLOYMENT CHECKLIST

### Files yang Sudah Diperbaiki:
- ✅ `config/database.php` - Sudah pakai env() bukan hardcoded
- ✅ `bootstrap/app.php` - Middleware sudah terdaftar lengkap
- ✅ `.env-server` - APP_DEBUG sudah false (production ready)

### Yang HARUS di-upload:
```
✅ Semua folder app/, config/, database/, routes/, resources/
✅ File .env-server (rename jadi .env di server)
✅ File composer.json & composer.lock
✅ Folder public/
✅ File bootstrap/app.php
✅ File artisan
✅ File .htaccess atau .htaccess.cpanel (pilih salah satu)
```

### Yang JANGAN di-upload:
```
❌ folder vendor/ (akan di-install di server)
❌ folder node_modules/
❌ file .env (lokal)
❌ folder storage/logs/* (biarkan kosong)
```

---

## 🔧 STEP-BY-STEP DEPLOYMENT

### **Step 1: Upload Files ke Server**
1. Connect ke server via FTP/SFTP atau cPanel File Manager
2. Upload semua files (kecuali yang di blacklist)
3. Pastikan upload ke root directory aplikasi (bukan public_html langsung)

### **Step 2: Setup Environment**
Di server, jalankan command:
```bash
# Rename .env-server jadi .env
mv .env-server .env

# Set permissions
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/

# Install dependencies
composer install --no-dev --optimize-autoloader

# ATAU jika composer memory limit:
php -d memory_limit=-1 /usr/local/bin/composer install --no-dev --optimize-autoloader
```

### **Step 3: Run Migrations & Setup**
```bash
# Generate app key (skip jika sudah ada di .env)
php artisan key:generate --force

# Clear cache dulu
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Run migrations
php artisan migrate --force

# Create super admin
php artisan make:superadmin itmaintainance@gmail.com SuperAdmin123! "IT Maintenance"

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### **Step 4: Setup Web Server**

#### Untuk cPanel/Shared Hosting:
```bash
# Gunakan .htaccess yang sudah disediakan
cp .htaccess.cpanel .htaccess

# ATAU jika masih error:
cp .htaccess.shared-hosting .htaccess
```

Pastikan **Document Root** mengarah ke folder `public/`

#### Untuk VPS (Apache):
Sudah ada `.htaccess` di root yang redirect ke `/public`

#### Untuk VPS (Nginx):
Tambahkan config:
```nginx
server {
    listen 80;
    server_name speed-api.syntax.co.id;
    root /path/to/app/public;
    
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

---

## 🧪 TESTING AFTER DEPLOYMENT

### Test 1: Laravel Responding
```bash
curl https://speed-api.syntax.co.id/
# Harus return HTML Laravel welcome
```

### Test 2: API Login
```bash
curl -X POST https://speed-api.syntax.co.id/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"itmaintainance@gmail.com","password":"SuperAdmin123!"}'
```
Harus return JSON dengan token

### Test 3: Database Connection
```bash
php artisan tinker --execute="echo 'Users: ' . App\Models\User::count();"
```

### Test 4: Browser Access
- Buka: `https://speed-api.syntax.co.id`
- Buka: `https://pagespeed.syntax.co.id` (frontend)
- Test login dengan super admin

---

## 🚨 TROUBLESHOOTING

### Error: "Class check.viewer.role does not exist"
✅ SUDAH DIPERBAIKI di `bootstrap/app.php`

### Error: "Access denied for user submitj1_speednew"
✅ SUDAH DIPERBAIKI di `config/database.php`

### Error: Still downloading PHP files
Coba:
```bash
# Gunakan .htaccess yang berbeda
cp .htaccess.simple .htaccess

# Atau tambahkan di .htaccess:
AddHandler application/x-httpd-php82 .php
```

### Error: Permission denied
```bash
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
chown -R www-data:www-data storage/ bootstrap/cache/
```

### Error: 500 Internal Server Error
```bash
# Check logs
tail -50 storage/logs/laravel.log

# Clear all cache
php artisan optimize:clear
```

---

## 📦 FRONTEND DEPLOYMENT

### Build Frontend:
```bash
cd frontend/
npm install
npm run build
```

### Upload:
- Upload folder `dist/` ke server frontend (pagespeed.syntax.co.id)
- Pastikan `dist/index.html` jadi root document

### Verify API URL:
File `frontend/src/services/api.ts` sudah configured ke:
```
https://speed-api.syntax.co.id
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Backend API responding (https://speed-api.syntax.co.id)
- [ ] API login works (return JSON token)
- [ ] Database connected (migrations ran)
- [ ] Super admin created
- [ ] Frontend loads (https://pagespeed.syntax.co.id)
- [ ] Frontend can login
- [ ] CORS working (no browser errors)
- [ ] All CRUD operations working

---

## 🎯 CREDENTIALS

### Super Admin:
- Email: `itmaintainance@gmail.com`
- Password: `SuperAdmin123!`

### Database:
- DB_DATABASE: `submitj1_speednew`
- DB_USERNAME: `submitj1_speednew`
- DB_PASSWORD: `dika170805?`

---

**Ready to deploy! Good luck! 🚀**
