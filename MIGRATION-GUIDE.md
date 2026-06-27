# 🔄 Migration Guide: Server Lama → Server Baru

## 📌 Overview
Migrasi dari:
- **Server Lama:** speed-api.syntax.co.id
- **Server Baru:** Domain ITM (domain baru)
- **Metode:** Upload files + Import database

---

## 🎯 CHECKLIST SEBELUM MIGRASI

### Di Server Lama:
- [ ] Export database `submitj1_speednew` ke file .sql
- [ ] Backup semua files aplikasi (optional, sudah ada lokal)
- [ ] Catat semua credentials & API keys

### Di Server Baru:
- [ ] Domain sudah pointing ke server
- [ ] SSL certificate sudah terinstall
- [ ] PHP 8.2+ sudah terinstall
- [ ] MySQL/MariaDB sudah terinstall
- [ ] Composer sudah terinstall

---

## 📦 STEP-BY-STEP MIGRATION

### **STEP 1: Export Database dari Server Lama**

#### Via SSH:
```bash
# Login ke server lama
ssh user@old-server

# Export database
mysqldump -u submitj1_speednew -p submitj1_speednew > database_backup.sql

# Download ke lokal
scp user@old-server:/path/to/database_backup.sql ./
```

#### Via phpMyAdmin:
1. Login phpMyAdmin server lama
2. Pilih database `submitj1_speednew`
3. Klik tab **Export**
4. Pilih **Quick** export method
5. Format: **SQL**
6. Klik **Go** dan download file

---

### **STEP 2: Setup Database di Server Baru**

#### Via cPanel:
1. Login cPanel server baru
2. Buka **MySQL Databases**
3. **Create New Database:**
   - Nama: `itm_database` (atau sesuai keinginan)
   - Klik **Create Database**

4. **Create Database User:**
   - Username: `itm_user` (atau sesuai keinginan)
   - Password: [generate strong password]
   - Klik **Create User**

5. **Add User to Database:**
   - User: `itm_user`
   - Database: `itm_database`
   - Privileges: **ALL PRIVILEGES**
   - Klik **Make Changes**

6. **Import Database:**
   - Buka **phpMyAdmin**
   - Pilih database `itm_database`
   - Tab **Import**
   - Choose file: `database_backup.sql`
   - Klik **Go**

#### Via SSH:
```bash
# Login ke server baru
ssh user@new-server

# Create database
mysql -u root -p
CREATE DATABASE itm_database;
CREATE USER 'itm_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON itm_database.* TO 'itm_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import database
mysql -u itm_user -p itm_database < database_backup.sql
```

---

### **STEP 3: Update Environment Configuration**

Edit file `.env-migration-template` yang sudah dibuat:

```env
# ============================================
# GANTI NILAI-NILAI INI SESUAI SERVER BARU:
# ============================================

# Backend URL (API)
APP_URL=https://api.itm.yourdomain.com

# Database credentials (dari step 2)
DB_DATABASE=itm_database
DB_USERNAME=itm_user
DB_PASSWORD=your_strong_password_here

# Session domain
SESSION_DOMAIN=.itm.yourdomain.com

# CORS & Sanctum domains
SANCTUM_STATEFUL_DOMAINS=itm.yourdomain.com,api.itm.yourdomain.com

# Frontend URL
FRONTEND_URL=https://itm.yourdomain.com
```

**Save as:** `.env-production-new`

---

### **STEP 4: Upload Files ke Server Baru**

#### Files yang HARUS di-upload:
```
✅ app/                    (semua folder)
✅ bootstrap/
   ├── app.php            (sudah ada middleware fix)
   └── cache/             (buat folder kosong)
✅ config/                 (sudah ada database.php fix)
✅ database/
   └── migrations/        (untuk reference)
✅ public/                 (document root)
✅ resources/
✅ routes/
✅ storage/                (kosongkan folder logs/)
✅ .env-production-new     (rename ke .env setelah upload)
✅ .htaccess              (atau .htaccess.cpanel)
✅ artisan
✅ composer.json
✅ composer.lock
✅ deploy-setup.sh
```

#### Files yang JANGAN di-upload:
```
❌ vendor/                (install di server)
❌ node_modules/
❌ .env                   (file lokal)
❌ .env-server           (file server lama)
❌ storage/logs/*.log     (file log lama)
❌ .git/                  (jika ada)
```

#### Cara Upload:
**Via FTP/SFTP (FileZilla/WinSCP):**
1. Connect ke server baru
2. Upload ke folder aplikasi (bukan public_html langsung)
3. Tunggu sampai selesai

**Via cPanel File Manager:**
1. Compress semua file jadi .zip
2. Upload .zip via File Manager
3. Extract di server

---

### **STEP 5: Setup Aplikasi di Server Baru**

Login SSH ke server baru:

```bash
# Masuk ke folder aplikasi
cd /path/to/your/app

# Rename environment file
mv .env-production-new .env

# Set permissions
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
chmod +x deploy-setup.sh

# Install dependencies
composer install --no-dev --optimize-autoloader

# JANGAN RUN MIGRATE karena database sudah di-import!
# Langsung optimize saja

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimize untuk production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Test database connection
php artisan tinker --execute="echo 'Users: ' . App\Models\User::count();"
```

**PENTING:** 🚨
- **JANGAN** run `php artisan migrate` karena database sudah ada (hasil import)
- Database sudah lengkap dengan data users, settings, dll

---

### **STEP 6: Setup Web Server**

#### Untuk cPanel:
1. Buka **Domains** atau **Addon Domains**
2. Set **Document Root** ke: `/path/to/app/public`
3. Pastikan SSL aktif

#### Untuk Apache (VPS):
```apache
<VirtualHost *:80>
    ServerName api.itm.yourdomain.com
    DocumentRoot /path/to/app/public
    
    <Directory /path/to/app/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### Untuk Nginx (VPS):
```nginx
server {
    listen 80;
    server_name api.itm.yourdomain.com;
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

### **STEP 7: Update Frontend Configuration**

Edit `frontend/src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://api.itm.yourdomain.com';
```

Build frontend:
```bash
cd frontend/
npm install
npm run build
```

Upload folder `dist/` ke server frontend (domain utama itm)

---

## 🧪 TESTING AFTER MIGRATION

### Test 1: Backend API
```bash
curl https://api.itm.yourdomain.com/
# Should return HTML
```

### Test 2: Database Connection
```bash
php artisan tinker --execute="echo 'Total users: ' . App\Models\User::count();"
# Should show number of users from imported database
```

### Test 3: Login dengan User Lama
```bash
curl -X POST https://api.itm.yourdomain.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"itmaintainance@gmail.com","password":"SuperAdmin123!"}'
```
Harus return token (user dari database lama)

### Test 4: Frontend
- Buka: `https://itm.yourdomain.com`
- Login dengan user yang ada di database lama
- Test semua fitur (CRUD, monitoring, dll)

---

## ✅ POST-MIGRATION CHECKLIST

- [ ] API responding correctly
- [ ] Database connected (users count matches old server)
- [ ] Old users can login
- [ ] Frontend connecting to new API
- [ ] CORS working (no browser errors)
- [ ] SSL certificate valid
- [ ] All CRUD operations working
- [ ] PageSpeed monitoring working
- [ ] Scheduled jobs configured (cron)

---

## 🔐 CREDENTIALS REFERENCE

### Super Admin (dari database import):
- Email: `itmaintainance@gmail.com`
- Password: `SuperAdmin123!`

### Database Server Baru:
- DB_HOST: `127.0.0.1`
- DB_DATABASE: `itm_database` (sesuai yang dibuat)
- DB_USERNAME: `itm_user` (sesuai yang dibuat)
- DB_PASSWORD: [password yang dibuat]

---

## 🚨 TROUBLESHOOTING

### Problem: "Access denied for user"
**Cause:** Database credentials salah di `.env`

**Fix:**
```bash
# Check credentials
cat .env | grep DB_

# Test connection
php artisan tinker --execute="DB::connection()->getPdo();"
```

### Problem: "Table not found"
**Cause:** Database import gagal atau tidak lengkap

**Fix:**
```bash
# Re-import database
mysql -u itm_user -p itm_database < database_backup.sql

# Check tables
mysql -u itm_user -p itm_database -e "SHOW TABLES;"
```

### Problem: Old users can't login
**Cause:** 
- Database tidak ter-import
- APP_KEY berbeda dengan server lama

**Fix:**
```bash
# Gunakan APP_KEY yang sama dari server lama
# Copy dari .env-server lama ke .env server baru
APP_KEY=base64:GJ3WpjfBqDHIfq7INYnsJuZQowKdH/j2pXc4PAvDyLs=

# Clear cache
php artisan config:clear
```

### Problem: CORS errors
**Cause:** Domain tidak match di SANCTUM_STATEFUL_DOMAINS

**Fix:** Update di `.env`:
```env
SANCTUM_STATEFUL_DOMAINS=itm.yourdomain.com,api.itm.yourdomain.com
```

---

## 📝 IMPORTANT NOTES

### ⚠️ APP_KEY Must Match!
Gunakan **APP_KEY yang SAMA** dari server lama ke server baru:
```
APP_KEY=base64:GJ3WpjfBqDHIfq7INYnsJuZQowKdH/j2pXc4PAvDyLs=
```

Jika ganti APP_KEY, semua password yang sudah ter-encrypt di database TIDAK BISA di-decrypt!

### ⚠️ Don't Run Migrations!
Database sudah lengkap dari import, **JANGAN** run:
```bash
❌ php artisan migrate        # JANGAN!
❌ php artisan migrate:fresh  # JANGAN!
```

### ⚠️ Session & Cache
Setelah migrasi, clear semua session & cache:
```bash
php artisan optimize:clear
```

User di server lama harus **re-login** di server baru.

---

## 🎯 SUMMARY

**Urutan benar:**
1. ✅ Export database server lama
2. ✅ Buat database baru di server baru
3. ✅ Import database ke server baru
4. ✅ Update `.env` dengan credentials baru
5. ✅ Upload files aplikasi
6. ✅ Install composer dependencies
7. ✅ **SKIP** migrate (database sudah ada)
8. ✅ Cache config & test

**Selesai! Ready to go! 🚀**
