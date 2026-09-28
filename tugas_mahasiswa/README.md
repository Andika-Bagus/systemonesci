# Paket Dokumen Tugas Mahasiswa: PageSpeed & OJS Monitor

Paket ini berisi kumpulan dokumen perencanaan, analisis kebutuhan, metodologi, dan pengujian untuk tugas kuliah/magang mahasiswa yang disesuaikan dengan studi kasus proyek **PageSpeed Monitor & OJS Secure Management** di CV Syntax Corporation Indonesia (Syntax Indonesia).

---

## 📂 Struktur Dokumen Tugas

1. **[1. Draft Kesepakatan Proyek](1_draft_kesepakatan_proyek.md)**
   * Berisi dokumen tujuan proyek, batas lingkup pengerjaan (*in-scope* & *out-of-scope*), dan *deliverables* (hasil akhir) proyek yang disepakati dengan klien.
2. **[2. Business Requirements Document (BRD)](2_brd_business_requirements_document.md)**
   * Berisi analisis masalah bisnis, kebutuhan fungsional (tabel fungsionalitas), non-fungsional (keamanan dan ketersediaan), serta kriteria sukses proyek terukur.
3. **[3. Rumusan Masalah Penelitian](3_rumusan_masalah_penelitian.md)**
   * Berisi proses pemetaan masalah industri di lapangan ke dalam bentuk pertanyaan penelitian akademik (*Research Questions*) untuk tesis/skripsi/laporan magang.
4. **[4. Rancangan Metode DSR](4_rancangan_metode_dsr.md)**
   * Berisi rancangan riset menggunakan metode akademis *Design Science Research (DSR)* (6 tahapan Peffers et al.) dan rencana pembagian artefak (konseptual, perangkat lunak, skema database).
5. **[5. Rencana Pengujian & Instrumen](5_rencana_pengujian_instrumen.md)**
   * Berisi skenario pengujian teknis (*blackbox*, enkripsi, integrasi API) serta instrumen evaluasi non-teknis berupa kuesioner skala *System Usability Scale (SUS)* lengkap dengan formula penghitungan skor kelulusannya.

---

## 📄 File Microsoft Word (.docx)

Kami telah menyediakan script otomatisasi untuk menggabungkan dan memformat seluruh dokumen di atas ke dalam sebuah berkas Microsoft Word formal yang siap digunakan:
* **Nama Berkas Hasil:** `Tugas_Mahasiswa_Proyek_OJS_Secure.docx`
* **Gaya Penulisan:** Font Arial, spasi 1.15, judul dan tabel bergaya profesional (Biru Navy & Abu-abu), serta lengkap dengan lembar sampul (cover).

### Cara Mengompilasi Ulang File Word:
Jika Anda melakukan perubahan isi pada file Markdown (.md) dan ingin memperbarui file Word-nya, Anda cukup menjalankan perintah berikut di terminal:

```bash
python tugas_mahasiswa/generate_docx.py
```

*Script tersebut secara otomatis akan menginstall library `python-docx` jika belum tersedia di komputer Anda, memproses semua file Markdown, dan menimpa berkas `.docx` dengan konten yang baru.*
