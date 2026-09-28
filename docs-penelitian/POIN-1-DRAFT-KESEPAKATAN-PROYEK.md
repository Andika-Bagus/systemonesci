# 📋 POIN 1: DRAFT KESEPAKATAN PROYEK
## ITM SCI - Syntax Comprehensive Interface

---

## 🎯 **APA ITU KESEPAKATAN PROYEK?**

### **Definisi**
Perjanjian awal antara **pemberi proyek (PT Syntax)** dan **tim pengembang (mahasiswa)** tentang:
- **APA** yang akan dikerjakan
- **KAPAN** selesainya  
- **APA** batasannya
- **SIAPA** yang bertanggung jawab

### **Kenapa Penting?**
✅ **Mencegah salah paham** antara ekspektasi vs reality  
✅ **Menghindari scope creep** - pekerjaan membengkak tanpa persetujuan  
✅ **Melindungi kedua belah pihak** dari konflik di kemudian hari  
✅ **Menjadi panduan** selama proses development  

---

## 📊 **LATAR BELAKANG MASALAH PT SYNTAX**

### **Kondisi Saat Ini**
🔴 **PT Syntax mengelola 222 aset digital:**
- 222 websites (berbagai holding company)
- 132 OJS instances (Open Journal System)
- Semua monitoring dilakukan **manual**

🔴 **Pain Points yang Dialami:**
- **4 jam/hari** dibutuhkan untuk monitoring manual
- **2-3 incidents/tahun** domain hampir expire (near-miss)
- **Kredensial OJS tersimpan plain text** (security risk)
- **Downtime detection 2-4 jam** (sangat lambat)
- **Management tidak punya real-time visibility**

### **Impact Finansial**
💸 **Biaya Saat Ini:**
- Domain loss potential: **Rp 5-50 juta per domain**
- Downtime cost: **Rp 1-5 juta per jam**
- IT staff overtime: **Rp 2-4 juta per bulan**
- Opportunity cost: **Staff tidak fokus ke task lain**

---

## 🎯 **TUJUAN PROYEK ITM SCI**

### **Tujuan Utama**
Membangun **sistem monitoring terpadu** yang dapat:
- ✅ Monitor 222 websites secara otomatis
- ✅ Track domain expiry dengan alert proaktif
- ✅ Manage OJS credentials secara secure
- ✅ Provide real-time dashboard untuk management
- ✅ Reduce monitoring time dari 4 jam → 30 menit

### **Target Measurable**
| Aspek | Current State | Target ITM SCI | Improvement |
|-------|---------------|----------------|-------------|
| **Monitoring Time** | 4 jam/hari | 30 menit/hari | **87.5% ⬇️** |
| **Domain Incidents** | 2-3/tahun | 0/tahun | **100% ⬇️** |
| **Detection Time** | 2-4 jam | <5 menit | **95% ⬇️** |
| **Security Score** | Plain text | Encrypted + audit | **100% ⬆️** |

---

## 📝 **RUANG LINGKUP (SCOPE) ITM SCI**

### **✅ YANG TERMASUK (In Scope):**

#### **Core Modules:**
1. **Website Management**
   - CRUD 222 websites dengan categorization
   - Server & CDN location tracking
   - Ads status monitoring per holding

2. **OJS Management + Secure**
   - CRUD 132 OJS instances
   - OJS Secure: dual authentication system
   - Encrypted credential storage

3. **Domain Monitoring**
   - WHOIS integration untuk expiry checking
   - Automated alerts (30/14/7 hari sebelum expire)
   - Support website + OJS domain tracking

4. **Performance Monitoring**
   - PageSpeed integration (PagePilot API)
   - Uptime monitoring (5-minute intervals)
   - Historical data & trends

5. **System Features**
   - Real-time notification system
   - Comprehensive dashboard
   - Role-based access control
   - Ticketing & SOP management

### **❌ YANG TIDAK TERMASUK (Out of Scope):**
- ❌ **Automated website repair/fixing**
- ❌ **WordPress/OJS backend integration**
- ❌ **Native mobile application**
- ❌ **Advanced AI/ML predictions**
- ❌ **Payment gateway untuk domain renewal**
- ❌ **Content management features**

---

## 👥 **STAKEHOLDERS & ROLES**

### **Primary Stakeholders:**

#### **🏢 PT Syntax (Client)**
**IT Team (5 orang):**
- **Role:** Primary users, daily monitoring
- **Responsibilities:** Data entry, system usage, feedback
- **Benefits:** 87.5% time saving, proactive alerts

**Management (2 orang):**
- **Role:** Decision makers, strategic oversight
- **Responsibilities:** Requirements approval, UAT sign-off
- **Benefits:** Real-time visibility, data-driven decisions

**Domain Administrator (1 orang):**
- **Role:** Domain renewal management
- **Responsibilities:** Domain data accuracy, renewal planning
- **Benefits:** Zero domain loss risk

#### **🎓 Academic Side**
**Mahasiswa (Developer):**
- **Role:** System developer & researcher
- **Responsibilities:** Development, testing, documentation
- **Benefits:** Real-world experience, thesis material

**Dosen Pembimbing:**
- **Role:** Academic supervisor
- **Responsibilities:** Methodology guidance, quality assurance
- **Benefits:** Research output, student mentoring

---

## 🛠️ **TEKNOLOGI & CONSTRAINTS**

### **Technology Stack (Fixed)**
- **Backend:** Laravel 11 + PHP 8.2 + MySQL
- **Frontend:** React 18 + TypeScript + TailwindCSS
- **APIs:** PagePilot (PageSpeed), WHOIS services
- **Deployment:** Shared hosting (api.itmsci.com)

### **Technical Constraints**
⚠️ **Infrastructure Limitations:**
- Shared hosting environment (not VPS/cloud)
- Database storage max 2GB initially
- Concurrent users max 50
- Third-party API rate limits

⚠️ **Budget Constraints:**
- Limited budget untuk premium API services
- No additional server/hosting budget
- Free tier limitations untuk external services

### **Assumptions**
✅ **PT Syntax akan provide:**
- Accurate data untuk 222 websites
- Access untuk testing & validation
- IT team availability untuk UAT

✅ **Development Environment:**
- Stable internet untuk development
- Access ke third-party APIs
- Local development setup available

---

## 📅 **TIMELINE & MILESTONES**

### **Development Phases (18 Minggu Total)**

#### **Phase 1: Analysis & Design (Week 1-4)**
- Week 1-2: Problem identification & stakeholder interviews
- Week 3-4: Requirements gathering & system design
- **Milestone:** BRD & Design Document approved

#### **Phase 2: Development (Week 5-14)**
- Week 5-8: Core modules (Website, OJS, Authentication)
- Week 9-12: Advanced features (Domain, PageSpeed, Notifications)
- Week 13-14: Integration, testing, bug fixes
- **Milestone:** All modules completed & integrated

#### **Phase 3: Testing & Deployment (Week 15-18)**
- Week 15-16: User acceptance testing & refinement
- Week 17-18: Production deployment & evaluation
- **Milestone:** System live & evaluated

### **Critical Success Factors**
🎯 **Technical:** All features working, performance targets met  
🎯 **Business:** Efficiency gain >80%, user satisfaction >80%  
🎯 **Academic:** DSR methodology followed, evaluation rigorous  

---

## 📊 **EXPECTED ROI & BENEFITS**

### **Quantifiable Benefits (12 Months)**
💰 **Cost Savings:**
- IT efficiency improvement: **Rp 24-48 juta/tahun**
- Domain loss prevention: **Rp 10-100 juta/tahun**
- Downtime reduction: **Rp 12-60 juta/tahun**
- **Total Potential Savings: Rp 46-208 juta/tahun**

💸 **Investment Cost:**
- Development time: 18 minggu (mahasiswa - no direct cost)
- Infrastructure: existing shared hosting
- Third-party APIs: <Rp 5 juta/tahun
- **Total Investment: <Rp 10 juta**

🎯 **Expected ROI: 460-2080%** (sangat menguntungkan!)

### **Intangible Benefits**
✨ **Operational:**
- Improved staff productivity & job satisfaction
- Better decision making dengan real-time data
- Enhanced security posture
- Scalable foundation untuk future growth

✨ **Academic:**
- Real-world research experience
- Contribution to knowledge (DSR methodology)
- Potential publication opportunities

---

## ✅ **DELIVERABLES**

### **Technical Deliverables**
📦 **System Components:**
- ITM SCI web application (frontend + backend)
- Database dengan 222 websites + 132 OJS data
- Complete technical documentation
- Deployment guide & user manual

📊 **Documentation:**
- System architecture document
- API documentation
- User training materials
- Maintenance guide

### **Academic Deliverables**
📚 **Research Output:**
- Complete thesis document (80-120 pages)
- Research methodology documentation
- Evaluation & assessment reports
- Academic presentation materials

🎓 **Knowledge Products:**
- DSR framework implementation
- Best practices guide
- Lessons learned document
- Potential research paper

---

## 🤝 **PERSETUJUAN & SIGN-OFF**

### **Approval Criteria**
✅ **Technical Acceptance:**
- All functional requirements implemented
- Performance targets achieved (<3s load, <2s API)
- Security requirements met (encryption, audit trail)
- User acceptance testing passed

✅ **Business Acceptance:**
- Efficiency improvement >80% achieved
- User satisfaction >80%
- System adoption >90%
- ROI positive within 6 months

✅ **Academic Acceptance:**
- DSR methodology properly followed
- Evaluation rigorous & comprehensive
- Documentation complete & quality
- Thesis defense ready

### **Sign-off Parties**
| Role | Name | Responsibility | Sign-off |
|------|------|---------------|----------|
| **Business Sponsor** | [PIC Syntax] | Business requirements & ROI | [ ] |
| **Technical Lead** | [IT Manager] | Technical implementation | [ ] |
| **Academic Advisor** | [Dosen Pembimbing] | Research methodology | [ ] |
| **Developer** | [Nama Mahasiswa] | Development & delivery | [ ] |

---

## 🎯 **KESIMPULAN KESEPAKATAN**

### **Key Agreement Points**
1. **Scope Clear:** ITM SCI akan menangani monitoring 222 websites + 132 OJS
2. **Target Measurable:** 87.5% efficiency improvement, zero domain loss
3. **Timeline Realistic:** 18 minggu development dengan milestone clear
4. **Technology Approved:** Laravel + React stack dengan shared hosting
5. **ROI Positive:** Expected 460-2080% return on investment

### **Success Definition**
✅ **ITM SCI berhasil jika:**
- Monitoring time berkurang >80% (4 jam → <48 menit)
- Domain loss incidents = 0 selama 6 bulan pertama
- User satisfaction score >4.0/5.0 (TAM survey)
- System uptime >99% dengan performance <3s load time

### **Risk Mitigation**
⚠️ **Jika tidak mencapai target:**
- Review & adjustment plan dalam 2 minggu
- Stakeholder meeting untuk prioritas ulang
- Scope reduction jika diperlukan (dengan approval)
- Academic alternative assessment jika business target tidak tercapai

---

*Draft Kesepakatan Proyek - ITM SCI*  
*PT Syntax Transformation Indonesia*  
*[Tanggal] | [Versi 1.0]*