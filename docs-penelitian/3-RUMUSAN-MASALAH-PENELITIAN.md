# RUMUSAN MASALAH PENELITIAN
## Syntax Comprehensive Interface (ITM SCI)

---

## 1. KONTEKS PENELITIAN

### 1.1 Domain Penelitian
**Sistem Informasi / Information Systems**

**Sub-domain:**
- Web-based Application Development
- Digital Asset Management Systems
- Enterprise Monitoring Systems
- Design Science Research

### 1.2 Latar Belakang Masalah

PT Syntax Transformation Indonesia sebagai perusahaan yang bergerak di bidang teknologi informasi mengelola **222 aset digital** yang terdiri dari berbagai website korporat dan 132 instance sistem Open Journal System (OJS). Dengan skala aset digital yang besar ini, perusahaan menghadapi tantangan signifikan dalam aspek monitoring, manajemen, dan pemeliharaan.

**Kondisi Existing:**
Saat ini, monitoring dan manajemen dilakukan secara manual dan tersebar di berbagai platform. IT team harus memeriksa status setiap website satu per satu, mencatat informasi domain dari berbagai sumber, dan mengelola kredensial OJS tanpa sistem terpusat. Proses ini tidak efisien dan rentan terhadap human error.

**Dampak Masalah:**
1. **Inefisiensi Operasional:** IT staff menghabiskan 4 jam per hari hanya untuk monitoring manual
2. **Risiko Bisnis:** Terdapat risiko kehilangan domain karena tidak ada sistem peringatan expiry otomatis
3. **Reactive Problem Solving:** Masalah website baru diketahui setelah ada komplain dari user
4. **Security Risk:** Kredensial OJS tersimpan tidak terstruktur dan tidak secure
5. **Lack of Visibility:** Management tidak memiliki overview kondisi semua aset digital

**Gap yang Teridentifikasi:**
Terdapat kebutuhan akan sistem monitoring terpadu yang dapat mengintegrasikan berbagai aspek manajemen aset digital (website, domain, credentials, performance) dalam satu platform yang secure, efisien, dan user-friendly. Namun, belum ada penelitian atau implementasi sistem sejenis yang spesifik untuk konteks Syntax dengan karakteristik dan kebutuhan uniknya.

---

## 2. IDENTIFIKASI MASALAH

### 2.1 Masalah Utama (Main Problem)

**"Bagaimana merancang dan membangun sistem monitoring terpadu yang efektif untuk mengelola 222 aset digital PT Syntax Transformation Indonesia dengan mempertimbangkan aspek efisiensi, keamanan, dan integrasi?"**

### 2.2 Sub-Masalah (Sub-Problems)

#### Masalah 1: Monitoring Manual yang Tidak Efisien
- **Deskripsi:** Monitoring 222 website dilakukan manual satu per satu, memakan waktu 4 jam/hari
- **Impact:** Inefisiensi operasional, staff overload, opportunity cost
- **Evidence:** Time tracking data IT team menunjukkan 4 jam/hari untuk monitoring

#### Masalah 2: Absence of Proactive Domain Management
- **Deskripsi:** Tidak ada sistem otomatis untuk tracking dan alert domain expiry
- **Impact:** Risiko kehilangan domain, business disruption, financial loss
- **Evidence:** Historical data menunjukkan 2-3 near-miss incidents per tahun

#### Masalah 3: Fragmented Information Architecture
- **Deskripsi:** Informasi website, domain, dan OJS tersebar di berbagai tempat (spreadsheet, email, notes)
- **Impact:** Sulit mendapatkan overview, decision making lambat, data inconsistency
- **Evidence:** Observasi menunjukkan data di 5+ lokasi berbeda

#### Masalah 4: Security and Access Control Challenges
- **Deskripsi:** Kredensial OJS tersimpan tidak terstruktur dan tidak secure
- **Impact:** Security risk, kesulitan access control, no audit trail
- **Evidence:** Credentials tersimpan di plain text di beberapa dokumen

#### Masalah 5: Lack of Performance Monitoring
- **Deskripsi:** Tidak ada tracking sistematis untuk website performance (PageSpeed, uptime)
- **Impact:** Poor user experience, SEO penalty, reactive problem solving
- **Evidence:** Tidak ada historical data PageSpeed/uptime

#### Masalah 6: Reactive (Not Proactive) Problem Management
- **Deskripsi:** Masalah website baru diketahui setelah user complain
- **Impact:** Downtime prolonged, reputation damage, customer dissatisfaction
- **Evidence:** Incident logs menunjukkan average 2-4 jam detection time

---

## 3. RESEARCH QUESTIONS

### 3.1 Primary Research Question (RQ1)

**"Bagaimana merancang sistem monitoring terpadu berbasis Design Science Research yang dapat meningkatkan efisiensi manajemen 222 aset digital dengan mempertimbangkan aspek integrasi, keamanan, dan usability?"**

### 3.2 Secondary Research Questions

#### RQ2: Requirements & Design
**"Apa saja kebutuhan fungsional dan non-fungsional yang harus dipenuhi oleh sistem monitoring terpadu untuk konteks PT Syntax?"**

**Sub-questions:**
- RQ2.1: Apa saja fitur esensial yang dibutuhkan oleh stakeholders?
- RQ2.2: Bagaimana arsitektur sistem yang optimal untuk mengintegrasikan berbagai modul?
- RQ2.3: Apa kriteria usability yang diharapkan oleh end users?

#### RQ3: Implementation & Technology
**"Bagaimana mengimplementasikan sistem dengan teknologi yang sesuai untuk memenuhi kebutuhan bisnis dan technical constraints?"**

**Sub-questions:**
- RQ3.1: Technology stack apa yang paling appropriate? (Laravel vs alternatives)
- RQ3.2: Bagaimana mengatasi challenges shared hosting environment?
- RQ3.3: Bagaimana strategi integrasi dengan third-party APIs (PagePilot, WHOIS)?

#### RQ4: Security & Access Control
**"Bagaimana merancang mekanisme security dan access control yang robust untuk melindungi sensitive data (credentials) namun tetap user-friendly?"**

**Sub-questions:**
- RQ4.1: Encryption method apa yang appropriate untuk credential storage?
- RQ4.2: Bagaimana implementasi dual authentication untuk secure modules?
- RQ4.3: Bagaimana memastikan audit trail untuk sensitive operations?

#### RQ5: Performance & Scalability
**"Bagaimana memastikan sistem dapat menangani 222 aset (dan berkembang hingga 500+) dengan performance yang acceptable?"**

**Sub-questions:**
- RQ5.1: Optimization techniques apa yang diperlukan untuk database queries?
- RQ5.2: Bagaimana strategi caching untuk improve response time?
- RQ5.3: Bagaimana menangani concurrent requests dari multiple users?

#### RQ6: Effectiveness & Impact
**"Seberapa efektif sistem yang dikembangkan dalam meningkatkan efisiensi operasional dan mengurangi risiko bisnis?"**

**Sub-questions:**
- RQ6.1: Berapa besar time saving yang dicapai? (Target: 87.5%)
- RQ6.2: Apakah sistem berhasil mencegah domain loss? (Target: zero incidents)
- RQ6.3: Seberapa cepat downtime detection? (Target: < 5 minutes)
- RQ6.4: Bagaimana tingkat user satisfaction dan adoption?

---

## 4. TUJUAN PENELITIAN

### 4.1 Tujuan Umum (General Objective)

Merancang, membangun, dan mengevaluasi sistem monitoring terpadu berbasis web menggunakan pendekatan Design Science Research untuk meningkatkan efisiensi manajemen 222 aset digital PT Syntax Transformation Indonesia.

### 4.2 Tujuan Khusus (Specific Objectives)

1. **Menganalisis** kebutuhan bisnis dan technical requirements untuk sistem monitoring terpadu di PT Syntax

2. **Merancang** arsitektur sistem yang mengintegrasikan website management, OJS management, domain monitoring, PageSpeed tracking, uptime monitoring, dan notification system

3. **Mengimplementasikan** prototype sistem menggunakan Laravel (backend) dan React (frontend) dengan mempertimbangkan security, performance, dan usability

4. **Mengevaluasi** efektivitas sistem dalam meningkatkan efisiensi operasional, mengurangi risiko bisnis, dan meningkatkan visibility management

5. **Menghasilkan** guidelines dan best practices untuk pengembangan sistem monitoring serupa di konteks perusahaan lain

---

## 5. MANFAAT PENELITIAN

### 5.1 Manfaat Teoritis

1. **Kontribusi terhadap Design Science Research:**
   - Demonstrasi aplikasi DSR methodology dalam konteks enterprise monitoring system
   - Guidelines untuk artifact development di domain digital asset management

2. **Body of Knowledge:**
   - Menambah literatur tentang integrated monitoring systems
   - Framework untuk security implementation di web-based credential management
   - Best practices untuk multi-module web application architecture

3. **Metodologi:**
   - Template evaluation metrics untuk monitoring systems
   - Approaches untuk stakeholder requirements gathering di enterprise context

### 5.2 Manfaat Praktis

#### Untuk PT Syntax:
1. **Operational Efficiency:**
   - Time saving 87.5% (240 menit → 30 menit per hari)
   - Cost saving dari reduced monitoring effort
   - Improved resource allocation

2. **Risk Mitigation:**
   - Zero domain loss through automated alerts
   - Reduced downtime through early detection
   - Improved security through centralized credential management

3. **Strategic:**
   - Better decision making through comprehensive dashboard
   - Improved service quality untuk external users
   - Scalable solution untuk future growth

#### Untuk Industri:
1. **Reference Implementation:**
   - Model sistem monitoring terpadu untuk companies dengan multi-website
   - Proof of concept untuk DSR application

2. **Technology Transfer:**
   - Open source potential (with modifications)
   - Best practices sharing dengan industry peers

#### Untuk Akademisi:
1. **Learning Material:**
   - Real-world case study untuk mahasiswa SI
   - Demonstration of theory-practice integration

2. **Research Replication:**
   - Methodology dapat direplikasi untuk konteks berbeda
   - Framework dapat diadaptasi untuk domain lain

### 5.3 Manfaat Sosial

1. **Improved User Experience:**
   - Website users mendapatkan service yang lebih reliable
   - Faster problem resolution

2. **Knowledge Dissemination:**
   - Contribution to open source community (if applicable)
   - Sharing best practices dengan industry

---

## 6. HIPOTESIS PENELITIAN

### H1: Sistem Monitoring Terpadu → Efisiensi Operasional
**"Implementasi sistem monitoring terpadu akan meningkatkan efisiensi operasional IT team secara signifikan, dengan target pengurangan waktu monitoring minimal 80%."**

**Basis Teori:**
- Information Systems success theory (DeLone & McLean)
- Task-Technology Fit theory

**Indikator:**
- Waktu monitoring per hari (before vs after)
- Number of websites monitored per hour
- Staff productivity metrics

### H2: Automated Alerting → Risk Reduction
**"Sistem notifikasi otomatis untuk domain expiry dan downtime akan mengurangi risiko bisnis secara signifikan, dengan target zero domain loss dan downtime detection < 5 menit."**

**Basis Teori:**
- Early Warning Systems effectiveness
- Proactive vs Reactive management

**Indikator:**
- Domain expiry incident count
- Average downtime detection time
- Incident response time

### H3: Centralized Dashboard → Improved Decision Making
**"Centralized dashboard dengan comprehensive metrics akan meningkatkan kualitas decision making management, diukur dari user satisfaction dan adoption rate."**

**Basis Teori:**
- Information Quality theory
- Decision Support Systems effectiveness

**Indikator:**
- User satisfaction score (> 80%)
- System adoption rate (> 90%)
- Frequency of dashboard usage by management

### H4: Secure Credential Management → Enhanced Security
**"Implementasi secure credential management dengan dual authentication akan meningkatkan security posture, diukur dari audit trail completeness dan zero unauthorized access."**

**Basis Teori:**
- Information Security principles
- Access Control models

**Indikator:**
- Audit trail coverage (100%)
- Unauthorized access attempts (0)
- Security audit score

---

## 7. BATASAN PENELITIAN (SCOPE LIMITATIONS)

### 7.1 Batasan Fungsional

**Dalam Scope:**
- Monitoring dan reporting (bukan automated fixing)
- Credential storage dan display (bukan password management tool)
- Integration dengan existing systems (read-only)
- Web-based interface (bukan mobile native)

**Di Luar Scope:**
- Automated website repair/remediation
- CMS integration (WordPress admin, OJS backend)
- Content management features
- Advanced AI/ML predictions
- Payment gateway integration untuk domain renewal

### 7.2 Batasan Teknikal

- **Platform:** Web-based only (no native mobile app)
- **Hosting:** Limited to shared hosting constraints
- **Third-party APIs:** Subject to rate limits dan availability
- **Data retention:** 12 months historical data
- **Concurrent users:** Designed for max 50 concurrent users

### 7.3 Batasan Organisasional

- **Stakeholder:** Terbatas pada PT Syntax (tidak multi-tenant)
- **User base:** IT team dan management Syntax (tidak external users)
- **Customization:** Tailored untuk Syntax needs (not generic SaaS)

### 7.4 Batasan Penelitian

- **Methodology:** Focus pada DSR, tidak comparative dengan methodology lain
- **Evaluation period:** 3-6 bulan post-deployment (not longitudinal)
- **Sample size:** Single organization case study (not multiple companies)
- **Technology:** Laravel + React fixed (no technology comparison)

---

## 8. DEFINISI OPERASIONAL

### 8.1 Variabel Utama

| Variable | Definisi Konseptual | Definisi Operasional | Pengukuran |
|----------|---------------------|----------------------|------------|
| **Efisiensi Operasional** | Rasio output terhadap input dalam proses monitoring | Time spent untuk monitoring 222 websites | Jam/hari (before: 4 jam, target after: 0.5 jam) |
| **Sistem Monitoring Terpadu** | Platform terintegrasi yang mengkonsolidasi berbagai fungsi monitoring | Web application dengan modules: website mgmt, domain monitoring, PageSpeed, uptime, notifications | Completeness checklist (100% modules implemented) |
| **Risiko Bisnis** | Probabilitas dan impact dari events negatif | Domain loss incidents + Downtime hours per month | Incident count & downtime duration |
| **User Satisfaction** | Tingkat kepuasan user terhadap sistem | Perceived usefulness, ease of use, intention to use | Survey score (1-5 Likert scale), target > 4.0 |
| **Security Posture** | Level keamanan sistem dalam melindungi sensitive data | Credential encryption + Audit trail + Access control | Security audit checklist (100% compliance) |

### 8.2 Key Terms

**Digital Asset:**
Website atau OJS instance yang dikelola oleh PT Syntax, mencakup domain, hosting, content, dan credentials.

**Monitoring:**
Proses periodic checking status, availability, dan performance dari digital assets untuk early detection problems.

**Integrated System:**
Platform yang mengkonsolidasi multiple functionalities (website mgmt, domain tracking, performance monitoring) dalam single interface dengan shared data model.

**Proactive Management:**
Approach yang focus pada early detection dan prevention rather than reactive response setelah problem terjadi.

**Dual Authentication:**
Security mechanism yang require dua level autentikasi: (1) main system authentication (Laravel Sanctum), (2) module-specific authentication (OJS/WP Secure credentials).

---

## 9. KERANGKA PEMIKIRAN (CONCEPTUAL FRAMEWORK)

```
┌─────────────────────────────────────────────────────────────────┐
│                        PERMASALAHAN                              │
│  - Monitoring manual inefficient (4 jam/hari)                   │
│  - No proactive domain management                               │
│  - Fragmented information                                        │
│  - Security & access control challenges                          │
│  - Lack of performance monitoring                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DESIGN SCIENCE RESEARCH                       │
│                      (6 Activities)                              │
│                                                                  │
│  1. Problem Identification & Motivation                          │
│  2. Define Objectives of Solution                               │
│  3. Design & Development (ARTEFACT)                             │
│  4. Demonstration                                                │
│  5. Evaluation                                                   │
│  6. Communication                                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   ARTEFACT: ITM SCI SYSTEM                       │
│                                                                  │
│  Components:                                                     │
│  • Website Management Module                                     │
│  • OJS Management Module (with OJS Secure)                      │
│  • Domain Monitoring Module                                      │
│  • PageSpeed Monitoring Module                                   │
│  • Uptime Monitoring Module                                      │
│  • Notification System                                           │
│  • Dashboard & Reporting                                         │
│  • Authentication & Authorization                                │
│                                                                  │
│  Technology:                                                     │
│  • Backend: Laravel 11 + MySQL                                   │
│  • Frontend: React 18 + TypeScript                              │
│  • APIs: PagePilot, WHOIS services                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        EVALUATION                                │
│                                                                  │
│  Quantitative Metrics:                                           │
│  • Time efficiency (monitoring time reduction)                   │
│  • System performance (response time, uptime)                    │
│  • Risk metrics (domain loss, downtime detection)               │
│                                                                  │
│  Qualitative Assessment:                                         │
│  • User satisfaction (survey)                                    │
│  • Usability testing                                             │
│  • Expert evaluation                                             │
│  • Stakeholder feedback                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         OUTCOMES                                 │
│                                                                  │
│  Expected Results:                                               │
│  ✓ Operational efficiency ↑ 87.5%                               │
│  ✓ Domain loss incidents ↓ 100%                                 │
│  ✓ Downtime detection time ↓ 95%                                │
│  ✓ User satisfaction > 80%                                       │
│  ✓ Security posture improved                                     │
│  ✓ Management visibility enhanced                                │
│                                                                  │
│  Contributions:                                                  │
│  • Practical: Working system for Syntax                          │
│  • Theoretical: DSR application in monitoring systems            │
│  • Methodological: Framework for similar projects                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. RINGKASAN RUMUSAN MASALAH

### Problem Statement (Concise)
PT Syntax Transformation Indonesia mengelola 222 aset digital dengan metode monitoring manual yang inefficient, tidak memiliki sistem proaktif untuk domain management, informasi terfragmentasi, dan credential management yang tidak secure, sehingga mengakibatkan inefisiensi operasional, risiko bisnis, dan lack of visibility untuk decision making.

### Research Gap
Belum ada sistem monitoring terpadu yang spesifik mengatasi kompleksitas manajemen multi-website dan multi-OJS dalam skala 222 aset dengan mempertimbangkan integrasi, security (dual authentication), dan usability dalam single platform, terutama dalam konteks shared hosting constraints dan Indonesian business environment.

### Proposed Solution
Pengembangan sistem monitoring terpadu menggunakan Design Science Research methodology, dengan artefak berupa web-based application yang mengintegrasikan website management, OJS management, domain monitoring, performance tracking, dan notification system dalam platform yang secure, efficient, dan user-friendly.

### Expected Contribution
- **Praktis:** Sistem operasional yang meningkatkan efisiensi 87.5%, mengurangi risiko bisnis, dan meningkatkan visibility management
- **Teoritis:** Demonstrasi aplikasi DSR dalam enterprise monitoring system context, framework untuk integrated monitoring systems
- **Metodologis:** Guidelines dan best practices untuk pengembangan sistem sejenis

---

*Rumusan Masalah Penelitian - Syntax Comprehensive Interface (ITM SCI)*  
*Versi 1.0*
