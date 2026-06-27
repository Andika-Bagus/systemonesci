# Super Admin Documentation

## User Super Admin

User super admin telah berhasil dibuat dengan detail berikut:

- **Email:** `itmaintainance@gmail.com`
- **Password:** `SuperAdmin123!`
- **Role:** `superadmin`
- **Nama:** `IT Maintenance`

## Hak Akses Super Admin

Super Admin memiliki akses penuh ke semua fitur sistem:

1. **Manajemen Website** - Dapat mengelola semua website dari semua holding
2. **Manajemen OJS Instance** - Dapat mengelola semua instance OJS
3. **Manajemen SOP Web** - Dapat mengelola semua SOP web
4. **Manajemen Ticket** - Dapat melihat dan mengelola semua ticket
5. **PageSpeed Monitoring** - Dapat memantau performa semua website
6. **Manajemen User** - Dapat mengelola semua user (jika fitur tersedia)
7. **Notifikasi** - Dapat melihat semua notifikasi sistem

## Perbedaan Role

### Super Admin (`superadmin`)
- Akses penuh ke semua fitur
- Tidak terikat ke holding tertentu (`holding_id = null`)
- Dapat melihat data dari semua holding

### Admin (`admin`)
- Akses ke sebagian besar fitur
- Mungkin terikat ke holding tertentu
- Akses terbatas berdasarkan holding

### User Ticket (`user_tiket`)
- Hanya dapat mengakses halaman ticket
- Akses terbatas untuk membuat dan melihat ticket

## Command Artisan

Untuk membuat super admin baru atau mengupdate user existing:

```bash
# Membuat super admin dengan parameter
php artisan make:superadmin itmaintainance@gmail.com SuperAdmin123! "IT Maintenance"

# Membuat super admin dengan prompt interaktif
php artisan make:superadmin

# Menjalankan seeder super admin
php artisan db:seed --class=SuperAdminSeeder
```

## Keamanan

1. **Password Strong:** Password default menggunakan kombinasi huruf besar, kecil, angka, dan simbol
2. **Email Verified:** User otomatis ter-verifikasi saat dibuat
3. **Role Validation:** Sistem harus memvalidasi role sebelum memberikan akses
4. **Audit Trail:** Semua aktivitas super admin sebaiknya di-log untuk audit

## Login

Super admin dapat login melalui:
- **Frontend:** `https://pagespeed.syntax.co.id`
- **API Endpoint:** `POST /api/login`

Credentials:
```json
{
  "email": "itmaintainance@gmail.com",
  "password": "SuperAdmin123!"
}
```

## Catatan Penting

1. **Ganti Password:** Disarankan untuk mengganti password default setelah login pertama
2. **Backup:** Pastikan ada backup user super admin lain untuk menghindari lockout
3. **Monitoring:** Monitor aktivitas super admin untuk keamanan sistem
4. **Update Role:** Jika ada perubahan struktur role, pastikan super admin tetap memiliki akses penuh