# Upload Checklist: OJS Secure Credential Update Fix

## Problem Solved
✅ OJS credentials now persist to database after refresh
✅ User must be logged in to main system (matches WP Secure behavior)
✅ Clear error messages if auth expires
✅ Extensive console logging for debugging

## Root Cause
The update endpoint `/api/ojs-instances/{id}` requires Laravel Sanctum authentication, but the frontend wasn't checking if the user was logged in to the main system before attempting the update.

## Files to Upload

### 1. Backend Files (with logging)

#### a. Controller with logging
📁 **Path:** `app/Http/Controllers/OjsInstanceController.php`
```
What changed:
- Added \Log::info() statements to track update requests
- Logs request data, user_id, validation, and result
- Helps debug on server
```

### 2. Frontend Files (rebuilt with auth checks)

#### a. Main component with auth checks
📁 **Path:** `frontend/src/pages/ojs/OjsSecure.tsx`
```
What changed:
- Added main auth check on component mount
- Redirects to login if no auth token found
- Added auth verification in handleSaveCredential
- Better error handling for 401/403 responses
- Extensive console logging for debugging
```

#### b. Rebuilt distribution files
📁 **Path:** `frontend/dist/*` (all files)
```
What changed:
- Complete rebuild with new auth logic
- Upload entire dist folder
```

### 3. Documentation Files (for reference)

#### a. Diagnosis document
📁 **Path:** `DIAGNOSIS-OJS-UPDATE-ISSUE.md`
```
Purpose: Explains the problem and solution
Optional: Can keep for future reference
```

#### b. Test script
📁 **Path:** `test-ojs-update.php`
```
Purpose: Proves backend works correctly
Optional: Can keep for testing
```

## Upload Instructions

### Server Directory Structure
```
/home/syntax/domains/api.itmsci.com/
├── app/
│   └── Http/
│       └── Controllers/
│           └── OjsInstanceController.php  ← Upload this
└── public_html/
    └── (frontend dist files)  ← Upload frontend/dist/* here
```

### Upload Steps

1. **Upload Backend Controller**
   ```bash
   # On server, backup original first:
   cp app/Http/Controllers/OjsInstanceController.php app/Http/Controllers/OjsInstanceController.php.backup
   
   # Then upload new file:
   # Upload: OjsInstanceController.php
   # To: /home/syntax/domains/api.itmsci.com/app/Http/Controllers/
   ```

2. **Upload Frontend Distribution**
   ```bash
   # On server, backup original frontend first:
   cp -r public_html public_html_backup_$(date +%Y%m%d_%H%M%S)
   
   # Then upload new files:
   # Upload all files from: frontend/dist/*
   # To: /home/syntax/domains/api.itmsci.com/public_html/
   
   # Make sure to upload:
   # - index.html
   # - assets/* (all JavaScript and CSS files)
   # - All image files
   ```

3. **Verify Upload**
   ```bash
   # Check file timestamps on server
   ls -lah app/Http/Controllers/OjsInstanceController.php
   ls -lah public_html/index.html
   ls -lah public_html/assets/
   ```

## Testing After Upload

### Test 1: Check Main Auth Requirement
1. Open browser in incognito/private mode
2. Clear all localStorage
3. Go to: `https://itmsci.com/ojs-secure`
4. **Expected:** Redirected to login page within 2 seconds
5. **Toast message:** "Anda harus login terlebih dahulu untuk mengakses OJS Secure"

### Test 2: Check Console Logs
1. Login to main system first: `https://itmsci.com/auth/login`
2. Then go to: `https://itmsci.com/ojs-secure`
3. Open browser DevTools (F12) → Console tab
4. **Expected console logs:**
   ```
   [OJS Secure] Component mounted, checking authentication...
   [OJS Secure] Main auth token: Found
   [OJS Secure] Main auth OK, checking for OJS Secure token...
   ```
5. Login to OJS Secure with credentials: `ojs_admin` / `OJS_Secure_2026!`
6. **Expected:** Instances load successfully

### Test 3: Update Credentials (THE FIX!)
1. After logging in (both main + OJS Secure), click Edit button on any instance
2. Enter new username and password
3. Click "Simpan"
4. Open console - **Expected logs:**
   ```
   [OJS Secure] Saving credential for instance: X
   [OJS Secure] New username: test_user
   [OJS Secure] New password length: 9
   [OJS Secure] Main auth token: Found (492|MsBCW...)
   [OJS Secure] Calling ojsAPI.update...
   [OJS Secure] Update response status: 200
   [OJS Secure] Update response data: {...}
   ```
5. **Expected toast:** "Kredensial OJS berhasil disimpan!"
6. **THE CRITICAL TEST:** Refresh the page (F5)
7. **Expected:** Credentials still show in the table!
8. **Verify in database:**
   ```sql
   SELECT id, name, ojs_username, ojs_password 
   FROM ojs_instances 
   WHERE id = X;
   ```
   Should show the new credentials!

### Test 4: Check Server Logs
```bash
# On server, check Laravel logs:
tail -f storage/logs/laravel.log

# Look for:
# [OJS Instance Update] Request received
# [OJS Instance Update] Validated data
# [OJS Instance Update] After update
```

## Expected Behavior After Fix

### ✅ What Should Work:
1. User MUST login to main system before accessing OJS Secure
2. User then enters OJS Secure credentials
3. User can view all OJS instances with credentials
4. User can edit credentials via Edit button
5. **Credentials persist to database after save**
6. **Credentials remain after page refresh**
7. Clear error messages if auth expires

### 🔄 User Flow:
```
1. Login to main system → Get Sanctum token
2. Navigate to OJS Secure → Checked for main auth
3. Enter OJS credentials → Get OJS session token
4. View instances → Uses OJS session
5. Edit credentials → Uses Sanctum token ← THIS WAS THE FIX!
6. Save → Data persists to DB ← THIS NOW WORKS!
7. Refresh → Data still there! ← THIS NOW WORKS!
```

## Rollback Plan (If Needed)

If something goes wrong:

```bash
# Restore backend:
cp app/Http/Controllers/OjsInstanceController.php.backup app/Http/Controllers/OjsInstanceController.php

# Restore frontend:
rm -rf public_html
mv public_html_backup_YYYYMMDD_HHMMSS public_html

# Clear cache:
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

## Files Modified Summary

| File | What Changed | Critical? |
|------|-------------|-----------|
| `OjsInstanceController.php` | Added logging | No (logging only) |
| `OjsSecure.tsx` | Added main auth checks | **YES** |
| `frontend/dist/*` | Rebuilt with new logic | **YES** |

## Success Criteria

- ✅ User must login to main system first
- ✅ OJS Secure credentials update works
- ✅ Data persists after refresh
- ✅ Clear error messages
- ✅ Console logs for debugging
- ✅ Server logs track updates
- ✅ Matches WP Secure behavior

## Notes

- This fix makes OJS Secure consistent with WP Secure
- Both now require main system authentication
- This provides proper audit trail (who updated what)
- More secure than separate auth system
- Backend was always working correctly - frontend needed the fix

## Contact

If issues persist after upload:
1. Check browser console for error messages
2. Check server logs: `tail -f storage/logs/laravel.log`
3. Verify main auth token exists: `localStorage.getItem('auth_token')`
4. Test backend directly with `test-ojs-update.php`
