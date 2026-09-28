# DRAFT KESEPAKATAN PROYEK

**Nama Proyek:** Pengembangan Sistem PageSpeed Monitor & Integrasi Manajemen Kredensial Aman OJS (Open Journal Systems)  
**Mitra/Klien:** CV Syntax Corporation Indonesia (Syntax Indonesia)  
**Pihak Pengembang:** Tim Mahasiswa Magang IT / Rekayasa Perangkat Lunak  
**Tanggal Mulai:** 1 Juli 2026  
**Tanggal Selesai:** 30 September 2026  

---

## 1. Latar Belakang & Masalah
CV Syntax Corporation Indonesia mengelola puluhan website jurnal ilmiah berbasis Open Journal Systems (OJS) serta beberapa landing page bisnis. Pemantauan performa (kecepatan akses) dan pemeliharaan keamanan kredensial admin OJS selama ini dilakukan secara manual, yang memiliki keterbatasan:
1. **Keterlambatan Deteksi Kinerja:** Tidak ada sistem terpusat untuk memantau nilai PageSpeed (LCP, FID, CLS) secara otomatis, sehingga jika ada jurnal yang lambat diakses, hal tersebut lambat terdeteksi.
2. **Resiko Keamanan Kredensial:** Data akun admin OJS (username dan password) disimpan dalam spreadsheet bersama atau database konvensional yang rentan terhadap kebocoran data.

Untuk itu, dibutuhkan sebuah platform monitoring terpadu yang memantau performa web secara real-time dan mengamankan pengelolaan kredensial melalui gerbang enkripsi dan sesi terisolasi (*OJS Secure*).

---

## 2. Tujuan Proyek
1. **Otomatisasi Monitoring:** Membangun dasbor terpusat untuk memantau performa PageSpeed (Mobile & Desktop) dari seluruh domain website jurnal secara otomatis menggunakan Google PageSpeed Insights API.
2. **Manajemen Sesi Aman (OJS Secure):** Mengembangkan modul otentikasi lapis kedua (OJS Secure) untuk mengisolasi sesi administrasi kredensial OJS dari otentikasi utama aplikasi guna mencegah eskalasi hak akses (privilege escalation).
3. **Optimasi Pemeliharaan:** Menyediakan sistem notifikasi dan riwayat tren performa untuk mempercepat diagnosis masalah server/CDN oleh tim IT Maintenance.

---

## 3. Ruang Lingkup Proyek (Scope of Work)

### Di Dalam Ruang Lingkup (In-Scope)
1. **Pengembangan Backend (Laravel PHP 8.2):**
   * Pembuatan API manajemen website dan OJS instances.
   * Implementasi Google PageSpeed Insights API untuk penarikan metrik otomatis.
   * Implementasi database terenkripsi untuk menyimpan `ojs_username` dan `ojs_password`.
   * Pengembangan endpoint otentikasi sesi khusus `OjsSecureController` menggunakan Sanctum dan token sesi terpisah (`X-OJS-Session`).
2. **Pengembangan Frontend (React + TypeScript + Vite):**
   * Dasbor visualisasi skor PageSpeed (Desktop & Mobile), tren histori, dan perbandingan performa antar domain.
   * Modul antarmuka *OJS Secure* dengan proteksi ganda (pengguna harus login ke sistem utama dan memasukkan kredensial master OJS Secure untuk membuka data enkripsi).
3. **Pengujian Fungsional & Keamanan:**
   * Pengujian performa API dan validitas data PageSpeed.
   * Audit keamanan otentikasi sesi OJS Secure.

### Di Luar Ruang Lingkup (Out-of-Scope)
1. **Migrasi Data Jurnal:** Proses migrasi konten artikel jurnal antar OJS tidak ditangani oleh sistem ini.
2. **Optimasi Kode Server OJS secara Otomatis:** Sistem hanya memantau dan memberikan rekomendasi perbaikan performa (PageSpeed Insights), tetapi tidak melakukan perbaikan kode secara otomatis pada server OJS klien.

---

## 4. Deliverables (Hasil Akhir)
1. **Aplikasi Web PageSpeed & OJS Monitor:**
   * **Backend API:** Berupa aplikasi Laravel yang siap dideploy di server hosting.
   * **Frontend Single Page Application (SPA):** Bundel file React statis (`dist/`) yang terintegrasi dengan backend.
2. **Skema Database & Migrasi:** Script migrasi MySQL/MariaDB yang mencakup tabel data website, performa harian, dan tabel `ojs_secure_sessions`.
3. **Panduan Operasional & Maintenance (SOP):** Dokumentasi deployment, startup server, dan tata cara penambahan administrator baru.

---

## 5. Persetujuan & Tanda Tangan

Dengan menandatangani dokumen ini, kedua belah pihak menyetujui ruang lingkup dan tujuan proyek yang telah dijabarkan di atas.

| Perwakilan CV Syntax Corporation Indonesia | Perwakilan Tim Mahasiswa Pengembang |
|--------------------------------------------|-----------------------------------|
|                                            |                                   |
| (........................................) | (................................) |
| IT Maintenance & Infrastructure            | Ketua Tim Pengembang              |
| Tanggal:                                   | Tanggal:                          |
