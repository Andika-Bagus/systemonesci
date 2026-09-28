# Diagnosis: OJS Secure Credential Update Not Persisting

## Issue Summary
When users edit OJS credentials via the Edit button in OJS Secure and click Save:
- ✅ Toast shows "Kredensial OJS berhasil disimpan!"
- ✅ Table UI updates immediately (local state)
- ❌ Data does NOT persist to database after page refresh
- ❌ `ojs_username` and `ojs_password` remain `NULL` in database

## Root Cause Analysis

### Backend Verification ✅
**Test Results from `test-ojs-update.php`:**
```
✅ Update endpoint works correctly
✅ Data saves to database when authenticated
✅ Validation passes
✅ Model update() method works
```

**Conclusion:** Backend is working perfectly.

### The Real Problem 🎯

The OJS Secure update flow uses **TWO different authentication systems**:

1. **OJS Secure Session** (`X-OJS-Session` header)
   - Used for: authenticate, verify, getInstances, logout
   - Purpose: Access control for sensitive OJS data
   - Scope: OJS Secure feature only

2. **Laravel Sanctum Auth** (`Authorization: Bearer` header)
   - Used for: ALL regular API endpoints including `/ojs-instances/{id}` update
   - Purpose: Main application authentication
   - Scope: Entire application

### Why It Fails

When user clicks "Edit" → enters credentials → "Save":

```typescript
// Frontend calls:
await ojsAPI.update(editingInstance.id, {
  ojs_username: editUsername,
  ojs_password: editPassword,
});
```

This calls → `PUT /api/ojs-instances/{id}`

```php
// Backend route:
Route::apiResource('ojs-instances', OjsInstanceController::class);
// This is inside auth:sanctum middleware group!
```

**The Problem:**
- The update endpoint requires `auth:sanctum` (Laravel user authentication)
- The frontend is sending the Laravel auth token from `localStorage.getItem('auth_token')`
- BUT: The user might not be logged in to the main system, OR the token might be expired/invalid
- The OJS Secure session (`X-OJS-Session`) is NOT checked for this endpoint

### Proof
Console will show one of:
1. `Auth token in localStorage: Not found` → User not logged in to main system
2. `Error status: 401` → Token expired/invalid
3. `Error status: 403` → User lacks permission (viewer/pagespeed roles)

## The Solution Options

### Option 1: Require Main System Login ✅ RECOMMENDED
**Approach:** Users MUST be logged in to the main system to use OJS Secure

**Changes needed:**
1. Add check on OJS Secure page mount: verify main auth token exists
2. If no token, redirect to login with return URL
3. Keep current update flow (uses `ojsAPI.update()`)

**Pros:**
- Consistent with WP Secure (which also requires main auth)
- Provides audit trail (who updated what)
- Simplest implementation
- Secure

**Cons:**
- Users need two levels of auth (main system + OJS Secure)

### Option 2: Separate Credential Update Endpoint
**Approach:** Create dedicated endpoint for OJS Secure that uses OJS session

**Changes needed:**
1. New route: `POST /api/ojs-secure/update-credential/{id}`
2. New method in `OjsSecureController`: `updateCredential()`
3. Verify `X-OJS-Session` header instead of Sanctum
4. Update frontend to call this endpoint instead

**Pros:**
- Works without main system login
- Fully independent feature

**Cons:**
- Duplicate update logic
- More complex
- No audit trail of who updated (only OJS Secure session)

### Option 3: Make OJS Instances Public (NOT RECOMMENDED ❌)
Move `ojs-instances` routes outside `auth:sanctum` group

**Cons:**
- Security risk
- Anyone can update any instance
- Not acceptable for production

## Recommended Fix: Option 1

### Implementation Steps:

1. **Add main auth check to OjsSecure.tsx:**
```typescript
useEffect(() => {
  const authToken = localStorage.getItem('auth_token');
  
  if (!authToken) {
    toast.error('Anda harus login terlebih dahulu');
    // Redirect to login with return URL
    window.location.href = `/auth/login?redirect=/ojs-secure`;
    return;
  }
  
  // Then check OJS Secure session...
  const ojsToken = localStorage.getItem('ojs_secure_token');
  // ... existing code
}, []);
```

2. **Add auth verification to handleSaveCredential:**
```typescript
const handleSaveCredential = async () => {
  const authToken = localStorage.getItem('auth_token');
  if (!authToken) {
    toast.error('Session expired. Please login again.');
    window.location.href = '/auth/login?redirect=/ojs-secure';
    return;
  }
  
  // ... rest of existing code
};
```

3. **Update error handling:**
```typescript
catch (error: any) {
  if (error.response?.status === 401) {
    toast.error('Authentication required. Redirecting to login...');
    localStorage.removeItem('auth_token');
    window.location.href = '/auth/login?redirect=/ojs-secure';
    return;
  }
  // ... other error handling
}
```

## Next Steps

1. Upload files to server:
   - ✅ `OjsInstanceController.php` (has logging now)
   - ✅ `OjsSecure.tsx` (has console logging now)
   - ✅ `frontend/dist/*` (rebuild with logging)

2. Test on server:
   - Open browser console
   - Go to OJS Secure
   - Check console logs for "Auth token in localStorage"
   - Try to edit a credential
   - Check console for error response

3. Based on console output, confirm the diagnosis

4. Implement Option 1 fix

## Files Modified (Ready for Upload)

### Backend (with logging):
- ✅ `app/Http/Controllers/OjsInstanceController.php`

### Frontend (with logging):
- ✅ `frontend/src/pages/ojs/OjsSecure.tsx`
- ✅ `frontend/dist/*` (rebuilt)

### Test Scripts:
- ✅ `test-ojs-update.php` (proves backend works)
- ✅ `DIAGNOSIS-OJS-UPDATE-ISSUE.md` (this file)
