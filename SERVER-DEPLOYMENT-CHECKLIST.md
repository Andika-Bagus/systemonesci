# 🚀 Server Deployment Checklist

## ✅ Masalah yang Sudah Diperbaiki

### 1. **CORS Configuration**
- ✅ Menambahkan `https://api.itmsci.com` ke `allowed_origins` di `config/cors.php`
- ✅ Menambahkan `api.itmsci.com` dan `.itmsci.com` ke Sanctum stateful domains

### 2. **Environment Variables**
- ✅ Update `.env-server` dengan domain itmsci.com

---

## 📋 Langkah Deploy ke Server

### Step 1: Upload File yang Sudah Diupdate
```bash
# Upload file-file ini ke server:
- config/cors.php
- config/sanctum.php
- .env-server (rename ke .env di server)
```

### Step 2: Di Server, Jalankan Command Ini
```bash
# Clear config cache
php artisan config:clear

# Clear route cache
php artisan route:clear

# Clear view cache
php artisan view:clear

# Regenerate config cache
php artisan config:cache

# Regenerate route cache (optional)
php artisan route:cache

# Clear application cache
php artisan cache:clear
```

### Step 3: Restart Services (jika ada)
```bash
# Jika menggunakan PHP-FPM
sudo systemctl restart php8.2-fpm

# Jika menggunakan queue worker
php artisan queue:restart

# Jika menggunakan supervisor
sudo supervisorctl restart all
```

### Step 4: Verifikasi CORS di Server
```bash
# Test CORS dari server
curl -H "Origin: https://api.itmsci.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     --verbose \
     https://api.itmsci.com/api/test
```

### Step 5: Test Database Connection
```bash
# Test endpoint
curl https://api.itmsci.com/api/test

# Test database
curl -X POST https://api.itmsci.com/api/test-db
```

---

## 🔍 Debugging Steps

### 1. Check Laravel Logs
```bash
tail -f storage/logs/laravel.log
```

### 2. Check Apache/Nginx Error Logs
```bash
# Apache
tail -f /var/log/apache2/error.log

# Nginx
tail -f /var/log/nginx/error.log
```

### 3. Check PHP Error Logs
```bash
tail -f /var/log/php8.2-fpm.log
```

### 4. Test Frontend API Call
Buka browser console di `https://pagespeed.syntax.co.id` dan jalankan:
```javascript
// Check current API URL
console.log(import.meta.env.VITE_API_BASE_URL);

// Test API call
fetch('https://api.itmsci.com/api/test')
  .then(r => r.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err));
```

---

## 🔧 Common Issues & Solutions

### Issue 1: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Cause**: CORS tidak dikonfigurasi dengan benar
**Solution**:
- Pastikan `config/cors.php` sudah diupdate
- Jalankan `php artisan config:clear` dan `php artisan config:cache`
- Pastikan middleware CORS aktif di `bootstrap/app.php`

### Issue 2: "401 Unauthorized" pada setiap request
**Cause**: Sanctum stateful domains tidak cocok
**Solution**:
- Pastikan `.env` di server memiliki `SANCTUM_STATEFUL_DOMAINS` yang benar
- Pastikan `SESSION_DOMAIN` di `.env` server adalah `.syntax.co.id` atau `.itmsci.com`
- Clear config cache

### Issue 3: Data tidak muncul tapi tidak ada error
**Cause**: 
- Database kosong atau user tidak punya akses
- API endpoint berbeda
- Token authentication gagal

**Solution**:
```bash
# Check database
php artisan tinker
>>> \App\Models\User::count()
>>> \App\Models\Website::count()

# Test login
curl -X POST https://api.itmsci.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Issue 4: Frontend URL berbeda dengan yang di CORS
**Actual Frontend URL**: `https://api.itmsci.com` (berdasarkan `.env.production`)
**Server Backend URL**: `https://speed-api.syntax.co.id`

Jika frontend di-deploy di domain yang berbeda:
1. Pastikan domain frontend ada di CORS `allowed_origins`
2. Pastikan domain ada di Sanctum `stateful` domains
3. Pastikan cookie domain cocok (SESSION_DOMAIN)

---

## 📝 Current Configuration

### Backend API URLs
- Production: `https://api.itmsci.com`
- Alternative: `https://speed-api.syntax.co.id`

### Frontend URLs
- Production: `https://pagespeed.syntax.co.id`
- API Base URL: `https://api.itmsci.com/api`

### Allowed CORS Origins (Updated)
```php
'allowed_origins' => [
    'https://pagespeed.syntax.co.id',
    'https://syntax.co.id',
    'https://itmsci.com',
    'https://api.itmsci.com', // ✅ ADDED
    // localhost untuk development
]
```

### Sanctum Stateful Domains (Updated)
```
pagespeed.syntax.co.id,syntax.co.id,speed-api.syntax.co.id,itmsci.com,api.itmsci.com,.itmsci.com
```

---

## ⚠️ Important Notes

1. **Cache adalah musuh utama**: Selalu clear cache setelah update config
2. **Domain harus exact match**: `itmsci.com` ≠ `api.itmsci.com` ≠ `.itmsci.com`
3. **Wildcard subdomain**: Gunakan `.itmsci.com` (dengan dot) untuk allow semua subdomain
4. **SESSION_DOMAIN**: Harus pakai dot di depan untuk allow subdomain: `.syntax.co.id`
5. **Browser cache**: Clear browser cache atau gunakan incognito untuk test

---

## 🎯 Quick Test After Deploy

1. Test API endpoint: `https://api.itmsci.com/api/test`
2. Test database: `https://api.itmsci.com/api/test-db`
3. Test login dari frontend: `https://pagespeed.syntax.co.id/auth/login`
4. Check browser console untuk CORS errors
5. Check Network tab untuk failed requests

---

## 📞 Need Help?

Jika masih ada masalah setelah mengikuti checklist ini:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check server error logs
3. Check browser console
4. Verifikasi database connection
5. Verifikasi file permissions (storage, bootstrap/cache)
