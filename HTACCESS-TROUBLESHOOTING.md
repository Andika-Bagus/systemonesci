# .htaccess Troubleshooting Guide

## Problem: API Links Download Instead of Executing

### Symptoms:
- Mengakses `/api/login` di browser malah download file PHP
- API tidak bisa diakses dari frontend
- Error 500 atau file download

### Solutions:

## 1. **Check PHP Handler**

Masalah paling umum adalah PHP handler yang salah. Coba ganti di `.htaccess`:

```apache
# Try different PHP handlers (uncomment one that works):

# Option 1: Alt PHP (most common for shared hosting)
AddHandler application/x-httpd-alt-php84___lsphp .php .php8 .phtml

# Option 2: Standard PHP 8
AddHandler application/x-httpd-php8 .php

# Option 3: Generic PHP
AddHandler application/x-httpd-php .php

# Option 4: CGI PHP
AddHandler php-cgi .php

# Option 5: FastCGI
AddHandler php-fastcgi .php
```

## 2. **Use Alternative .htaccess Files**

Saya sudah buatkan beberapa versi:

### Simple Version (`.htaccess.simple`)
```bash
cp .htaccess.simple .htaccess
```

### Shared Hosting Version (`.htaccess.shared-hosting`)
```bash
cp .htaccess.shared-hosting .htaccess
```

## 3. **Check Server Configuration**

### Apache Modules Required:
- `mod_rewrite` (for URL rewriting)
- `mod_headers` (for CORS headers)
- `mod_mime` (for content types)

### Check if modules are enabled:
```bash
# On server, check Apache modules
apache2ctl -M | grep rewrite
apache2ctl -M | grep headers
```

## 4. **Directory Structure Check**

Make sure your directory structure is correct:
```
/
├── .htaccess (root)
├── public/
│   ├── .htaccess (public)
│   ├── index.php
│   └── ...
├── app/
├── config/
└── ...
```

## 5. **Test Different Configurations**

### Test 1: Minimal .htaccess
```apache
RewriteEngine On
RewriteRule ^(.*)$ public/$1 [L]
AddHandler application/x-httpd-alt-php84___lsphp .php
```

### Test 2: Without public folder redirect
If your hosting points directly to public folder:
```apache
# Remove the public redirect, use only public/.htaccess
```

### Test 3: Check PHP version
```php
<?php
// Create test.php in public folder
phpinfo();
?>
```

## 6. **Hosting-Specific Solutions**

### cPanel/Shared Hosting:
1. Check PHP version in cPanel
2. Use "Alt PHP" handler
3. Make sure mod_rewrite is enabled

### VPS/Dedicated Server:
1. Enable Apache modules:
   ```bash
   a2enmod rewrite
   a2enmod headers
   systemctl restart apache2
   ```

### Nginx:
Use nginx config instead of .htaccess:
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
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## 7. **Debug Steps**

### Step 1: Test basic PHP
Create `test.php` in root:
```php
<?php
echo "PHP is working!";
?>
```

### Step 2: Test Laravel
Access: `https://speed-api.syntax.co.id/public/`

### Step 3: Test API
Access: `https://speed-api.syntax.co.id/api/login`

### Step 4: Check logs
```bash
tail -f /var/log/apache2/error.log
tail -f storage/logs/laravel.log
```

## 8. **Quick Fixes**

### Fix 1: Rename .htaccess temporarily
```bash
mv .htaccess .htaccess.backup
# Test if site works without .htaccess
```

### Fix 2: Check file permissions
```bash
chmod 644 .htaccess
chmod 644 public/.htaccess
```

### Fix 3: Clear server cache
```bash
# If using cPanel, clear cache in File Manager
# Or restart Apache if you have access
```

## 9. **Contact Hosting Provider**

If nothing works, ask your hosting provider:
1. "What PHP handler should I use?"
2. "Is mod_rewrite enabled?"
3. "Can you help configure Laravel .htaccess?"

## 10. **Alternative: Subdomain Setup**

If .htaccess keeps causing issues, set up subdomain to point directly to `public/` folder:
- Point `speed-api.syntax.co.id` to `/public/` directory
- Use only `public/.htaccess`
- Remove root `.htaccess`

This is often the cleanest solution for shared hosting!