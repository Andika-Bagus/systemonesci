# RENCANA PENGUJIAN DAN INSTRUMEN EVALUASI

**Fokus Evaluasi:** Validasi Kinerja Teknis (Performance & Security) dan Penerimaan Pengguna (Usability)  
**Metode Evaluasi:** Uji Coba Blackbox, Analisis Keamanan Sesi, dan Kuesioner System Usability Scale (SUS)  

---

## 1. Rencana Pengujian Teknis (Technical Testing Plan)

Pengujian teknis dilakukan untuk memastikan bahwa aplikasi berfungsi sesuai spesifikasi kebutuhan non-fungsional (keamanan dan performa).

### 1.1. Pengujian Keamanan Modul OJS Secure (Access Control & Session)
Pengujian ini bertujuan memverifikasi bahwa endpoint data sensitif OJS benar-benar terisolasi dan tidak dapat diakses tanpa otentikasi ganda yang sah.

| Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Status Kelulusan |
|---|---|---|---|
| **Akses Tanpa Login Utama** | Mengirimkan request `GET /api/ojs-secure/instances` tanpa token Bearer Sanctum. | API mengembalikan respon **401 Unauthorized** (Laravel Sanctum memblokir request). | [ ] Lulus / [ ] Gagal |
| **Akses Tanpa Sesi OJS Secure** | Melakukan login utama (Sanctum aktif), lalu mengirimkan request `GET /api/ojs-secure/instances` tanpa header `X-OJS-Session`. | API mengembalikan respon **401 Unauthorized** dengan pesan *"No session token provided"*. | [ ] Lulus / [ ] Gagal |
| **Akses dengan Sesi Kadaluarsa** | Membuat sesi OJS Secure, memanipulasi waktu kedaluwarsa di database (`expires_at` diubah menjadi masa lalu), lalu memanggil `GET /api/ojs-secure/instances`. | API mengembalikan respon **401 Unauthorized** dengan pesan *"Session invalid or expired"*. | [ ] Lulus / [ ] Gagal |
| **Pengujian Enkripsi Database** | Melakukan query langsung ke database: `SELECT ojs_username, ojs_password FROM ojs_instances`. | Data username dan password tampil dalam format ciphertext acak hasil enkripsi AES-256 (bukan plaintext). | [ ] Lulus / [ ] Gagal |

### 1.2. Pengujian Kinerja Penarikan Data PageSpeed
Pengujian ini memverifikasi integrasi sistem dengan Google PageSpeed Insights API.

| Metrik Teknis | Cara Pengukuran | Target Kriteria Sukses |
|---|---|---|
| **Akurasi Skor** | Membandingkan skor performa yang tersimpan di database dengan hasil tes langsung pada web [PageSpeed Insights](https://pagespeed.web.dev/). | Selisih skor = 0 (100% sama untuk waktu pengambilan yang sama). |
| **Waktu Respon API** | Mengukur latency waktu respon API `POST /api/ojs-secure/verify` menggunakan Postman/JMeter. | Rata-rata response time < 500 ms di bawah beban 10 request bersamaan. |

---

## 2. Instrumen Pengujian Non-Teknis: Kuesioner Usability (SUS)

Untuk mengukur penerimaan dan kemudahan penggunaan aplikasi oleh tim IT Maintenance CV Syntax Corporation Indonesia, digunakan instrumen **System Usability Scale (SUS)**. SUS merupakan instrumen standar industri yang terdiri dari 10 pertanyaan skala Likert 1-5 (Sangat Tidak Setuju s.d. Sangat Setuju).

### 2.1. Daftar Pertanyaan Kuesioner SUS

| No | Pernyataan Kuesioner SUS | STS (1) | TS (2) | N (3) | S (4) | SS (5) |
|---|---|:---:|:---:|:---:|:---:|:---:|
| 1 | Saya rasa saya akan sering menggunakan aplikasi PageSpeed Monitor & OJS Secure ini dalam pekerjaan sehari-hari. | | | | | |
| 2 | Saya merasa antarmuka aplikasi ini terlalu rumit, padahal seharusnya bisa lebih sederhana. | | | | | |
| 3 | Saya merasa aplikasi ini sangat mudah untuk digunakan. | | | | | |
| 4 | Saya rasa saya membutuhkan bantuan orang lain atau panduan khusus untuk dapat mengoperasikan aplikasi ini. | | | | | |
| 5 | Saya merasa fitur-fitur di dalam aplikasi ini (monitoring performa & enkripsi sesi) terintegrasi dengan sangat baik. | | | | | |
| 6 | Saya rasa terlalu banyak hal yang tidak konsisten (membingungkan) pada sistem aplikasi ini. | | | | | |
| 7 | Saya membayangkan bahwa sebagian besar pengguna akan dengan cepat memahami cara menggunakan aplikasi ini. | | | | | |
| 8 | Saya merasa aplikasi ini sangat tidak praktis dan membingungkan saat digunakan. | | | | | |
| 9 | Saya merasa sangat yakin dan aman saat mengelola kredensial OJS menggunakan modul OJS Secure ini. | | | | | |
| 10 | Saya perlu membiasakan diri atau belajar banyak hal terlebih dahulu sebelum mahir menggunakan aplikasi ini. | | | | | |

*Keterangan: STS = Sangat Tidak Setuju, TS = Tidak Setuju, N = Netral, S = Setuju, SS = Sangat Setuju.*

### 2.2. Formula Perhitungan Skor SUS
Skor SUS dihitung menggunakan rumus berikut untuk menghasilkan angka indeks antara 0 - 100:
1. Untuk pertanyaan **bernomor ganjil (1, 3, 5, 7, 9)**: Skor Pertanyaan = (Skor Jawaban Responden) - 1.
2. Untuk pertanyaan **bernomor genap (2, 4, 6, 8, 10)**: Skor Pertanyaan = 5 - (Skor Jawaban Responden).
3. **Total Skor SUS** = (Jumlah Skor dari 10 Pertanyaan) $\times$ 2.5.

**Kriteria Penilaian Akhir SUS:**
* **Skor > 80.3:** *Excellent / Grade A* (Diterima dengan sangat baik).
* **Skor 68 - 80.3:** *Good / Grade B* (Diterima dengan baik).
* **Skor 51 - 67:** *Okay / Grade C* (Cukup diterima, butuh perbaikan marginal).
* **Skor < 51:** *Poor / Grade F* (Ditolak / Usability sangat rendah).
* *Target minimal kelulusan proyek:* **Skor Rata-rata $\ge$ 75** (Kategori Good).
