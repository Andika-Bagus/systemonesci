# Troubleshooting: Data Tidak Muncul di Server

## Masalah yang Ditemukan & Solusi

### 1. ✅ API URL Configuration (SUDAH DIPERBAIKI)
**Masalah:**
- API base URL di `api.ts` memiliki trailing slash yang tidak konsisten
- Bisa menyebabkan URL menjadi `https://api.itmsci.com//api/page-speeds` (double slash)

**Solusi yang Diterapkan:**
```typescript
// Before: 'https://api.itmsci.com/'
// After: 'https://api.itmsci.com/api'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.itmsci.com/api';
```

**Perlu Deploy:**
- ✅ File `frontend/src/services/api.ts` sudah diupdate
- ✅ Tambahkan `withCredentials: true` untuk CORS
- ✅ Tambahkan `Accept: application/json` header

### 2. ✅ CORS Configuration (SUDAH DIPERBAIKI)
**Masalah:**
- Domain production mungkin tidak ter-cover dengan baik
- Missing CSRF cookie path

**Solusi yang Diterapkan:**
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => [
    'https://pagespeed.syntax.co.id', 
    'https://syntax.co.id',
    'https://www.syntax.co.id',
    'https://itmsci.com',
    'https://www.itmsci.com',
    'https://api.itmsci.com',
    // ... dll
],
'exposed_headers' => ['Authorization'],
```

**Perlu Deploy:**
- ✅ File `config/cors.php` sudah diupdate

---

## Checklist untuk Deploy ke Server

### Backend (Laravel API)
1. ☐ Upload file yang sudah diupdate:
   - `config/cors.php`
   
2. ☐ Pastikan `.env` di server sudah benar:
   ```env
   APP_URL=https://api.itmsci.com
   FRONTEND_URL=https://itmsci.com
   SANCTUM_STATEFUL_DOMAINS=itmsci.com,api.itmsci.com,.itmsci.com
   ```

3. ☐ Clear cache di server:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan route:clear
   php artisan view:clear
   ```

4. ☐ Restart PHP-FPM/Apache/Nginx (tergantung server):
   ```bash
   # Untuk Apache
   sudo systemctl restart apache2
   
   # Untuk Nginx + PHP-FPM
   sudo systemctl restart php8.1-fpm
   sudo systemctl restart nginx
   ```

### Frontend (React/Vite)
1. ☐ Upload file yang sudah diupdate:
   - `src/services/api.ts`
   - `.env.production`

2. ☐ Build ulang frontend:
   ```bash
   npm run build
   # atau
   yarn build
   ```

3. ☐ Upload folder `dist/` hasil build ke server

---

## Testing Setelah Deploy

### 1. Test API Endpoint Langsung
Buka browser console di `https://itmsci.com` dan jalankan:

```javascript
// Test 1: Cek API base connection
fetch('https://api.itmsci.com/api/test', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('Test API:', data))
.catch(err => console.error('Error:', err));

// Test 2: Cek PageSpeed endpoint (perlu login dulu)
fetch('https://api.itmsci.com/api/page-speeds', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN_HERE' // ganti dengan token dari localStorage
  }
})
.then(r => r.json())
.then(data => console.log('PageSpeed Data:', data))
.catch(err => console.error('Error:', err));
```

### 2. Cek Network Tab di Browser DevTools
1. Buka DevTools (F12)
2. Pergi ke tab **Network**
3. Refresh halaman
4. Cari request ke `/api/page-speeds`
5. Periksa:
   - ☐ Status Code: harus **200 OK**
   - ☐ Response: harus ada data JSON
   - ☐ CORS Headers: harus ada `Access-Control-Allow-Origin`
   - ☐ URL: harus `https://api.itmsci.com/api/page-speeds` (tanpa double slash)

### 3. Cek Console untuk Error
Buka Console (F12) dan cari error seperti:
- ❌ `CORS policy` error → masalah CORS
- ❌ `401 Unauthorized` → masalah authentication
- ❌ `404 Not Found` → masalah routing/URL
- ❌ `500 Internal Server Error` → masalah server backend
- ❌ `Network Error` → masalah koneksi/firewall

---

## Debugging Lebih Lanjut

### Jika Data Masih Tidak Muncul:

#### 1. Cek Database di Server
SSH ke server dan jalankan:
```bash
# Masuk ke MySQL
mysql -u submitj1_speednew -p
# Password: dika170805?

# Pilih database
USE submitj1_speednew;

# Cek jumlah data
SELECT COUNT(*) FROM page_speeds;
SELECT COUNT(*) FROM websites;

# Cek data terbaru
SELECT * FROM page_speeds ORDER BY checked_at DESC LIMIT 5;
SELECT * FROM websites LIMIT 5;
```

**Expected Result:**
- Harus ada data di kedua tabel
- Jika kosong: data belum di-migrate atau database salah

#### 2. Cek Laravel Logs
```bash
# Di server, cek log file
tail -f storage/logs/laravel.log

# Atau cek log terbaru
tail -100 storage/logs/laravel.log
```

Cari error yang berkaitan dengan:
- Database connection
- PageSpeed API
- Authentication issues

#### 3. Cek Apache/Nginx Error Logs
```bash
# Apache
tail -f /var/log/apache2/error.log

# Nginx
tail -f /var/log/nginx/error.log
```

#### 4. Test Endpoint dengan Postman/cURL
```bash
# Test tanpa authentication
curl -X GET https://api.itmsci.com/api/test

# Test dengan authentication (ganti TOKEN)
curl -X GET https://api.itmsci.com/api/page-speeds \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# Test login
curl -X POST https://api.itmsci.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

---

## Kemungkinan Masalah Lain

### 1. Environment Variables Tidak Ter-load
**Cek:**
```bash
# Di server
php artisan config:show

# Atau
php artisan env
```

**Fix:**
```bash
php artisan config:cache
```

### 2. .htaccess Tidak Bekerja
**Cek:**
Pastikan file `.htaccess` ada di root Laravel:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

Dan di `public/.htaccess`:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

### 3. PHP Version Mismatch
**Cek:**
```bash
php -v
```

Laravel 11 memerlukan PHP >= 8.2

### 4. Composer Dependencies Tidak Lengkap
**Fix:**
```bash
composer install --no-dev --optimize-autoloader
```

### 5. File Permissions
**Fix:**
```bash
# Set proper permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

---

## Quick Checklist

Jika data tidak muncul, cek berurutan:

1. ☐ **Network Tab**: Request berhasil? Status 200?
2. ☐ **Console**: Ada error CORS/Auth/Network?
3. ☐ **API Response**: JSON ter-return dengan benar?
4. ☐ **Authentication**: Token valid dan ter-kirim?
5. ☐ **Database**: Ada data di table `page_speeds`?
6. ☐ **Laravel Logs**: Ada error di `storage/logs/laravel.log`?
7. ☐ **Config Cache**: Sudah clear cache?
8. ☐ **CORS Headers**: Ada header `Access-Control-Allow-Origin`?

---

## Kontak & Support

Jika masih belum solved, kumpulkan informasi berikut:
- Screenshot error di Console
- Screenshot Network tab (request & response)
- Log dari `storage/logs/laravel.log` (bagian error terakhir)
- Output dari `SELECT COUNT(*) FROM page_speeds;`

Kemudian bisa tanyakan ke developer atau create issue di repository.
