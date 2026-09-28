# OJS SECURE - COMPLETE FILE CHECKLIST

## 📦 BACKEND FILES (PHP/Laravel)

### 1. Controller
```
☐ app/Http/Controllers/OjsSecureController.php
```
**Pastikan:**
- Method `authenticate()`, `verify()`, `getInstances()`, `logout()`, `sessionInfo()`
- Semua method require `$request->user()->id`

### 2. Model
```
☐ app/Models/OjsSecureSession.php
☐ app/Models/OjsInstance.php
```

### 3. Migrations (2 files)
```
☐ database/migrations/2026_06_20_035000_create_ojs_secure_sessions_table.php
☐ database/migrations/2026_07_09_000000_update_ojs_secure_sessions_indexes.php (NEW!)
```

**After upload, run:**
```bash
php artisan migrate
```

### 4. Routes
```
☐ routes/api.php
```
**Pastikan ada:**
```php
Route::middleware(['auth:sanctum', ...])->group(function () {
    Route::prefix('ojs-secure')->group(function () {
        Route::post('/authenticate', [OjsSecureController::class, 'authenticate']);
        Route::post('/verify', [OjsSecureController::class, 'verify']);
        Route::get('/instances', [OjsSecureController::class, 'getInstances']);
        Route::post('/logout', [OjsSecureController::class, 'logout']);
        Route::get('/session', [OjsSecureController::class, 'sessionInfo']);
    });
});
```

### 5. Config Files
```
☐ config/cors.php
```
**Pastikan `exposed_headers` include:**
```php
'exposed_headers' => ['Authorization', 'X-OJS-Session', 'X-WP-Session'],
```

### 6. Environment Variables
```
☐ .env (di server)
```
**Pastikan ada:**
```env
OJS_SECURE_USERNAME=ojs_admin
OJS_SECURE_PASSWORD=OJS_Secure_2026!
```

---

## 🎨 FRONTEND FILES (React/TypeScript)

### 1. Component
```
☐ frontend/src/pages/ojs/OjsSecure.tsx
```
**Pastikan:**
- Save token to `localStorage.getItem('ojs_secure_token')`
- Load token on mount
- Check session with `/ojs-secure/verify`
- Has console.log for debugging

### 2. API Service
```
☐ frontend/src/services/api.ts
```
**Pastikan:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.itmsci.com/api';
```

### 3. Routes
```
☐ frontend/src/routes/AppRoutes.tsx
```
**Pastikan ada route:**
```typescript
<Route path="/ojs-secure" element={<OjsSecure />} />
```

### 4. Sidebar Navigation
```
☐ frontend/src/data/SidebarData.ts
```
**Pastikan menu OJS Secure ada (tidak di-comment)**

### 5. Build Output (PALING PENTING!)
```
☐ frontend/dist/* (ALL FILES!)
```
**Upload SEMUA ISI folder dist/ ke public/ di server**

---

## 🗄️ DATABASE

### Tables to Check:
```sql
-- Check table exists
SHOW TABLES LIKE 'ojs_secure_sessions';

-- Check table structure
DESCRIBE ojs_secure_sessions;

-- Check indexes
SHOW INDEX FROM ojs_secure_sessions;
```

**Expected indexes:**
```
- PRIMARY (id)
- UNIQUE (session_token)
- INDEX (session_token, user_id) ← IMPORTANT!
- INDEX (expires_at)
- FOREIGN KEY (user_id) → users(id)
```

---

## ✅ VERIFICATION STEPS (After Upload)

### 1. Clear Cache
```bash
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

### 2. Check Routes
```bash
php artisan route:list | grep ojs-secure
```
**Should show:**
```
POST    api/ojs-secure/authenticate
POST    api/ojs-secure/verify
GET     api/ojs-secure/instances
POST    api/ojs-secure/logout
GET     api/ojs-secure/session
```

### 3. Check Migration
```bash
php artisan migrate:status
```
**Should show both migrations ran**

### 4. Test Backend
```bash
php test-simple-auth.php
```
**Should return 200 SUCCESS for https://api.itmsci.com**

### 5. Test Frontend
- Open browser
- F12 → Console
- Navigate to OJS Secure
- Look for: `[OJS Secure]` logs

---

## 🔍 COMMON ISSUES

### Backend 404:
- ✗ routes/api.php not updated
- ✗ Route cache not cleared
- **Fix:** Re-upload routes/api.php, run `php artisan route:clear`

### Session Not Persisting:
- ✗ Migration not run (indexes missing)
- ✗ frontend/dist not uploaded
- **Fix:** Run migration, re-upload dist folder

### "Attempt to read property 'id' on null":
- ✗ User not logged in to main app first
- ✗ Sanctum token missing
- **Fix:** Login to main app before accessing OJS Secure

### Frontend Shows Old Code:
- ✗ Browser cache
- ✗ dist folder not uploaded
- **Fix:** Hard refresh (Ctrl+Shift+R), clear browser cache

---

## 📊 FILE COUNT SUMMARY

**Backend:** 6 files + 1 env check
**Frontend:** 5 files (but dist/ contains ~100+ files)
**Database:** 2 migrations
**Total:** ~13 files to verify

---

## 🎯 QUICK CHECKLIST (Priority Order)

1. ☐ Upload `app/Http/Controllers/OjsSecureController.php`
2. ☐ Upload `config/cors.php`
3. ☐ Upload `database/migrations/2026_07_09_000000_update_ojs_secure_sessions_indexes.php`
4. ☐ Run `php artisan migrate`
5. ☐ Upload `frontend/dist/*` (ALL FILES to public/)
6. ☐ Run `php artisan route:clear`
7. ☐ Run `php artisan config:clear`
8. ☐ Test: `php test-simple-auth.php`
9. ☐ Test browser with Console open (F12)
10. ☐ Check browser Console for `[OJS Secure]` logs

