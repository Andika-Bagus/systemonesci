# Materi Presentasi & Persiapan Wawancara UAS
**Proyek: Aplikasi PageSpeed Monitor & Web Management System**

---

### a. Deskripsi Proyek
*   **Nama Proyek:** Aplikasi PageSpeed Monitor & Web Management Dashboard.
*   **Tujuan Utama:** Membangun sistem monitoring performa website (kecepatan *loading* halaman/PageSpeed) secara terpusat, sekaligus mengelola berbagai *instance* website, sistem *ticketing* dukungan teknis, dan manajemen *Open Journal Systems* (OJS).
*   **User/Instansi yang Membutuhkan:** Tim IT/Maintenance dan Manajemen dari **Syntax Corporation (syntax.co.id)** atau instansi yang mengelola banyak *website* dan jurnal secara massal, yang membutuhkan satu *dashboard* untuk memonitor performa dan manajemen kendala sistem.

### b. Persentase Progress
*   **Progress Berjalan:** Proyek saat ini berada di progress **85% - 90%** (Tahap *Production/Deployment Preparation*).
*   **Bagian yang sudah *fixed* (selesai):** Arsitektur dasar Backend API (Laravel), Frontend (React/Vite), sistem Autentikasi Role-Based (Super Admin/User), Website Management Dashboard, dan PageSpeed Monitoring.
*   **Bagian yang masih *on-progress*:** Penyempurnaan sistem *Uptime Monitoring* dan *bug fixing* pada bagian *environment deployment* server.

### c. Metodologi Pengembangan
*   **Metode yang Digunakan:** **Agile (Scrum)**.
*   **Alasan Ilmiah Pemilihan Metode:** Sistem ini dikembangkan menggunakan arsitektur *decoupled* (Frontend React terpisah dengan Backend Laravel API). Metode Agile dipilih karena memungkinkan pengembangan secara iteratif *(sprint)* di mana modul frontend dan backend dapat dikerjakan secara paralel. Agile juga sangat adaptif terhadap perubahan kebutuhan *(requirement)* dari instansi terkait penambahan jenis website yang perlu dimonitor (seperti OJS dan CMS custom lainnya) tanpa harus merombak sistem dari awal.

### d. Tracking Tahapan (Jika Menentukan Waterfall)
*(Abaikan poin ini jika Anda memilih Agile pada poin C. Jika Dosen mewajibkan Waterfall, gunakan jawaban di bawah ini)*
*   **Tahap Saat Ini:** Berada di tahap akhir **Testing & Deployment** (Implementasi).
*   **Bukti:** Terdapatnya *file* dokumentasi *deployment* yang ekstensif pada repositori (seperti `DEPLOYMENT.md`, script `startup.sh`, dll) yang menunjukkan sistem sedang dalam tahap pengujian integrasi di lingkungan server (production).

### e. Tracking Iterasi (Jika Menentukan Agile)
*   **Posisi Saat Ini:** Berada pada **Sprint ke-4** (Tahap Stabilisasi & Integrasi).
*   **Fitur Spesifik yang Dikejar pada Iterasi Ini:** Saat ini sedang fokus menyelesaikan integrasi modul **Uptime Monitoring**, memastikan stabilitas API, dan kelancaran *Continuous Integration/Deployment* pada server.

### f. Capaian Fitur Berhasil
Modul yang sudah berhasil diuji dan siap digunakan adalah:
1.  **User Management & Autentikasi Role-Based:** (Super Admin, User biasa).
2.  **Website Management Dashboard:** CRUD data *website* yang dikelola.
3.  **PageSpeed Monitoring API:** Fitur utama untuk menarik dan menampilkan data kecepatan situs.
4.  **OJS Instance Management:** Fitur *monitoring* spesifik untuk website jurnal ilmiah.

### g. Kendala Fitur Tertunda
*   **Fitur yang Belum Selesai:** Modul **Uptime Monitoring** (Pemantauan Status Server/Website *Online* atau *Offline* secara *real-time*).
*   **Bottleneck (Penyebab):** Terdapat kendala teknis dalam pengaturan interval *cron job* di server (*backend*) yang memakan terlalu banyak memori (*resource*) ketika melakukan *ping* ke puluhan website secara bersamaan. Jika dipaksakan saat ini, bisa menyebabkan beban server utama (CPU *load*) menjadi sangat tinggi.
*   **Target Penyelesaian:** Ditargetkan selesai pada minggu depan (Sprint selanjutnya) dengan memperbaiki logika pengecekan menjadi *asynchronous*.

### h. Manajemen Perubahan (Requirement Change)
*   **Perubahan Kebutuhan:** Di tengah proyek, klien/pembimbing meminta agar sistem tidak hanya memonitor website *company profile* (WordPress), tetapi juga sistem jurnal akademik berbasis OJS (*Open Journal Systems*).
*   **Penyesuaian Arsitektur:** Arsitektur database dan *controller* disesuaikan dengan menambahkan entitas "OJS Instance Management". Sistem backend dipertahankan menjadi modular (RESTful API) sehingga penambahan platform monitoring baru (seperti OJS) tidak merusak alur monitoring yang sudah berjalan sebelumnya.

### i. Identifikasi Masalah Utama
*   **Kendala Terbesar:** **Teknis Integrasi Perangkat & Eksternal API**.
*   **Detail:** Masalah terbesar adalah memastikan API dari Laravel dapat berkomunikasi dengan lancar bersama *frontend* React di server yang berbeda (berkaitan dengan isu CORS dan keamanan API), serta menangani batasan limit *request* harian dari pihak ketiga (Google PageSpeed API) agar tidak terblokir saat sistem memonitor puluhan website sekaligus.

### j. Rencana Aksi (Next Action Plan)
*   **Prioritas Kerja:**
    1.  **Fokus Utama:** Memperbaiki algoritma pengecekan server pada fitur **Uptime Monitoring** menggunakan metode *asynchronous* (menggunakan *Queue/Background Job* di Laravel) agar tidak memberatkan CPU server utama.
    2.  Melakukan finalisasi skenario *testing* (UAT - *User Acceptance Testing*) bersama tim manajemen/klien untuk fitur-fitur yang sudah *live*.
    3.  Melaksanakan finalisasi proses *deployment* agar seluruh sistem 100% *live* dan stabil digunakan sesuai dengan standar pada dokumen *deployment*.
