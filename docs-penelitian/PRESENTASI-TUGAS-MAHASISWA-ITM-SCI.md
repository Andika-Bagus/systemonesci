# TUGAS MAHASISWA - PENELITIAN ITM SCI
## Rancang Bangun Sistem Monitoring Terpadu untuk Manajemen 222 Aset Digital

**Peneliti:** [Nama Mahasiswa]  
**Pembimbing:** [Nama Dosen]  
**Organisasi:** PT Syntax Transformation Indonesia  
**Tanggal:** [Tanggal Presentasi]

---

## 📋 **1. DRAFT KESEPAKATAN PROYEK**

### **Latar Belakang Masalah**
PT Syntax Transformation Indonesia mengelola **222 aset digital** (website + OJS) dengan challenges:

🔴 **Problem Utama:**
- **Monitoring manual** memakan 4 jam/hari
- **Tidak ada sistem domain expiry alert** → risiko kehilangan domain
- **Informasi terfragmentasi** → sulit decision making
- **Kredensial OJS tidak secure** → security risk
- **Reactive problem solving** → downtime lama

💰 **Business Impact:**
- Kehilangan domain: Rp 5-50 juta per domain
- Downtime cost: Rp 1-5 juta per jam
- IT staff overtime: Rp 2-4 juta per bulan

### **Solusi yang Diusulkan**
**Sistem Monitoring Terpadu (ITM SCI)** dengan fitur:
- ✅ Website & OJS management (222 aset)
- ✅ Domain monitoring dengan auto-alert
- ✅ Secure credential management (dual auth)
- ✅ PageSpeed & uptime monitoring
- ✅ Real-time notification system
- ✅ Comprehensive dashboard & reporting

### **Target Pencapaian**
| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Monitoring Time/Day | 4 jam | 30 menit | **87.5%** ⬇️ |
| Domain Loss/Year | 2-3 incidents | 0 incidents | **100%** ⬇️ |
| Downtime Detection | 2-4 jam | < 5 menit | **95%** ⬇️ |
| User Satisfaction | 60% | > 85% | **42%** ⬆️ |

---

## 📊 **2. BRD - BUSINESS REQUIREMENTS**

### **Business Objectives**
🎯 **Primary Goals:**
1. **Operational Efficiency:** 87.5% time reduction
2. **Proactive Detection:** Issues detected dalam 5 menit
3. **Zero Domain Loss:** Automated expiry alerts
4. **Centralized Management:** Single platform untuk semua aset

### **Stakeholders & Benefits**
👥 **IT Team:**
- Time saving dari 4 jam → 30 menit/hari
- Proactive problem detection
- Centralized credential access

👔 **Management:**
- Real-time visibility semua aset
- Data-driven decision making
- Risk mitigation & cost savings

### **Success Metrics (KPIs)**
| KPI | Current | Target | Timeline |
|-----|---------|--------|----------|
| Daily monitoring time | 4 jam | 30 menit | 3 bulan |
| Domain expiry incidents | 2-3/tahun | 0/tahun | 1 tahun |
| Average downtime detection | 2-4 jam | 5 menit | 3 bulan |
| Website uptime average | 95% | 99% | 6 bulan |

### **ROI Expectations**
💵 **Cost Savings:**
- IT efficiency: Rp 2-4 juta/bulan
- Domain loss prevention: Rp 5-50 juta/incident
- Downtime reduction: Rp 1-5 juta/jam saved

🎯 **Target ROI:** 200%+ dalam 12 bulan

---

## 🔬 **3. RUMUSAN MASALAH PENELITIAN**

### **Problem Statement**
> "Bagaimana merancang sistem monitoring terpadu berbasis Design Science Research yang dapat meningkatkan efisiensi manajemen 222 aset digital dengan mempertimbangkan aspek integrasi, keamanan, dan usability?"

### **Research Questions**

**RQ1 (Primary):** Bagaimana merancang sistem monitoring terpadu yang efektif untuk 222 aset digital PT Syntax?

**RQ2:** Apa kebutuhan fungsional dan non-fungsional yang harus dipenuhi?

**RQ3:** Bagaimana mengimplementasikan sistem dengan teknologi yang sesuai?

**RQ4:** Bagaimana merancang security & access control yang robust namun user-friendly?

**RQ5:** Bagaimana memastikan sistem scalable untuk 222+ aset dengan performance acceptable?

**RQ6:** Seberapa efektif sistem dalam meningkatkan efisiensi dan mengurangi risiko?

### **Research Objectives**
🔍 **Tujuan Umum:** Merancang, membangun, dan mengevaluasi sistem monitoring terpadu menggunakan DSR

🎯 **Tujuan Khusus:**
1. Menganalisis kebutuhan bisnis & technical requirements
2. Merancang arsitektur sistem terintegrasi
3. Mengimplementasikan prototype dengan Laravel + React
4. Mengevaluasi efektivitas dalam efficiency & risk reduction
5. Menghasilkan guidelines untuk sistem serupa

### **Manfaat Penelitian**
📚 **Academic:** DSR framework untuk enterprise monitoring systems
💼 **Industry:** Template solution untuk companies dengan multi-website
🏢 **Syntax:** 87.5% efficiency gain, zero domain loss, proactive monitoring

---

## ⚙️ **4. METODE DSR - 6 AKTIVITAS**

### **Framework: Peffers et al. (2007)**
```
1️⃣ Problem Identification & Motivation
   ↓
2️⃣ Define Objectives of Solution  
   ↓
3️⃣ Design & Development (ARTEFACT)
   ↓
4️⃣ Demonstration
   ↓
5️⃣ Evaluation
   ↓
6️⃣ Communication
```

### **Aktivitas 1: Problem Identification**
📋 **Metode:**
- Interview stakeholders (IT team, management)
- Observasi proses existing (2-3 hari)
- Document analysis (spreadsheet, email, SOP)
- Root cause analysis (5W1H + Fishbone)

🎯 **Output:** Problem statement, stakeholder analysis, current process documentation

### **Aktivitas 2: Define Objectives**
🎯 **Metode:**
- Objectives workshop dengan stakeholders
- Literature review (monitoring systems, DSR)
- Technology feasibility study
- Requirements prioritization (MoSCoW)

📝 **Output:** BRD, success criteria, technology stack decision

### **Aktivitas 3: Design & Development**
🏗️ **Artefact: ITM SCI System**

**Technology Stack:**
- **Backend:** Laravel 11 + MySQL
- **Frontend:** React 18 + TypeScript + TailwindCSS
- **APIs:** PagePilot, WHOIS services
- **Hosting:** Shared hosting (cPanel)

**Architecture:**
```
┌─────────────────────────────────────┐
│       FRONTEND (React)              │
│   - Dashboard, Forms, Charts        │
│   - Real-time notifications         │
└──────────────┬──────────────────────┘
               │ REST API
┌──────────────▼──────────────────────┐
│       BACKEND (Laravel)             │
│   - Authentication & Authorization  │
│   - Business Logic                  │
│   - Background Jobs                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         DATABASE (MySQL)            │
│   - Websites, OJS, Domain Data      │
│   - Notifications, Tickets          │
└─────────────────────────────────────┘
```

**Core Modules:**
1. **Website Management:** CRUD 222 websites
2. **OJS Management:** CRUD + OJS Secure (dual auth)
3. **Domain Monitoring:** WHOIS + expiry alerts
4. **PageSpeed Monitoring:** Performance tracking
5. **Uptime Monitoring:** Availability checking
6. **Notification System:** Real-time alerts
7. **Dashboard:** Comprehensive overview

### **Aktivitas 4: Demonstration**
🧪 **Metode:**
- Internal testing (alpha testing)
- Stakeholder demo sessions (bi-weekly)
- Pilot deployment (2 minggu real data)
- Use case walkthroughs

### **Aktivitas 5: Evaluation**
📊 **Multi-Method Evaluation:**

**Quantitative:**
- Performance metrics (load time, response time)
- Efficiency metrics (time reduction, incident count)
- Security metrics (vulnerability scan, audit trail)

**Qualitative:**
- User satisfaction survey (TAM model)
- Usability testing (task-based)
- Expert evaluation (technical review)

### **Aktivitas 6: Communication**
📢 **Target Audience:**
- **Academic:** Skripsi, thesis defense, potential publication
- **Industry:** Case study, technical documentation
- **Syntax:** Business results presentation

---

## 🧪 **5. RENCANA PENGUJIAN & INSTRUMEN**

### **Technical Metrics**

#### **Performance Testing**
| Metric | Target | Tool |
|--------|--------|------|
| Dashboard load time | < 3 detik | Lighthouse |
| API response time | < 2 detik (90%) | Laravel Telescope |
| Concurrent users | 50 users | Apache JMeter |
| System uptime | > 99.5% | Uptime monitoring |

#### **Security Testing**
| Test | Expected Result |
|------|----------------|
| Authentication bypass | Access denied |
| SQL injection attempts | Zero vulnerabilities |
| Credential encryption | AES-256 in database |
| HTTPS enforcement | 100% secure communications |

### **User Acceptance Testing**

#### **TAM Questionnaire (30 items)**
**Constructs (5-point Likert scale):**

**Perceived Usefulness (6 items):**
- "Sistem ITM SCI membantu saya menyelesaikan tugas monitoring lebih cepat"
- "Sistem ini meningkatkan produktivitas saya dalam mengelola website"
- "Sistem ini memberikan value yang berguna untuk pekerjaan sehari-hari"

**Perceived Ease of Use (6 items):**
- "Interface sistem mudah dipahami dan dipelajari"
- "Navigasi sistem intuitif dan mudah digunakan"
- "Saya dapat menggunakan sistem tanpa banyak bantuan"

**System Quality (5 items):**
- "Sistem memiliki response time yang cepat"
- "Sistem jarang mengalami error atau crash"
- "Sistem aman dalam melindungi data sensitive"

**Target:** Average score > 4.0/5.0

#### **Usability Testing Scenarios**

**Scenario 1: Daily Monitoring (< 10 menit)**
1. Login ke sistem ITM SCI
2. Check dashboard overview
3. Review notifications/alerts
4. Identify problematic websites
5. Check PageSpeed trends
6. Verify upcoming domain expiries

**Scenario 2: Domain Management (< 5 menit)**
1. Open domain expiry notification
2. View domain details
3. Mark as handled
4. Export expiry report

**Scenario 3: OJS Credential Access (< 7 menit)**
1. Access OJS Secure module
2. Authenticate dengan credentials
3. Search specific OJS instance
4. Copy username/password
5. Update expired credentials

### **Success Criteria**
✅ Task completion rate > 95%  
✅ User satisfaction > 4.0/5.0  
✅ System Usability Scale (SUS) > 70  
✅ Time reduction > 80%  

---

## 📏 **6. KRITERIA PENILAIAN**

### **4 Dimensi Penilaian (Each 25%)**

#### **Dimensi 1: Kejelasan BRD (25%)**
- **Problem Definition Clarity (20%):** Problem statement jelas & specific
- **Requirements Quality (25%):** FR & NFR measurable & realistic
- **Stakeholder Analysis (25%):** Needs well-understood, success criteria SMART
- **Business Case (15%):** Strong ROI justification
- **Document Quality (15%):** Professional presentation

#### **Dimensi 2: Keterhubungan Proyek ↔ Penelitian (25%)**
- **Problem-Research Alignment (30%):** Research questions address business problems
- **Artefakt Relevance (25%):** System solves identified problems effectively
- **Methodology Appropriateness (25%):** DSR suitable for problem type
- **Academic-Industry Bridge (20%):** Benefits both theory & practice

#### **Dimensi 3: Kelayakan Metode DSR (25%)**
- **DSR Framework Compliance (25%):** Adherence to 6-activity framework
- **Artefakt Quality (30%):** Technical excellence & innovation
- **Evaluation Rigor (25%):** Comprehensive multi-method evaluation
- **Research Contribution (20%):** Academic & practical value

#### **Dimensi 4: Kriteria Sukses Terukur (25%)**
- **Efficiency Metrics (30%):** Time reduction, domain prevention, detection time
- **Performance Metrics (25%):** Load time, response time, uptime
- **User Satisfaction (25%):** TAM survey, SUS score, adoption rate
- **Business Impact (20%):** ROI, feature completeness

### **Scoring System**
- **Scale:** 1-5 (1=Sangat Kurang, 5=Sangat Baik)
- **Pass Threshold:** > 4.0/5.0 overall
- **Minimum per Dimension:** > 3.5/5.0

### **Critical Success Factors**
✅ **Technical:** All features working, performance targets met, security compliant  
✅ **Business:** 80% efficiency gain, user satisfaction >80%, adoption >90%  
✅ **Academic:** DSR properly executed, rigorous evaluation, clear contributions  

---

## 🎯 **RANGKUMAN EXECUTIVE**

### **Problem & Solution**
🔴 **Problem:** PT Syntax mengelola 222 aset digital dengan monitoring manual yang inefficient (4 jam/hari), risiko domain loss, dan lack of visibility

💡 **Solution:** Sistem monitoring terpadu (ITM SCI) dengan integrated dashboard, automated alerts, dan secure credential management

### **Methodology**
⚙️ **DSR 6 Activities:** Problem identification → Objectives definition → Design & development → Demonstration → Evaluation → Communication

🏗️ **Technology:** Laravel 11 + React + TypeScript untuk web-based monitoring platform

### **Expected Impact**
📈 **Efficiency:** 87.5% time reduction (4 jam → 30 menit daily)  
🛡️ **Risk Reduction:** Zero domain loss, <5 min downtime detection  
💰 **ROI:** 200%+ dalam 12 bulan  
👥 **User Satisfaction:** >80% satisfaction rate  

### **Academic Contribution**
🎓 **Theoretical:** DSR framework untuk enterprise monitoring systems  
💼 **Practical:** Working solution untuk digital asset management  
🔧 **Technical:** Best practices Laravel + React integration  

### **Success Metrics**
| Area | Target | Measurement |
|------|--------|-------------|
| **Efficiency** | 87.5% time reduction | Time tracking |
| **Performance** | <3s dashboard, <2s API | Automated testing |
| **Satisfaction** | >4.0/5.0 TAM score | User survey |
| **Quality** | >70 SUS score | Usability testing |
| **Business** | Positive ROI | Cost-benefit analysis |

---

## 🚀 **NEXT STEPS**

### **Implementation Timeline**
📅 **Week 1-2:** Problem identification & requirements  
📅 **Week 3-4:** Design & architecture  
📅 **Week 5-14:** Development (5 sprints × 2 minggu)  
📅 **Week 15-16:** Testing & evaluation  
📅 **Week 17-18:** Deployment & validation  

### **Deliverables**
📦 **Technical:** Working ITM SCI system + documentation  
📚 **Academic:** Complete thesis document (80-120 pages)  
📊 **Business:** ROI analysis + impact report  

### **Risk Mitigation**
⚠️ **Technical Risks:** WHOIS inconsistency → Retry mechanism + manual override  
⚠️ **Project Risks:** Scope creep → Strict change management  
⚠️ **Business Risks:** User resistance → Training + phased rollout  

---

**🏆 KESIMPULAN**

Penelitian ITM SCI menggunakan DSR methodology untuk mengembangkan sistem monitoring terpadu yang mengatasi challenges PT Syntax dalam mengelola 222 aset digital. 

**Key Success Factors:**
✅ **Strong business case** dengan measurable ROI  
✅ **Rigorous DSR methodology** dengan comprehensive evaluation  
✅ **Technical excellence** dengan modern tech stack  
✅ **User-centric design** dengan focus pada usability  
✅ **Academic rigor** dengan theoretical contributions  

**Expected Impact:** 87.5% efficiency improvement, zero domain loss, enhanced security, dan improved decision making untuk PT Syntax.

---

*Tugas Mahasiswa - Penelitian ITM SCI*  
*[Nama Mahasiswa] - [Program Studi] - [Universitas]*  
*Pembimbing: [Nama Dosen]*