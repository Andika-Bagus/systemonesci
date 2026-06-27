# Troubleshooting Guide

## Rate Limiting Issues

### Problem: "Too Many Attempts" Error

Jika Anda melihat pesan "Too Many Attempts" saat login, ini berarti rate limiting sedang aktif.

### Solution:

#### 1. Clear Rate Limiting (Recommended)
```bash
# Clear rate limit untuk semua IP
php artisan auth:clear-rate-limit

# Clear rate limit untuk IP tertentu
php artisan auth:clear-rate-limit 192.168.1.100
```

#### 2. Clear Application Cache
```bash
php artisan cache:clear
```

#### 3. Restart Development Server
```bash
# Stop server (Ctrl+C) then restart
php artisan serve --env=local
```

### Rate Limiting Configuration

Rate limiting dikonfigurasi berbeda untuk setiap environment:

#### Local Development (`.env.local`)
- **Max Attempts:** 20 percobaan
- **Decay Time:** 5 menit
- **More lenient** untuk development

#### Production (`.env`)
- **Max Attempts:** 5 percobaan  
- **Decay Time:** 15 menit
- **More strict** untuk keamanan

### Prevention Tips

1. **Use Correct Credentials:** Pastikan email dan password benar
2. **Check Environment:** Pastikan menggunakan environment yang tepat
3. **Monitor Attempts:** Jangan melakukan login berulang kali dengan cepat

## Common Login Issues

### 1. Invalid Credentials
- **Check Email:** `itmaintainance@gmail.com`
- **Check Password:** `SuperAdmin123!`
- **Case Sensitive:** Password case-sensitive

### 2. CORS Issues
- **Frontend URL:** Pastikan mengakses dari `pagespeed.syntax.co.id` (production) atau `localhost:3000` (local)
- **API URL:** Pastikan API endpoint benar

### 3. Database Connection
```bash
# Check database connection
php artisan tinker --execute="DB::connection()->getPdo();"

# Check if user exists
php artisan tinker --execute="App\Models\User::where('email', 'itmaintainance@gmail.com')->first();"
```

### 4. Session Issues
```bash
# Clear sessions
php artisan session:clear

# Clear all cache
php artisan optimize:clear
```

## Environment Setup Issues

### 1. Wrong Environment File
Make sure you're using the correct environment:
- **Local:** Copy `.env.local` to `.env`
- **Production:** Use existing `.env`

### 2. Database Issues
```bash
# Run migrations
php artisan migrate --env=local

# Seed database
php artisan db:seed --class=SuperAdminSeeder
```

### 3. Key Generation
```bash
# Generate new application key
php artisan key:generate --env=local
```

## API Testing

### Test Login Endpoint
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "itmaintainance@gmail.com",
    "password": "SuperAdmin123!"
  }'
```

### Expected Response
```json
{
  "message": "Login successful",
  "user": {
    "id": 22,
    "name": "IT Maintenance",
    "email": "itmaintainance@gmail.com",
    "role": "superadmin",
    "holding_id": null
  },
  "token": "...",
  "frontend_url": "http://localhost:3000"
}
```

## Contact Support

Jika masalah masih berlanjut:
1. Check log files: `storage/logs/laravel.log`
2. Enable debug mode: `APP_DEBUG=true`
3. Check network console in browser
4. Verify server is running: `php artisan serve`