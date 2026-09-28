# BUSINESS REQUIREMENTS DOCUMENT (BRD)
## Syntax Comprehensive Interface (ITM SCI)

---

## 1. EXECUTIVE SUMMARY

PT Syntax Transformation Indonesia mengelola **222 aset digital** yang terdiri dari website dan sistem OJS (Open Journal System). Saat ini, monitoring dan manajemen aset dilakukan secara manual dan tersebar, menyebabkan inefisiensi operasional dan risiko bisnis. 

**Solusi:** Pengembangan sistem monitoring terpadu berbasis web yang mengintegrasikan manajemen website, OJS, domain monitoring, PageSpeed tracking, uptime monitoring, dan sistem notifikasi dalam satu platform komprehensif.

**ROI yang Diharapkan:** 
- Efisiensi waktu monitoring: **87.5%** (dari 4 jam/hari → 30 menit/hari)
- Pengurangan downtime: **60%** melalui early detection
- Pencegahan kehilangan domain: **100%** melalui automated alerts

---

## 2. BUSINESS NEEDS & PAIN POINTS

### 2.1 Current Problems

| Problem | Impact | Frequency |
|---------|--------|-----------|
| **Manual monitoring 222 website** | IT staff menghabiskan 4 jam/hari untuk check status | Daily |
| **Terlewatnya domain expiry** | Risiko kehilangan domain, dampak bisnis besar | 2-3 kali/tahun |
| **Kredensial OJS tersebar** | Kesulitan akses saat dibutuhkan, risiko keamanan | Weekly |
| **No centralized dashboard** | Decision making lambat, tidak ada overview | Continuous |
| **Reactive (bukan proactive)** | Masalah baru diketahui setelah user complain | Daily |
| **PageSpeed tidak termonitor** | Website lambat, user experience buruk, SEO rendah | Continuous |

### 2.2 Business Impact

**Financial Impact:**
- Kehilangan domain: Rp 5-50 juta per domain (tergantung value)
- Downtime cost: Estimasi Rp 1-5 juta per jam (revenue loss + reputation)
- IT staff overtime: Rp 2-4 juta per bulan (4 jam × 22 hari × biaya)

**Operational Impact:**
- Inefficient resource allocation
- Reactive problem solving
- Poor stakeholder satisfaction
- Risk of service disruption

**Reputational Impact:**
- User complaints saat website down
- Loss of trust jika domain hilang
- Poor user experience dari website lambat

---

## 3. BUSINESS OBJECTIVES

### 3.1 Primary Objectives

1. **Increase Operational Efficiency**
   - **Target:** Reduce monitoring time dari 4 jam/hari menjadi 30 menit/hari (87.5% reduction)
   - **Measurement:** Time tracking monitoring activities

2. **Proactive Problem Detection**
   - **Target:** Deteksi masalah dalam 5 menit setelah terjadi
   - **Measurement:** Time between incident occurrence dan detection

3. **Zero Domain Loss**
   - **Target:** Tidak ada domain yang expire tanpa renewal
   - **Measurement:** Domain expiry vs renewal rate

4. **Improve Website Performance**
   - **Target:** 80% website memiliki PageSpeed score > 70
   - **Measurement:** PageSpeed metrics tracking

5. **Centralized Information**
   - **Target:** 100% informasi aset digital terintegrasi dalam 1 platform
   - **Measurement:** System coverage audit

### 3.2 Success Metrics (KPIs)

| KPI | Current State | Target State | Timeline |
|-----|---------------|--------------|----------|
| Monitoring time per day | 4 jam | 30 menit | 3 bulan |
| Domain expiry incidents | 2-3/tahun | 0/tahun | 1 tahun |
| Average downtime detection | 2-4 jam | 5 menit | 3 bulan |
| Website uptime average | 95% | 99% | 6 bulan |
| IT staff satisfaction | 60% | 85% | 6 bulan |
| Management visibility | Low | High | 3 bulan |

---

## 4. BUSINESS REQUIREMENTS

### 4.1 Functional Requirements (High Level)

#### FR-1: Website Management
**Business Need:** Centralized repository untuk semua website information  
**Requirement:** System harus dapat menyimpan dan menampilkan data 222 website dengan informasi lengkap (URL, server, CDN, ads status, holding company)  
**Success Criteria:** 100% website data terintegrasi dan mudah diakses

#### FR-2: OJS Instance Management  
**Business Need:** Manage 132 OJS instances dengan secure credential storage  
**Requirement:** System harus dapat mengelola data OJS dan menyimpan credentials dengan enkripsi, dual authentication untuk akses  
**Success Criteria:** Semua OJS data tersimpan, credentials secure, audit trail tersedia

#### FR-3: Domain Expiry Monitoring
**Business Need:** Prevent domain loss through automated tracking  
**Requirement:** System harus dapat check domain expiry date, menghitung days until expiry, dan memberikan alerts 30, 14, dan 7 hari sebelum expiry  
**Success Criteria:** 100% domain termonitor, zero missed expiry alerts

#### FR-4: PageSpeed Monitoring
**Business Need:** Ensure optimal website performance for user experience dan SEO  
**Requirement:** System harus dapat check PageSpeed score (mobile & desktop), track historical data, dan identify slow websites  
**Success Criteria:** PageSpeed tracked untuk 100% website, trends visible

#### FR-5: Uptime Monitoring
**Business Need:** Early detection website downtime  
**Requirement:** System harus dapat check website availability, record downtime incidents, dan send immediate alerts  
**Success Criteria:** Downtime detected dalam 5 menit, 100% incidents recorded

#### FR-6: Notification System
**Business Need:** Proactive communication tentang issues dan alerts  
**Requirement:** System harus dapat send real-time notifications untuk domain expiry, downtime, dan PageSpeed degradation  
**Success Criteria:** Notifications delivered 100%, zero missed critical alerts

#### FR-7: Dashboard & Reporting
**Business Need:** Executive visibility dan decision making support  
**Requirement:** System harus menyediakan comprehensive dashboard dengan statistics, charts, dan filtering capabilities  
**Success Criteria:** Dashboard accessible, data accurate, load time < 3 detik

#### FR-8: Role-Based Access Control
**Business Need:** Security dan appropriate access levels  
**Requirement:** System harus implement role-based authentication (Super Admin, Viewer, PageSpeed Role) dengan secure session management  
**Success Criteria:** Authorization berfungsi, audit trail tersedia

### 4.2 Non-Functional Requirements

#### NFR-1: Performance
- Dashboard load time < 3 detik
- API response < 2 detik untuk 90% requests
- Support 50 concurrent users
- Database query optimization

#### NFR-2: Security
- Credentials encrypted (AES-256 atau equivalent)
- Secure session management (Laravel Sanctum)
- HTTPS untuk semua communications
- Rate limiting untuk API endpoints
- Audit trail untuk sensitive operations

#### NFR-3: Usability
- Intuitive user interface
- Responsive design (desktop & mobile)
- Search dan filtering effective
- Consistent UX across modules

#### NFR-4: Reliability
- System uptime 99.5%
- Graceful error handling
- Data backup daily
- Transaction integrity

#### NFR-5: Scalability
- Support growth hingga 500 websites
- Architecture allows new module addition
- Database optimization for large datasets

---

## 5. STAKEHOLDERS & ROLES

### 5.1 Primary Stakeholders

**IT Team** (Primary Users)
- **Needs:** Efficient monitoring tools, quick access to information
- **Benefits:** Time saving, proactive problem solving, centralized data

**Management** (Decision Makers)
- **Needs:** Executive dashboard, visibility of all assets, performance metrics
- **Benefits:** Better decision making, risk mitigation, ROI tracking

**Domain Administrator**
- **Needs:** Domain expiry tracking, renewal reminders
- **Benefits:** Zero domain loss, organized domain management

**OJS Administrator**
- **Needs:** Secure credential storage, easy access to OJS login info
- **Benefits:** Secure credential management, faster issue resolution

### 5.2 Secondary Stakeholders

**External Users** (Indirect)
- **Benefits:** Better website uptime, improved performance, better user experience

**Dosen Pembimbing** (Academic)
- **Interest:** Research methodology, learning outcomes, documentation quality

---

## 6. BUSINESS RULES

### 6.1 Access Control Rules
1. Super Admin: Full access to all modules
2. Viewer: Read-only access, cannot edit/delete
3. PageSpeed Role: Limited to PageSpeed module only
4. OJS Secure: Requires both main system auth + OJS credentials
5. Session timeout: 120 minutes inactivity

### 6.2 Notification Rules
1. Domain expiry alerts: Sent at 30, 14, 7 days before expiry
2. Downtime alerts: Immediate notification setelah detection
3. PageSpeed degradation: Alert jika score drop >20 points
4. Critical alerts: Sent via in-app notification + email (if configured)

### 6.3 Data Management Rules
1. All credentials must be encrypted before storage
2. Audit trail required untuk credential access
3. Data retention: Historical data kept for 12 months
4. Backup: Daily automated backup
5. Data validation: All user inputs must be validated

### 6.4 Operational Rules
1. WHOIS check: Retry 2× jika gagal, then manual entry option
2. PageSpeed check: Queue-based, batch processing
3. Uptime check: Every 5 minutes per website
4. Domain check: Daily automated check
5. Rate limiting: Max 100 API requests per minute per user

---

## 7. CONSTRAINTS

### 7.1 Technical Constraints
- **Technology Stack:** Laravel 11 + React + TypeScript (fixed)
- **Hosting:** Shared hosting environment (cPanel)
- **Database:** MySQL (limited to 2GB initially)
- **Third-party APIs:** Rate limits apply (PagePilot, WHOIS)

### 7.2 Business Constraints
- **Budget:** Limited for premium third-party services
- **Timeline:** Development harus selesai dalam 18 minggu
- **Resources:** 1 developer (full-time)

### 7.3 Organizational Constraints
- **User availability:** Testing dengan IT team sesuai schedule mereka
- **Change management:** Training required untuk user adoption

---

## 8. ASSUMPTIONS

1. Syntax menyediakan complete data untuk 222 websites dan OJS instances
2. Server infrastructure adequate untuk deployment
3. Third-party APIs tetap available dan affordable
4. Stakeholders available untuk requirements validation dan UAT
5. Current manual processes terdokumentasi
6. IT team willing to adopt new system

---

## 9. RISKS & MITIGATION

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| WHOIS data inconsistency | Medium | High | Retry mechanism + manual override option |
| PagePilot API rate limits | High | Medium | Queue system, batch processing, caching |
| User resistance to change | High | Medium | Training, phased rollout, user involvement |
| Scope creep | High | Medium | Strict change control, prioritization |
| Data migration issues | Medium | Low | Thorough testing, backup strategy |

---

## 10. SUCCESS CRITERIA (MEASURABLE)

### 10.1 Quantitative Success Criteria

| Criteria | Measurement Method | Target | Evaluation Time |
|----------|-------------------|--------|-----------------|
| **Efficiency Gain** | Time tracking | 87.5% reduction (240 min → 30 min) | 3 months post-deployment |
| **Domain Protection** | Incident tracking | Zero domain loss | 1 year post-deployment |
| **Downtime Detection** | Time delta monitoring | < 5 minutes | 3 months post-deployment |
| **System Uptime** | Availability monitoring | 99.5% | Continuous |
| **User Adoption** | Active user rate | 100% of IT team | 1 month post-deployment |
| **Data Accuracy** | Audit comparison | 95% accuracy | 3 months post-deployment |
| **PageSpeed Improvement** | Score tracking | 80% websites > 70 score | 6 months post-deployment |

### 10.2 Qualitative Success Criteria

**User Satisfaction:**
- Post-implementation survey: Minimum 80% satisfaction
- Feedback: System memudahkan pekerjaan sehari-hari
- Adoption: User aktif menggunakan tanpa dipaksa

**Business Value:**
- Management mendapatkan visibility yang dibutuhkan
- Decision making lebih data-driven
- Reduced stress level untuk IT team
- Proactive problem prevention culture

**System Quality:**
- Stable operation dengan minimal bugs
- Performance sesuai atau lebih baik dari target
- Security audit passed
- Documentation lengkap dan helpful

---

## 11. APPROVAL & SIGN-OFF

Dokumen BRD ini merepresentasikan business requirements untuk Syntax Comprehensive Interface (ITM SCI) dan menjadi foundation untuk design dan development.

| Role | Nama | Approval | Tanggal |
|------|------|----------|---------|
| **Business Owner** | [PIC Syntax] | | |
| **Project Sponsor** | [Management Syntax] | | |
| **Peneliti/Developer** | [Nama Mahasiswa] | | |
| **Academic Advisor** | [Nama Dosen] | | |

---

## 12. NEXT STEPS

1. ✅ BRD Review & Approval
2. ⏭️ Rumusan Masalah Penelitian
3. ⏭️ Rancangan Metode DSR
4. ⏭️ System Design & Architecture
5. ⏭️ Development Sprint Planning
6. ⏭️ UAT Planning
7. ⏭️ Deployment Planning

---

**Catatan:** BRD ini bersifat high-level dan akan di-detail-kan lebih lanjut dalam dokumen Functional Requirements Specification (FRS) selama fase design.

---

*Business Requirements Document - Syntax Comprehensive Interface*  
*Versi 1.0 | [Tanggal] | [Nama Mahasiswa]*
