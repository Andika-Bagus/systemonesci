# BUSINESS REQUIREMENTS DOCUMENT (BRD)

**Nama Proyek:** Dashboard PageSpeed Monitor & OJS Secure  
**Versi Dokumen:** 1.0  
**Tanggal:** 9 Juli 2026  
**Penulis:** Tim Mahasiswa Magang IT  
**Klien:** CV Syntax Corporation Indonesia  

---

## 1. Ringkasan Eksekutif (Executive Summary)
CV Syntax Corporation Indonesia (Syntax Indonesia) mengelola infrastruktur web untuk publikasi ilmiah, terutama puluhan jurnal nasional dan internasional yang berjalan di atas platform Open Journal Systems (OJS). Mengingat pentingnya reputasi kecepatan akses jurnal untuk indeksasi global (seperti Scopus atau DOAJ) dan tingginya resiko keamanan akun administratif jurnal, proyek ini mengusulkan pengembangan **Sistem Pemantauan PageSpeed & Manajemen Sesi Aman (OJS Secure)**.

Sistem ini akan memberikan visibilitas penuh terhadap performa website secara berkala dan memperketat akses keamanan kredensial admin OJS.

---

## 2. Latar Belakang & Kebutuhan Bisnis (Business Needs)
Beberapa kendala operasional yang dihadapi oleh Syntax Indonesia saat ini meliputi:
1. **Kecepatan Akses Lambat Mempengaruhi Indeksasi Jurnal:** Kinerja server yang lambat berakibat pada turunnya skor Google PageSpeed, yang secara tidak langsung berdampak buruk pada kenyamanan penulis (*author*) dan proses akreditasi jurnal.
2. **Keterbatasan Pemantauan Manual:** Tim IT Maintenance harus mengecek kecepatan website satu per satu secara manual. Ini tidak efisien dan rentan terhadap keterlambatan deteksi server down atau performa drop.
3. **Resiko Keamanan Kredensial Bersama:** Akun administrator OJS seringkali dibagikan di antara tim pendukung menggunakan metode yang kurang aman. Jika sistem utama diretas, kredensial OJS juga akan terekspos jika tidak dienkripsi dan diisolasi dengan benar.

---

## 3. Deskripsi Sistem (System Description)
Aplikasi ini dikembangkan sebagai aplikasi web modern berbasis:
* **Backend:** Laravel (PHP 8.2) dengan Sanctum untuk otentikasi umum.
* **Frontend:** React (SPA) dengan TypeScript dan Vite untuk rendering antarmuka pengguna yang dinamis dan cepat.
* **Integrasi Eksternal:** Google PageSpeed Insights API untuk pengambilan data otomatis.

Sistem ini memiliki dua pilar utama:
1. **PageSpeed Monitoring:** Mengumpulkan, menganalisis, dan membandingkan performa website secara berkala (harian/mingguan).
2. **OJS Secure:** Menyimpan kredensial admin OJS secara terenkripsi dan mewajibkan otentikasi lapis kedua (session berdurasi 30 menit) menggunakan token khusus (`X-OJS-Session`) untuk melihat atau mengedit kredensial tersebut.

---

## 4. Kebutuhan Fungsional Utama (Functional Requirements)

| ID Kebutuhan | Deskripsi Fitur | Pengguna Terkait |
|--------------|-----------------|------------------|
| **FR-01** | CRUD Data Website & Domain Jurnal (URL, Nama Holding) | Super Admin / IT Maintenance |
| **FR-02** | Integrasi API Google PageSpeed untuk pengambilan otomatis metrik performa (Mobile & Desktop) | Sistem |
| **FR-03** | Visualisasi Tren Performa (Grafik histori skor PageSpeed harian) | Semua User Terotentikasi |
| **FR-04** | Dasbor Perbandingan Skor PageSpeed antar website kelolaan | Semua User Terotentikasi |
| **FR-05** | Otentikasi Lapis Kedua untuk Mengakses Kredensial OJS (Modul OJS Secure) | Super Admin / IT Maintenance |
| **FR-06** | Enkripsi data `ojs_username` dan `ojs_password` pada database (AES-256) | Sistem |
| **FR-07** | Manajemen Sesi Aktif OJS Secure (Timeout otomatis setelah 30 menit) | Sistem |
| **FR-08** | Manajemen SOP Web (Dokumentasi penyelesaian kendala server) | IT Maintenance |

---

## 5. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### 5.1. Keamanan (Security)
* **Enkripsi Kredensial:** Password dan username OJS disimpan menggunakan enkripsi simetris dua arah (AES-256) dengan key yang disimpan di file konfigurasi server `.env`.
* **Isolasi Sesi:** Token sesi OJS Secure disimpan di `localStorage` frontend secara terpisah dari token utama. Token sesi OJS Secure memiliki batas kadaluarsa 30 menit dan langsung dihapus setelah logout.

### 5.2. Kinerja & Ketersediaan (Performance & Availability)
* **Response Time API:** Waktu respons backend untuk otentikasi dan verifikasi sesi harus di bawah 500 ms.
* **Uptime Sistem:** Dasbor pemantauan harus memiliki ketersediaan (uptime) minimal 99.5% per bulan.

---

## 6. Kriteria Sukses Terukur (Measurable Success Criteria)

Untuk memastikan bahwa proyek ini memberikan nilai tambah bagi bisnis, berikut adalah kriteria keberhasilan yang disepakati:

1. **Efisiensi Waktu Monitoring:**
   * **Sebelum:** Tim IT memerlukan waktu rata-rata **4 jam per minggu** untuk menguji kecepatan 20+ website satu per satu secara manual.
   * **Target:** Proses otomatisasi memangkas waktu pengujian hingga **< 10 menit per minggu** (hanya membaca ringkasan otomatis di dasbor).
2. **Keamanan Data Kredensial:**
   * **Target:** Kebocoran data kredensial admin OJS bernilai **0% (Nol Insiden)** melalui isolasi sesi `X-OJS-Session` dan enkripsi database.
3. **Akurasi Data Performa:**
   * **Target:** Data metrik Core Web Vitals (LCP, FID, CLS) memiliki tingkat akurasi **100% sama** dengan hasil pengujian Google PageSpeed Insights resmi.
4. **Penerimaan Pengguna (User Acceptance):**
   * **Target:** Skor pengujian kepuasan pengguna menggunakan kuesioner *System Usability Scale (SUS)* oleh tim IT Maintenance mencapai minimal **75 (Kategori Good/Excellent)**.
