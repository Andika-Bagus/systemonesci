# 📊 POIN 2: BRD - BUSINESS REQUIREMENTS DOCUMENT
## ITM SCI - Kebutuhan Bisnis & Kriteria Sukses Terukur

---

## 🎯 **APA ITU BRD?**

### **Business Requirements Document (BRD)**
Dokumen yang mendefinisikan **KEBUTUHAN BISNIS** untuk sistem ITM SCI:
- **Masalah bisnis** yang harus diselesaikan
- **Tujuan & objectives** yang ingin dicapai  
- **Success criteria** yang terukur
- **Stakeholder needs** dan expectations

### **Kenapa BRD Penting?**
✅ **Bridge gap** antara business needs dan technical solution  
✅ **Provide baseline** untuk measuring success  
✅ **Ensure alignment** semua stakeholders  
✅ **Guide development** priorities dan decisions  

---

## 🔴 **BUSINESS PROBLEMS PT SYNTAX**

### **Problem Statement**
> PT Syntax Transformation Indonesia mengelola 222 aset digital (websites + OJS) dengan proses monitoring manual yang inefficient, tidak memiliki sistem proaktif untuk domain management, informasi terfragmentasi, dan credential management tidak secure, mengakibatkan inefisiensi operasional, risiko bisnis, dan lack of visibility untuk decision making.

### **Current State Analysis**

#### **Operational Inefficiency**
🔴 **Manual Monitoring Bottleneck:**
- IT Team menghabiskan **4 jam per hari** untuk check 222 websites
- Proses dilakukan **satu per satu** tanpa automation
- **55 websites per jam** - sangat lambat dan prone to error
- Staff tidak bisa fokus ke **strategic tasks** lain

#### **Business Risk Exposure**
🔴 **Domain Management Risk:**
- **2-3 near-miss incidents per tahun** domain hampir expire
- **No automated alerts** 30 hari sebelum expiry
- **Potential loss: Rp 5-50 juta per domain** yang hilang
- Data domain **tersebar di spreadsheet, email, notes**

#### **Security & Compliance Issues**
🔴 **Credential Management:**
- **132 OJS credentials stored plain text** di spreadsheet
- **No audit trail** untuk akses sensitive data
- **Security vulnerability** untuk data breach
- **No access control** - siapa saja bisa akses semua credentials

#### **Reactive vs Proactive Management**
🔴 **Problem Detection:**
- Website downtime **baru diketahui 2-4 jam kemudian**
- **User complaints first indicator** - bukan internal monitoring
- **No PageSpeed tracking** - performance degradation tidak terdeteksi
- **No uptime history** untuk trend analysis

### **Business Impact Quantification**
💸 **Annual Cost of Current Problems:**
| Problem Area | Annual Cost | Frequency | Total Impact |
|--------------|-------------|-----------|--------------|
| **IT Inefficiency** | Rp 2-4 juta/bulan | 12 months | **Rp 24-48 juta** |
| **Domain Loss Risk** | Rp 5-50 juta/incident | 2-3 incidents | **Rp 10-150 juta** |
| **Downtime Cost** | Rp 1-5 juta/hour | 50-100 hours | **Rp 50-500 juta** |
| **Security Breach** | Rp 10-100 juta | Low probability | **Rp 1-10 juta** |
| **TOTAL ANNUAL RISK** | | | **Rp 85-708 juta** |

---

## 🎯 **BUSINESS OBJECTIVES ITM SCI**

### **Primary Business Goals**

#### **1. Operational Efficiency (Target: 87.5% Improvement)**
**Current:** 4 jam monitoring/hari = 240 menit  
**Target:** 30 menit monitoring/hari  
**Method:** Automated monitoring dengan centralized dashboard

**Key Results:**
- ✅ Monitoring time reduction **>87%**
- ✅ Staff productivity increase **>80%**
- ✅ Manual task elimination **>90%**

#### **2. Risk Mitigation (Target: Zero Loss)**
**Current:** 2-3 domain incidents/tahun  
**Target:** 0 domain loss incidents  
**Method:** Proactive alerts 30/14/7 hari sebelum expiry

**Key Results:**
- ✅ Domain loss incidents **= 0**
- ✅ Downtime detection time **<5 minutes**
- ✅ Security breach probability **<0.1%**

#### **3. Enhanced Visibility (Target: Real-time)**
**Current:** No centralized dashboard  
**Target:** Comprehensive real-time visibility  
**Method:** Executive dashboard dengan KPI metrics

**Key Results:**
- ✅ Management visibility **100%** real-time
- ✅ Decision making speed **>50% faster**
- ✅ Data accuracy **>95%**

#### **4. Security Improvement (Target: Enterprise-grade)**
**Current:** Plain text credential storage  
**Target:** Encrypted + audited credential management  
**Method:** Dual authentication dengan audit trail

**Key Results:**
- ✅ Credential encryption **100%**
- ✅ Audit trail coverage **100%**
- ✅ Access control compliance **100%**

---

## 📋 **FUNCTIONAL REQUIREMENTS**

### **FR-1: Website Management Module**
**Business Need:** Centralized repository untuk 222 websites  
**Requirements:**
- ✅ CRUD operations untuk all websites
- ✅ Categorization by holding company
- ✅ Server & CDN location tracking
- ✅ Ads status monitoring
- ✅ Search & filtering capabilities
**Success Criteria:** 100% websites integrated, <2s load time

### **FR-2: OJS Management + Secure Module**
**Business Need:** Manage 132 OJS instances dengan secure credentials  
**Requirements:**
- ✅ CRUD operations untuk OJS instances
- ✅ Version tracking & server location
- ✅ OJS Secure: dual authentication system
- ✅ Encrypted credential storage (AES-256)
- ✅ Audit trail untuk credential access
**Success Criteria:** All OJS integrated, credentials encrypted, audit 100%

### **FR-3: Domain Monitoring Module**
**Business Need:** Prevent domain loss through automated tracking  
**Requirements:**
- ✅ WHOIS integration untuk expiry checking
- ✅ Automated alerts (30/14/7 hari before expiry)
- ✅ Support website + OJS domain tracking
- ✅ Main domain filtering (exclude subdomain)
- ✅ Domain registrar & registration date tracking
**Success Criteria:** 100% domain tracked, zero missed expiry alerts

### **FR-4: PageSpeed Monitoring Module**
**Business Need:** Ensure optimal performance untuk SEO & UX  
**Requirements:**
- ✅ Integration dengan PagePilot API
- ✅ Mobile & desktop performance testing
- ✅ Historical data & trend analysis
- ✅ Performance scoring & benchmarking
- ✅ Breakdown by holding company
**Success Criteria:** PageSpeed tracked 100% websites, trends visible

### **FR-5: Uptime Monitoring Module**
**Business Need:** Early detection website downtime  
**Requirements:**
- ✅ Availability checking (5-minute intervals)
- ✅ Response time tracking
- ✅ Downtime incident recording
- ✅ Uptime percentage calculation
- ✅ Historical uptime data
**Success Criteria:** Downtime detected <5 minutes, 100% incidents recorded

### **FR-6: Notification System**
**Business Need:** Proactive communication untuk critical events  
**Requirements:**
- ✅ Real-time in-app notifications
- ✅ Event types: domain expiry, downtime, PageSpeed degradation
- ✅ Notification history & read status
- ✅ Customizable alert thresholds
- ✅ Multi-channel delivery (future: email, SMS)
**Success Criteria:** Notifications delivered 100%, zero missed critical alerts

### **FR-7: Dashboard & Reporting**
**Business Need:** Executive visibility & decision support  
**Requirements:**
- ✅ Comprehensive overview dashboard
- ✅ Key metrics & statistics cards
- ✅ Charts & visualizations
- ✅ Filtering & search capabilities
- ✅ Export functionality
**Success Criteria:** Dashboard accessible, data accurate, load <3s

### **FR-8: Authentication & Access Control**
**Business Need:** Security & appropriate access levels  
**Requirements:**
- ✅ Role-based authentication (Super Admin, Viewer, PageSpeed)
- ✅ Laravel Sanctum token-based security
- ✅ Session management (120-minute timeout)
- ✅ Dual authentication untuk secure modules
- ✅ Audit trail untuk sensitive operations
**Success Criteria:** Authorization working, audit trail 100%

---

## 🎯 **NON-FUNCTIONAL REQUIREMENTS**

### **Performance Requirements**
| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| **Dashboard Load Time** | <3 seconds | Browser DevTools |
| **API Response Time** | <2 seconds (90% requests) | Server monitoring |
| **Database Query Time** | <500ms per query | MySQL profiling |
| **Concurrent Users** | 50 users | Load testing |
| **System Uptime** | >99.5% | Uptime monitoring |

### **Security Requirements**
| Requirement | Implementation | Verification |
|-------------|----------------|--------------|
| **Credential Encryption** | AES-256 | Database inspection |
| **Session Security** | Laravel Sanctum | Security audit |
| **HTTPS Enforcement** | 100% communications | SSL certificate |
| **Access Control** | Role-based permissions | Permission testing |
| **Audit Trail** | All sensitive operations | Log analysis |

### **Usability Requirements**
| Aspect | Requirement | Success Metric |
|--------|------------|----------------|
| **Learning Curve** | <2 hours training | User feedback |
| **Task Completion** | >95% success rate | Usability testing |
| **User Satisfaction** | >4.0/5.0 score | TAM survey |
| **Error Recovery** | Graceful degradation | Error handling test |
| **Mobile Support** | Responsive design | Cross-device testing |

---

## 👥 **STAKEHOLDER REQUIREMENTS**

### **IT Team Requirements (Primary Users)**
**Daily Needs:**
- ✅ **Efficient monitoring workflow** - reduce 4 jam → 30 menit
- ✅ **Proactive alerts** - know problems before users complain  
- ✅ **Secure credential access** - safe OJS login management
- ✅ **Reliable system** - minimal downtime & bugs

**Success Metrics:**
- Time saving >80%, user satisfaction >4.0/5.0, adoption rate >90%

### **Management Requirements (Decision Makers)**
**Strategic Needs:**
- ✅ **Real-time visibility** - status semua aset in single view
- ✅ **Executive dashboard** - KPI metrics & trend analysis
- ✅ **Risk mitigation** - prevent domain loss & security breach
- ✅ **ROI tracking** - measurable business benefits

**Success Metrics:**
- Dashboard usage >80%, decision speed +50%, risk incidents = 0

### **Domain Administrator Requirements**
**Operational Needs:**
- ✅ **Domain expiry tracking** - never miss renewal deadline
- ✅ **Renewal planning** - advance notification & reporting
- ✅ **Registrar management** - centralized domain information
- ✅ **Historical data** - track domain lifecycle

**Success Metrics:**
- Zero domain loss, 100% expiry alerts delivered, planning efficiency +80%

---

## 📊 **SUCCESS CRITERIA & KPIs**

### **Primary Success Metrics**

#### **Efficiency KPIs**
| KPI | Baseline | Target | Timeline | Measurement |
|-----|----------|--------|----------|-------------|
| **Daily Monitoring Time** | 4 jam | 30 menit | 3 bulan | Time tracking |
| **Websites per Hour** | 55 websites | 440+ websites | 3 bulan | Productivity metrics |
| **Manual Tasks** | 100% | <10% | 3 bulan | Process analysis |
| **Staff Overtime** | 10 jam/bulan | <2 jam/bulan | 6 bulan | HR metrics |

#### **Risk Management KPIs**
| KPI | Baseline | Target | Timeline | Measurement |
|-----|----------|--------|----------|-------------|
| **Domain Loss Incidents** | 2-3/tahun | 0/tahun | 12 bulan | Incident tracking |
| **Downtime Detection** | 2-4 jam | <5 menit | 3 bulan | Alert timestamps |
| **Security Breaches** | 1/tahun risk | 0/tahun | 12 bulan | Security monitoring |
| **Data Accuracy** | 70% | >95% | 6 bulan | Audit results |

#### **User Experience KPIs**
| KPI | Baseline | Target | Timeline | Measurement |
|-----|----------|--------|----------|-------------|
| **User Satisfaction** | 60% | >80% | 6 bulan | TAM survey |
| **System Adoption** | 0% | >90% | 3 bulan | Usage analytics |
| **Training Time** | N/A | <2 jam | 1 bulan | Training records |
| **Support Tickets** | N/A | <5/bulan | 6 bulan | Helpdesk data |

### **Technical Performance KPIs**
| KPI | Target | Measurement Method |
|-----|--------|--------------------|
| **Dashboard Load** | <3s | Automated testing |
| **API Response** | <2s (90%) | Server monitoring |
| **System Uptime** | >99.5% | Uptime tracking |
| **Error Rate** | <0.1% | Error logging |
| **Scalability** | 50 concurrent users | Load testing |

---

## 💰 **ROI CALCULATION & BUSINESS CASE**

### **Investment Costs**
💸 **Direct Costs:**
- Development: **Rp 0** (mahasiswa thesis project)
- Infrastructure: **Rp 2 juta/tahun** (existing shared hosting)
- Third-party APIs: **Rp 3 juta/tahun** (PagePilot, WHOIS)
- Training: **Rp 1 juta** (one-time)
- **Total Annual Investment: Rp 6 juta**

### **Quantifiable Benefits (Annual)**
💰 **Direct Savings:**
- IT efficiency (4 jam → 30 menit): **Rp 36 juta/tahun**
- Domain loss prevention (2-3 incidents): **Rp 15 juta/tahun**
- Downtime reduction (early detection): **Rp 25 juta/tahun**
- Security risk mitigation: **Rp 5 juta/tahun**
- **Total Annual Benefits: Rp 81 juta**

### **ROI Analysis**
🎯 **Return on Investment:**
- **Net Benefit:** Rp 81 juta - Rp 6 juta = **Rp 75 juta/tahun**
- **ROI Percentage:** (75/6) × 100 = **1,250% per tahun**
- **Payback Period:** 6 juta / (81 juta/12) = **0.9 bulan**
- **Break-even:** Month 1 sudah profitable

### **Intangible Benefits**
✨ **Additional Value:**
- **Improved decision making** dengan real-time data
- **Enhanced security posture** & compliance
- **Better customer satisfaction** (less downtime)
- **Staff morale improvement** (less manual work)
- **Scalability foundation** untuk future growth

---

## 🎯 **ACCEPTANCE CRITERIA**

### **Business Acceptance**
✅ **Must Achieve untuk Go-Live:**
- Monitoring time reduction **≥80%** (target 87.5%)
- Domain expiry alerts **100% delivered** on time
- User satisfaction score **≥4.0/5.0** (TAM survey)
- System uptime **≥99%** during evaluation period
- Zero security incidents during testing

### **Functional Acceptance**
✅ **All Features Must Work:**
- 222 websites successfully integrated & monitored
- 132 OJS instances + secure credential management
- Domain monitoring dengan automated alerts
- PageSpeed & uptime tracking operational
- Dashboard load time <3 seconds consistently

### **Technical Acceptance**
✅ **Performance Standards:**
- Load testing: 50 concurrent users supported
- Security testing: No critical vulnerabilities
- Integration testing: All APIs working properly
- Backup & recovery: Tested & verified
- Documentation: Complete & accurate

---

## 🚀 **IMPLEMENTATION STRATEGY**

### **Phased Rollout Approach**
📅 **Phase 1: Core System (Week 1-8)**
- Website & OJS management modules
- Basic authentication & user management
- Foundation for monitoring features

📅 **Phase 2: Monitoring Features (Week 9-12)**
- Domain monitoring dengan WHOIS integration
- PageSpeed monitoring setup
- Uptime checking implementation  

📅 **Phase 3: Advanced Features (Week 13-16)**
- Notification system & real-time alerts
- Dashboard optimization & reporting
- Security hardening & audit trails

📅 **Phase 4: Testing & Deployment (Week 17-18)**
- User acceptance testing dengan stakeholders
- Production deployment & go-live
- Post-launch monitoring & support

### **Change Management**
👥 **User Adoption Strategy:**
- **Training sessions:** 2-hour workshop untuk IT team
- **Pilot program:** 1 minggu testing dengan subset users
- **Feedback loop:** Weekly check-ins during rollout
- **Support system:** Documentation + helpdesk availability

---

## ✅ **BRD APPROVAL & SIGN-OFF**

### **Review & Approval Process**
🔍 **Review Criteria:**
- Business requirements completeness & accuracy
- Technical feasibility & realistic targets
- ROI calculation & business justification
- Risk assessment & mitigation strategies
- Implementation timeline & resource allocation

### **Approval Stakeholders**
| Role | Responsibility | Approval Status |
|------|---------------|----------------|
| **Business Owner** | Requirements accuracy | [ ] Approved |
| **IT Manager** | Technical feasibility | [ ] Approved |
| **Management** | Business case & ROI | [ ] Approved |
| **Academic Advisor** | Research methodology | [ ] Approved |

### **Success Definition**
✅ **BRD approved when:**
- All stakeholders sign-off completed
- Success criteria clearly defined & measurable
- Implementation plan realistic & achievable
- Risk mitigation strategies adequate
- Academic requirements aligned dengan business goals

---

*Business Requirements Document - ITM SCI*  
*PT Syntax Transformation Indonesia*  
*[Tanggal] | Versi 1.0 | [Nama Mahasiswa]*