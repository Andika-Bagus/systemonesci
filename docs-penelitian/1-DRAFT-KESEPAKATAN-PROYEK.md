# DRAFT KESEPAKATAN PROYEK
## Syntax Comprehensive Interface (ITM SCI)

---

## 1. INFORMASI PROYEK

**Nama Proyek:** Syntax Comprehensive Interface (ITM SCI)

**Judul Penelitian:** 
Rancang Bangun Sistem Monitoring Terpadu untuk Manajemen 222 Aset Digital Menggunakan Pendekatan Design Science Research

**Organisasi:** PT Syntax Transformation Indonesia / Syntax Group

**Periode Pelaksanaan:** [Sesuaikan dengan waktu pengerjaan proyek]

**Peneliti/Developer:** [Nama Mahasiswa]

**Pembimbing Akademik:** [Nama Dosen Pembimbing]

**Stakeholder Perusahaan:** Tim IT Syntax / Management

---

## 2. LATAR BELAKANG

PT Syntax Transformation Indonesia mengelola **222 aset digital** yang terdiri dari website perusahaan dan sistem Open Journal System (OJS). Pengelolaan aset digital dalam skala besar ini menghadapi beberapa tantangan:

### 2.1 Permasalahan yang Dihadapi:
1. **Monitoring Manual yang Tidak Efisien**
   - Pemeriksaan status website dilakukan manual satu per satu
   - Membutuhkan waktu lama untuk memeriksa 222 aset
   - Risiko terlewatnya website yang bermasalah

2. **Kesulitan Tracking Domain Expiry**
   - Tidak ada sistem peringatan otomatis untuk domain yang akan expire
   - Risiko kehilangan domain karena telat perpanjangan
   - Data domain tersebar di berbagai tempat

3. **Tidak Ada Centralized Dashboard**
   - Informasi website tersebar di berbagai sistem
   - Sulit mendapatkan overview kondisi semua aset
   - Proses reporting memakan waktu

4. **Keamanan Kredensial OJS**
   - Kredensial login OJS tersimpan tidak terstruktur
   - Risiko kehilangan akses ke sistem OJS
   - Tidak ada audit trail untuk akses kredensial

5. **Monitoring Performance yang Terbatas**
   - Tidak ada tracking PageSpeed secara konsisten
   - Uptime monitoring tidak terintegrasi
   - Sulit mengidentifikasi website yang perlu optimasi

### 2.2 Kebutuhan Bisnis:
PT Syntax memerlukan sistem monitoring terpadu yang dapat:
- Memonitor status dan performa 222 website secara real-time
- Memberikan peringatan dini untuk masalah teknis
- Mengelola informasi domain dan kredensial secara aman
- Menyediakan dashboard komprehensif untuk decision making

---

## 3. TUJUAN PROYEK

### 3.1 Tujuan Umum:
Mengembangkan sistem monitoring terpadu berbasis web yang mampu mengelola dan memonitor 222 aset digital PT Syntax secara efisien, aman, dan terintegrasi.

### 3.2 Tujuan Khusus:
1. Merancang dan membangun dashboard monitoring yang user-friendly
2. Mengimplementasikan sistem tracking domain expiry otomatis
3. Membuat sistem manajemen kredensial OJS yang secure
4. Mengintegrasikan monitoring uptime dan PageSpeed
5. Menyediakan sistem notifikasi untuk peringatan dini
6. Membangun sistem pelaporan yang komprehensif

---

## 4. RUANG LINGKUP PROYEK

### 4.1 In Scope (Termasuk dalam Proyek):

#### A. Modul Website Management
- CRUD data website (222 website)
- Tracking status website
- Informasi server dan CDN
- Categorization by holding company
- Ads status monitoring

#### B. Modul OJS Management
- CRUD data OJS instances (132 instances)
- OJS Secure (credential management dengan dual authentication)
- Version tracking
- Server location management

#### C. Modul Domain Monitoring
- WHOIS integration untuk check domain expiry
- Domain registration date tracking
- Domain registrar information
- Expiring soon alerts
- Support untuk website domain dan OJS domain
- Main domain filtering (exclude subdomain)

#### D. Modul PageSpeed Monitoring
- Integration dengan PagePilot API
- PageSpeed check untuk mobile & desktop
- Historical data tracking
- Trends analysis
- Performance scoring
- Breakdown by holding company

#### E. Modul Uptime Monitoring
- Website availability checking
- Response time tracking
- Downtime incident recording
- Uptime percentage calculation
- Historical uptime data

#### F. Modul Notification System
- Real-time notifications untuk events penting
- Domain expiry warnings
- Website downtime alerts
- PageSpeed degradation notices
- Notification history

#### G. Modul SOP Web Management
- SOP documentation storage
- Version control
- Access management

#### H. Modul Ticketing System
- Issue reporting
- Ticket status tracking
- Priority management
- Assignment to team members
- Ticket statistics

#### I. Authentication & Authorization
- Laravel Sanctum authentication
- Role-based access control (Super Admin, Viewer, PageSpeed Role)
- Secure session management
- Dual authentication untuk secure modules (OJS Secure, WP Secure)

#### J. Dashboard & Reporting
- Comprehensive overview dashboard
- Statistics cards (total websites, OJS, tickets, etc.)
- Charts dan visualisasi data
- Export capabilities
- Filtering dan searching

### 4.2 Out of Scope (Tidak Termasuk):
- Automatic website repair/fixing
- Backup dan restore otomatis
- Integration dengan payment gateway untuk domain renewal
- Mobile application (native)
- Advanced AI/ML predictions
- Integration dengan CMS backend (WordPress admin, OJS admin)
- Automated content management

### 4.3 Constraints (Batasan):
- Development menggunakan Laravel 11 (backend) dan React + TypeScript (frontend)
- Hosting di shared hosting environment
- Budget terbatas untuk third-party API
- WHOIS data terbatas berdasarkan availability dari registrar
- PageSpeed check menggunakan third-party API (PagePilot)

---

## 5. DELIVERABLES (Hasil yang Diserahkan)

### 5.1 Technical Deliverables:

#### A. Source Code
- Laravel backend application (complete)
- React frontend application (complete)
- Database schema dan migrations
- API documentation
- Environment configuration templates

#### B. Database
- MySQL database dengan data 222 aset
- Migration files untuk reproducibility
- Seeder files untuk testing data

#### C. Documentation
- User manual (admin dan viewer)
- Technical documentation (architecture, API)
- Installation guide
- Deployment guide

### 5.2 Research Deliverables:

#### A. Draft Kesepakatan Proyek ✅
- Dokumen ini

#### B. BRD (Business Requirements Document)
- 1-2 halaman
- Kebutuhan bisnis dan kriteria sukses terukur

#### C. Rumusan Masalah Penelitian
- Problem statement
- Research questions
- Hipotesis (jika ada)

#### D. Rancangan Metode DSR
- 6 tahap DSR:
  1. Problem Identification
  2. Objectives of Solution
  3. Design & Development
  4. Demonstration
  5. Evaluation
  6. Communication
- Rencana artefak yang akan dikembangkan

#### E. Rencana Pengujian & Instrumen
- Metrik teknis (performance, security, usability)
- Kuesioner penerimaan pengguna
- Test cases
- Acceptance criteria

#### F. Kriteria Penilaian
- Kejelasan BRD
- Keterhubungan proyek ↔ penelitian
- Kelayakan metode DSR
- Kriteria sukses terukur

---

## 6. STAKEHOLDERS

### 6.1 Internal Stakeholders:
- **IT Team:** User utama sistem, data entry, monitoring
- **Management:** Decision maker, menerima laporan
- **Domain Administrator:** Mengelola domain renewal
- **OJS Administrator:** Mengelola OJS instances

### 6.2 External Stakeholders:
- **Dosen Pembimbing:** Evaluasi akademis
- **End Users (Indirect):** Diuntungkan dari website yang stabil

---

## 7. KRITERIA SUKSES

### 7.1 Technical Success Criteria:

#### Functionality:
- ✅ Sistem dapat menampilkan data 222 website dan OJS
- ✅ Domain monitoring berfungsi dengan akurasi >85%
- ✅ PageSpeed checking berfungsi untuk semua website
- ✅ Uptime monitoring real-time
- ✅ Notification system mengirim alert tepat waktu
- ✅ Authentication dan authorization berjalan secure

#### Performance:
- Dashboard load time < 3 detik
- API response time < 2 detik untuk 90% requests
- Dapat handle 50 concurrent users
- Database query optimization (N+1 problem resolved)

#### Security:
- Credentials encrypted di database
- Session timeout implemented
- CORS properly configured
- Rate limiting untuk API endpoints
- Audit trail untuk sensitive actions

#### Usability:
- User-friendly interface
- Responsive design (desktop & mobile)
- Intuitive navigation
- Search dan filtering efektif

### 7.2 Business Success Criteria:
- **Efisiensi waktu:** Reduce monitoring time dari 4 jam/hari → 30 menit/hari
- **Proaktif:** Domain expiry detection 30 hari sebelum expire
- **Downtime reduction:** Identifikasi masalah dalam 5 menit setelah terjadi
- **User satisfaction:** Minimum 80% satisfaction rate dari stakeholders

### 7.3 Research Success Criteria:
- Artefak (sistem) berhasil dibangun dan berfungsi
- Metodologi DSR diterapkan dengan benar
- Evaluasi menunjukkan sistem memecahkan masalah yang diidentifikasi
- Dokumentasi penelitian lengkap dan terstruktur

---

## 8. TIMELINE & MILESTONES

### Phase 1: Problem Identification & Requirements (Minggu 1-2)
- Interview stakeholders
- Identifikasi permasalahan detail
- Requirements gathering
- **Milestone:** BRD approved

### Phase 2: Design & Architecture (Minggu 3-4)
- Database design
- System architecture
- UI/UX wireframes
- API design
- **Milestone:** Design document approved

### Phase 3: Development - Core Modules (Minggu 5-8)
- Authentication system
- Website management
- OJS management
- Domain monitoring
- **Milestone:** Core modules completed

### Phase 4: Development - Advanced Features (Minggu 9-12)
- PageSpeed monitoring
- Uptime monitoring
- Notification system
- Ticketing system
- SOP management
- **Milestone:** All modules completed

### Phase 5: Testing & Bug Fixing (Minggu 13-14)
- Unit testing
- Integration testing
- User acceptance testing
- Bug fixing
- **Milestone:** System stable for production

### Phase 6: Deployment & Evaluation (Minggu 15-16)
- Production deployment
- User training
- Performance monitoring
- Evaluation with stakeholders
- **Milestone:** System live and evaluated

### Phase 7: Documentation & Communication (Minggu 17-18)
- Technical documentation
- Research paper writing
- User manual
- Final presentation
- **Milestone:** All deliverables submitted

---

## 9. RESOURCES

### 9.1 Human Resources:
- 1 Developer/Researcher (full-time)
- 1 Dosen Pembimbing (advisor)
- IT Team Syntax (stakeholders & testers)

### 9.2 Technical Resources:
- Development environment (local)
- Staging server
- Production server (api.itmsci.com)
- Third-party APIs:
  - PagePilot API (PageSpeed)
  - WHOIS services
- Tools:
  - VS Code
  - Git/GitHub
  - Postman (API testing)
  - MySQL Workbench
  - Browser DevTools

### 9.3 Infrastructure:
- **Backend:** Laravel 11, PHP 8.2, MySQL
- **Frontend:** React 18, TypeScript, Vite, TailwindCSS
- **Server:** Shared hosting (cPanel)
- **Domain:** itmsci.com, api.itmsci.com

---

## 10. RISKS & MITIGATION

### 10.1 Technical Risks:

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| WHOIS data tidak konsisten | Medium | High | Implement retry mechanism, fallback to manual entry |
| Third-party API rate limits | High | Medium | Implement queue system, batch processing |
| Server performance issues | High | Low | Optimize queries, implement caching |
| Security vulnerabilities | Critical | Low | Regular security audit, follow best practices |
| Data loss | Critical | Low | Regular backups, transaction management |

### 10.2 Project Risks:

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Scope creep | High | Medium | Strict scope management, change request process |
| Timeline delay | Medium | Medium | Buffer time in schedule, prioritize features |
| Stakeholder unavailability | Medium | Low | Schedule meetings in advance, async communication |
| Requirement changes | Medium | Medium | Agile approach, iterative development |

---

## 11. ASSUMPTIONS

1. PT Syntax menyediakan akses ke data website dan OJS yang diperlukan
2. Stakeholders tersedia untuk interview dan testing
3. Server infrastructure adequate untuk deployment
4. Third-party APIs tetap available selama development
5. Budget untuk third-party services mencukupi
6. Tim IT Syntax dapat dialokasikan untuk UAT

---

## 12. DEPENDENCIES

1. **External Dependencies:**
   - PagePilot API availability dan response time
   - WHOIS service reliability
   - Shared hosting uptime dan performance

2. **Internal Dependencies:**
   - Stakeholder feedback untuk requirements
   - Data accuracy dari existing systems
   - Approval untuk deployment ke production

---

## 13. COMMUNICATION PLAN

### 13.1 Regular Meetings:
- **Daily standup:** Self-tracking progress
- **Weekly progress review:** Dengan pembimbing
- **Bi-weekly stakeholder demo:** Dengan IT team Syntax
- **Monthly steering committee:** Dengan management (jika perlu)

### 13.2 Communication Channels:
- Email untuk formal communication
- WhatsApp/Telegram untuk quick updates
- GitHub untuk code collaboration
- Google Drive untuk dokumentasi

### 13.3 Reporting:
- **Weekly:** Progress report ke pembimbing
- **Bi-weekly:** Demo to stakeholders
- **Monthly:** Executive summary untuk management
- **Final:** Comprehensive project report

---

## 14. PERSETUJUAN

Dokumen ini merupakan kesepakatan awal tentang scope, deliverables, dan ekspektasi proyek Syntax Comprehensive Interface (ITM SCI).

| Role | Nama | Tanda Tangan | Tanggal |
|------|------|--------------|---------|
| Peneliti/Developer | [Nama Mahasiswa] | | |
| Pembimbing Akademik | [Nama Dosen] | | |
| Stakeholder Perusahaan | [Nama PIC Syntax] | | |

---

## 15. CATATAN REVISI

| Versi | Tanggal | Perubahan | Oleh |
|-------|---------|-----------|------|
| 1.0 | [Tanggal] | Draft awal | [Nama] |
|  |  |  |  |
|  |  |  |  |

---

**Dokumen ini merupakan living document dan dapat direvisi sesuai kebutuhan proyek dengan persetujuan semua pihak.**

---

*Draft Kesepakatan Proyek - Syntax Comprehensive Interface (ITM SCI)*  
*Versi 1.0*
