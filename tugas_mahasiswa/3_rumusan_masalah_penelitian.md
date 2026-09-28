# RUMUSAN MASALAH PENELITIAN

**Topik Penelitian:** Sistem Pemantauan Kinerja Website Otomatis dan Pengamanan Kredensial Akses menggunakan Metode Otentikasi Lapis Kedua Terdesentralisasi  
**Studi Kasus:** Infrastruktur OJS pada CV Syntax Corporation Indonesia  

---

## 1. Identifikasi Masalah Praktis vs. Masalah Penelitian
Dalam konteks akademis dan metodologi rekayasa (seperti *Design Science Research*), penting untuk membedakan antara **masalah praktis** di lapangan dan **masalah penelitian** yang ingin dipecahkan secara ilmiah.

| Dimensi | Masalah Praktis (Dunia Nyata) | Masalah Penelitian (Akademik) |
|---|---|---|
| **Monitoring Kinerja** | Lambatnya pendeteksian website jurnal OJS yang lambat karena pengecekan manual satu per satu. | Bagaimana merancang arsitektur sistem pemantauan terpusat yang mampu mengonsumsi API pihak ketiga (Google PageSpeed) secara efisien dan konsisten tanpa membebani memori server? |
| **Keamanan Kredensial** | Kredensial OJS rentan bocor karena disimpan secara tidak aman atau diakses oleh pengguna tanpa audit trail. | Bagaimana merancang mekanisme otentikasi lapis kedua (*decoupled dual-token authentication*) untuk mengamankan data sensitif pada sistem berbasis SPA-API? |
| **Integrasi Sesi** | Terjadi konflik otentikasi di mana update kredensial OJS gagal tersimpan akibat masa aktif token utama yang berbeda dengan token sesi aman. | Bagaimana menyinkronkan status otentikasi antara sesi aplikasi utama (Laravel Sanctum) dengan sesi aman khusus (`X-OJS-Session`) tanpa mengorbankan aspek *usability*? |

---

## 2. Rumusan Masalah Penelitian (Research Questions)
Berdasarkan identifikasi masalah di atas, maka rumusan masalah dalam penelitian ini dirumuskan sebagai berikut:

1. **RQ-1 (Aspek Perancangan & Pemantauan):**  
   *Bagaimana merancang dan mengimplementasikan arsitektur dasbor terintegrasi yang mampu melakukan penarikan data metrik kinerja web secara otomatis menggunakan Google PageSpeed Insights API untuk puluhan domain secara terjadwal?*
2. **RQ-2 (Aspek Keamanan & Otentikasi):**  
   *Bagaimana merancang model otentikasi lapis kedua menggunakan mekanisme sesi terisolasi (custom token `X-OJS-Session`) untuk mengamankan manajemen kredensial admin OJS pada arsitektur decoupled (Laravel Backend & React Frontend)?*
3. **RQ-3 (Aspek Evaluasi & Sinkronisasi Sesi):**  
   *Bagaimana menyelesaikan anomali kegagalan penyimpanan data kredensial akibat ketidaksinkronan antara sesi Laravel Sanctum dan sesi OJS Secure, serta bagaimana pengaruhnya terhadap efisiensi operasional tim IT Maintenance?*

---

## 3. Tujuan Penelitian (Research Objectives)
Tujuan dari penelitian/tugas akhir ini adalah:
1. **Mengembangkan artefak** berupa sistem PageSpeed Monitor yang mampu mengumpulkan metrik kinerja website secara otomatis dan menyajikannya dalam bentuk visualisasi tren historis.
2. **Mengimplementasikan model otentikasi lapis kedua (OJS Secure)** dengan enkripsi database berbasis AES-256 dan token sesi khusus untuk mencegah akses ilegal ke kredensial admin.
3. **Mengevaluasi efisiensi operasional** sistem monitoring otomatis dan menguji keandalan sistem otentikasi ganda yang diusulkan terhadap potensi ancaman eskalasi hak akses (*privilege escalation*).

---

## 4. Manfaat Penelitian (Research Significance)

### 4.1. Manfaat Teoritis (Akademis)
* Memberikan kontribusi berupa literatur dan studi kasus nyata mengenai penerapan otentikasi ganda (*dual-token authentication*) pada arsitektur aplikasi web modern yang terpisah (*decoupled frontend-backend*).
* Menjadi referensi penelitian dalam penerapan kerangka kerja *Design Science Research (DSR)* di bidang rekayasa perangkat lunak untuk mengatasi masalah keamanan data sensitif.

### 4.2. Manfaat Praktis (Industri)
* Membantu CV Syntax Corporation Indonesia dalam menjaga stabilitas kinerja website jurnal kelolaannya guna mempertahankan reputasi indeksasi jurnal.
* Meminimalkan risiko kebocoran kredensial admin OJS secara signifikan dengan beralih dari penyimpanan manual/spreadsheet ke sistem database terenkripsi dan terproteksi sesi khusus.
* Mengurangi beban kerja tim IT Maintenance dari pemantauan manual menjadi sistem berbasis dasbor otomatis.
