# 🌐 Update Domain untuk Migrasi

## Domain Mapping

### Server Lama:
- **Backend API:** `https://speed-api.syntax.co.id`
- **Frontend:** `https://pagespeed.syntax.co.id`

### Server Baru:
- **Backend API:** `https://api.itmsci.com`
- **Frontend:** `https://itmsci.com`

---

## ✅ Files yang Perlu Update

### 1. **`.env` (atau `.env-production-new`)**

Update bagian ini saja:

```env
# URLs
APP_URL=https://api.itmsci.com
FRONTEND_URL=https://itmsci.com

# Session Domain
SESSION_DOMAIN=.itmsci.com

# Sanctum Stateful Domains
SANCTUM_STATEFUL_DOMAINS=itmsci.com,api.itmsci.com,localhost:5173,127.0.0.1:5173

# Database credentials (sesuaikan dengan server baru)
DB_DATABASE=your_new_database_name
DB_USERNAME=your_new_database_user
DB_PASSWORD=your_new_database_password
```

**IMPORTANT:** 🚨
- `APP_KEY` **JANGAN DIUBAH!** Harus sama dengan server lama
- `PAGESPEED_API_KEY` tetap sama
- `OJS_SECURE_USERNAME` & `OJS_SECURE_PASSWORD` tetap sama

---

### 2. **`config/cors.php`**

Sudah OK! File ini sudah include `itmsci.com`:

```php
'allowed_origins' => [
    'https://pagespeed.syntax.co.id',  // server lama (bisa dihapus nanti)
    'https://syntax.co.id',            // server lama (bisa dihapus nanti)
    'https://itmsci.com',              // ✅ SERVER BARU
    'http://localhost:3000',
    'http://localhost:5173',
    // ...
],
```

**Action:** ✅ Tidak perlu diubah (sudah ada)

---

### 3. **`config/sanctum.php`**

Sudah OK! File ini sudah include:

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 
    'pagespeed.syntax.co.id,syntax.co.id,speed-api.syntax.co.id,itmsci.com,api.itmsci.com'
)),
```

**Action:** ✅ Tidak perlu diubah (sudah ada)

Tapi akan **override** oleh `.env`, jadi pastikan di `.env` sudah benar.

---

### 4. **`frontend/src/services/api.ts`**

Update API base URL:

**Sebelum:**
```typescript
const API_BASE_URL = 'https://speed-api.syntax.co.id';
```

**Sesudah:**
```typescript
const API_BASE_URL = 'https://api.itmsci.com';
```

Atau pakai environment variable:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.itmsci.com';
```

Lalu buat file `frontend/.env.production`:
```env
VITE_API_URL=https://api.itmsci.com
```

---

## 🚀 Setup Steps (Ringkas)

### Di Lokal (Sebelum Upload):

**1. Update .env untuk server baru:**
```bash
# Copy template
cp .env-server .env-production-new

# Edit .env-production-new:
nano .env-production-new
```

Update bagian ini:
```env
APP_URL=https://api.itmsci.com
FRONTEND_URL=https://itmsci.com
SESSION_DOMAIN=.itmsci.com
SANCTUM_STATEFUL_DOMAINS=itmsci.com,api.itmsci.com

DB_DATABASE=itm_new_database
DB_USERNAME=itm_new_user
DB_PASSWORD=new_password_here
```

**2. Update frontend API URL:**
```bash
# Edit frontend/src/services/api.ts
# Ubah: https://speed-api.syntax.co.id
# Jadi: https://api.itmsci.com
```

**3. Build frontend:**
```bash
cd frontend/
npm install
npm run build
# Hasilnya di folder dist/
```

---

### Di Server Baru:

**1. Import database dulu** (via phpMyAdmin)

**2. Upload files:**
- Backend files → `/path/to/backend/`
- Frontend dist/ → `/path/to/frontend/`
- `.env-production-new` → rename jadi `.env`

**3. Run setup:**
```bash
cd /path/to/backend/
chmod +x migration-setup.sh
./migration-setup.sh
```

**4. Clear cache:**
```bash
php artisan config:clear
php artisan cache:clear
php artisan config:cache
```

---

## 🧪 Testing

### Test 1: CORS
```bash
curl -H "Origin: https://itmsci.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.itmsci.com/api/login
```
Harus return CORS headers

### Test 2: API Login
```bash
curl -X POST https://api.itmsci.com/api/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://itmsci.com" \
  -d '{"email":"itmaintainance@gmail.com","password":"SuperAdmin123!"}'
```
Harus return JSON dengan token

### Test 3: Frontend → Backend
- Buka browser: `https://itmsci.com`
- Buka Developer Tools → Network tab
- Login dengan user lama
- Check request ke `https://api.itmsci.com`
- Pastikan tidak ada CORS error

---

## 🚨 Troubleshooting

### Error: "CORS policy blocked"

**Check 1:** Sanctum domains di `.env`
```bash
cat .env | grep SANCTUM_STATEFUL_DOMAINS
# Harus: itmsci.com,api.itmsci.com
```

**Check 2:** Clear cache
```bash
php artisan config:clear
php artisan config:cache
```

**Check 3:** Check CORS config
```bash
php artisan tinker --execute="print_r(config('cors.allowed_origins'));"
```

### Error: "Unauthenticated" atau token tidak valid

**Check:** Session domain
```bash
cat .env | grep SESSION_DOMAIN
# Harus: .itmsci.com (dengan titik di depan)
```

### Error: Users tidak bisa login (password salah)

**Check:** APP_KEY harus SAMA dengan server lama!
```bash
cat .env | grep APP_KEY
# Harus: base64:GJ3WpjfBqDHIfq7INYnsJuZQowKdH/j2pXc4PAvDyLs=
```

---

## 📝 Quick Checklist

**Di `.env` server baru:**
- [ ] `APP_URL=https://api.itmsci.com`
- [ ] `FRONTEND_URL=https://itmsci.com`
- [ ] `SESSION_DOMAIN=.itmsci.com`
- [ ] `SANCTUM_STATEFUL_DOMAINS=itmsci.com,api.itmsci.com`
- [ ] `APP_KEY` sama dengan server lama (PENTING!)
- [ ] Database credentials sesuai server baru

**Files:**
- [ ] `config/cors.php` sudah ada `itmsci.com` ✅
- [ ] `config/sanctum.php` sudah ada fallback ✅
- [ ] `frontend/src/services/api.ts` update ke `api.itmsci.com`

**Setup:**
- [ ] Database sudah di-import
- [ ] Files sudah di-upload
- [ ] `migration-setup.sh` sudah dijalankan
- [ ] Cache sudah di-clear

**Testing:**
- [ ] CORS test passed
- [ ] API login test passed
- [ ] Frontend bisa connect ke backend
- [ ] User lama bisa login

---

## ✅ Summary

**Yang perlu diubah untuk domain baru:**

1. **`.env`** (5 baris):
   - APP_URL
   - FRONTEND_URL
   - SESSION_DOMAIN
   - SANCTUM_STATEFUL_DOMAINS
   - Database credentials

2. **`frontend/src/services/api.ts`** (1 baris):
   - API_BASE_URL

3. **Files lain:** Tidak perlu diubah (sudah support domain baru)

**That's it!** 🚀

Sisanya tinggal upload, import database, run setup, dan test!
