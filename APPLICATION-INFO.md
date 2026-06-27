# 📋 Informasi Aplikasi PageSpeed Monitor

## 🌐 **URL Aplikasi:**
- **Frontend:** https://pagespeed.syntax.co.id
- **Backend API:** https://speed-api.syntax.co.id

## 👤 **Login Super Admin:**
- **Email:** itmaintainance@gmail.com
- **Password:** SuperAdmin123!
- **Role:** superadmin (akses penuh)

## 🚀 **Startup File:**
Untuk menjalankan aplikasi setelah restart server:
```bash
chmod +x startup.sh
./startup.sh
```

## 📁 **Struktur Folder:**
```
/public_html/speed-api.syntax.co.id/
├── startup.sh              ← File startup
├── .env                    ← Konfigurasi production
├── app/                    ← Kode aplikasi
├── public/                 ← Document root
├── storage/                ← File storage & logs
├── vendor/                 ← Dependencies
└── frontend/               ← Frontend React
```

## 🔧 **Maintenance Commands:**
```bash
# Clear cache
rm -rf bootstrap/cache/*.php
rm -rf storage/framework/cache/data/*

# Set permissions
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/

# Check logs
tail -f storage/logs/laravel.log

# Create new admin
php artisan make:superadmin email@domain.com password "Name"
```

## 📊 **Fitur Aplikasi:**
- ✅ Website Management
- ✅ PageSpeed Monitoring
- ✅ OJS Instance Management
- ✅ SOP Web Management
- ✅ Support Ticket System
- ✅ Notification System
- ✅ User Management

## 🆘 **Troubleshooting:**
Jika aplikasi error setelah restart:
1. Jalankan `./startup.sh`
2. Cek permissions: `chmod -R 755 storage/`
3. Clear cache manual
4. Cek logs: `tail -f storage/logs/laravel.log`

## 📞 **Support:**
Untuk bantuan teknis, hubungi IT Maintenance atau cek dokumentasi di folder project.