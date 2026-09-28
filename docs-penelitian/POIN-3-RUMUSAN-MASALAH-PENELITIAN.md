# 🔬 POIN 3: RUMUSAN MASALAH PENELITIAN
## ITM SCI - Ubah Masalah Proyek jadi Pertanyaan Penelitian

---

## 🔄 **JEMBATAN: DARI BRD KE PENELITIAN**

### **🏢 BAHASA BISNIS (BRD Reality)**
*"PT Syntax mengelola 222 website + 132 OJS instances dengan monitoring manual 4 jam/hari, risiko domain loss 2-3/tahun, kredensial OJS tidak secure, dan downtime detection reactive 2-4 jam. Butuh sistem monitoring terpadu dengan automated alerts, encrypted credentials, dan real-time dashboard untuk achieve 87.5% efficiency improvement."*

### **⬇️ TRANSFORMASI AKADEMIK ⬇️**

### **🎓 BAHASA PENELITIAN (Academic Inquiry)**
*"Bagaimana merancang sistem monitoring terpadu berbasis Design Science Research yang dapat meningkatkan efisiensi manajemen 222 aset digital PT Syntax dengan target 87.5% time reduction, zero domain loss, dan <5 menit detection time, dengan mempertimbangkan aspek integrasi multi-module, security dual authentication, dan usability user experience?"*

---

## 📋 **PROBLEM IDENTIFICATION**

### **Research Domain**
**Primary:** Information Systems / Sistem Informasi  
**Sub-domain:** Enterprise Monitoring Systems, Digital Asset Management  
**Methodology:** Design Science Research (DSR)  

### **Problem Context - PT Syntax**
🔍 **Organizational Context:**
- **Industry:** Technology & Digital Services
- **Scale:** 222 websites + 132 OJS instances  
- **Challenge:** Manual monitoring inefficiency + security risks
- **Impact:** 4 jam/hari wasted + Rp 85-708 juta annual risk

🔍 **Technical Context:**
- **Current State:** Fragmented monitoring tools + spreadsheet-based tracking
- **Pain Points:** No integration, reactive detection, security vulnerabilities  
- **Constraints:** Shared hosting, limited budget, third-party API dependencies

### **Research Gap Analysis**
❓ **Knowledge Gap Identified:**
1. **Limited research** tentang integrated monitoring systems untuk multi-website environments dalam Indonesian business context
2. **Lack of framework** untuk implementing dual authentication systems dalam monitoring platforms
3. **No comprehensive evaluation** metodologi untuk measuring efficiency improvements dalam digital asset management
4. **Insufficient guidelines** untuk DSR application dalam enterprise monitoring system development

---

## ❓ **RESEARCH QUESTIONS**

### **🎯 PRIMARY RESEARCH QUESTION (RQ1)**
> **"Bagaimana merancang sistem monitoring terpadu berbasis Design Science Research yang dapat meningkatkan efisiensi manajemen 222 aset digital PT Syntax dengan target 87.5% time reduction, zero domain loss, dan <5 menit detection time?"**

### **🔍 SECONDARY RESEARCH QUESTIONS**

#### **RQ2: Requirements & Architecture**
*"Apa kebutuhan fungsional dan non-fungsional spesifik untuk sistem monitoring yang dapat mengintegrasikan 222 website + 132 OJS instances dalam single platform dengan performance <3 detik load time?"*

**Sub-questions:**
- RQ2.1: Bagaimana merancang arsitektur yang scalable untuk 222+ aset?
- RQ2.2: Apa requirements untuk real-time monitoring tanpa performance degradation?
- RQ2.3: Bagaimana integrasikan multiple data sources (website, OJS, domain, performance) secara efficient?

#### **RQ3: Security Implementation**
*"Bagaimana mengimplementasikan dual authentication system (Laravel Sanctum + module-specific credentials) untuk secure access ke sensitive OJS data dengan tetap maintaining usability?"*

**Sub-questions:**
- RQ3.1: Encryption method apa yang optimal untuk 132 OJS credentials storage?
- RQ3.2: Bagaimana design audit trail system untuk comprehensive security logging?
- RQ3.3: Bagaimana balance security requirements dengan user experience efficiency?

#### **RQ4: Third-party Integration**  
*"Bagaimana strategi integrasi third-party APIs (PagePilot, WHOIS services) dalam shared hosting environment dengan retry mechanisms dan error handling untuk ensure 99.5% reliability?"*

**Sub-questions:**
- RQ4.1: Bagaimana handle API rate limits (PagePilot 500 requests/day) untuk continuous monitoring?
- RQ4.2: Apa fallback strategies untuk WHOIS service failures atau inconsistent data?
- RQ4.3: Bagaimana implement queue system untuk batch processing dalam shared hosting constraints?

#### **RQ5: Performance Optimization**
*"Bagaimana memastikan sistem dapat handle 222+ aset dengan 50 concurrent users dan real-time notifications tanpa performance degradation below <3s dashboard load time?"*

**Sub-questions:**
- RQ5.1: Database optimization techniques apa untuk handle large-scale monitoring data?
- RQ5.2: Bagaimana implement caching strategies untuk improve response time?
- RQ5.3: Frontend optimization approaches untuk maintain responsiveness dengan complex dashboard?

#### **RQ6: Effectiveness Evaluation**
*"Seberapa efektif sistem ITM SCI dalam mencapai target 87.5% efficiency improvement dan zero domain loss berdasarkan quantitative metrics (time tracking, incident logs) dan qualitative assessment (user satisfaction, usability testing)?"*

**Sub-questions:**
- RQ6.1: Measurement framework apa yang appropriate untuk evaluate monitoring system effectiveness?
- RQ6.2: Bagaimana validate user satisfaction improvement menggunakan Technology Acceptance Model (TAM)?
- RQ6.3: Apa success indicators untuk long-term system sustainability & adoption?

---

## 🎯 **RESEARCH OBJECTIVES**

### **🏆 TUJUAN UMUM (General Objective)**
Merancang, membangun, dan mengevaluasi sistem monitoring terpadu (ITM SCI) menggunakan Design Science Research methodology untuk meningkatkan efisiensi manajemen aset digital PT Syntax dari 240 menit/hari menjadi 30 menit/hari dengan maintaining security, scalability, dan usability standards.

### **📋 TUJUAN KHUSUS (Specific Objectives)**

#### **O1: Requirements Analysis & System Design**
- **Menganalisis** kebutuhan fungsional & non-fungsional untuk monitoring 222 website + 132 OJS instances
- **Merancang** layered architecture (React frontend + Laravel backend + MySQL) dengan third-party API integration
- **Mendefinisikan** security model untuk dual authentication dan encrypted credential storage

#### **O2: System Implementation & Integration**
- **Mengimplementasikan** ITM SCI system dengan 9 core modules (Website, OJS, Domain, PageSpeed, Uptime, Notifications, etc.)
- **Mengintegrasikan** third-party APIs (PagePilot, WHOIS) dengan proper error handling dan retry mechanisms  
- **Membangun** dual authentication system (Laravel Sanctum + OJS Secure credentials)

#### **O3: Performance Optimization & Security**
- **Memastikan** system performance meets targets (<3s dashboard load, <2s API response, 50 concurrent users)
- **Mengimplementasikan** comprehensive security measures (AES-256 encryption, audit trails, access control)
- **Mengoptimalkan** database queries dan frontend rendering untuk large-scale data handling

#### **O4: Evaluation & Validation**
- **Mengevaluasi** system effectiveness menggunakan quantitative metrics (time reduction, detection speed, uptime)
- **Mengukur** user satisfaction dan usability menggunakan Technology Acceptance Model (TAM) dan System Usability Scale (SUS)
- **Memvalidasi** business impact achievement (87.5% efficiency gain, zero domain loss, ROI >1000%)

#### **O5: Knowledge Contribution & Documentation**
- **Menghasilkan** DSR framework dan best practices untuk integrated monitoring systems development
- **Mendokumentasikan** lessons learned dan recommendations untuk similar projects
- **Menyediakan** comprehensive technical documentation untuk system maintenance dan future enhancement

---

## 🎓 **RESEARCH CONTRIBUTIONS**

### **📚 THEORETICAL CONTRIBUTIONS**

#### **DSR Methodology Application**
- **Framework Development:** Systematic approach untuk applying DSR dalam enterprise monitoring system context
- **Evaluation Model:** Multi-method assessment framework combining quantitative performance metrics dengan qualitative user satisfaction
- **Integration Patterns:** Design patterns untuk integrating multiple monitoring modules dalam single cohesive platform

#### **Digital Asset Management Theory**
- **Conceptual Model:** Theoretical framework untuk large-scale digital asset monitoring and management
- **Security Models:** Dual authentication patterns untuk enterprise monitoring platforms
- **Performance Models:** Optimization strategies untuk real-time monitoring dalam resource-constrained environments

### **💼 PRACTICAL CONTRIBUTIONS**

#### **Direct Business Impact - PT Syntax**
- **Operational Efficiency:** 87.5% time reduction dari 4 jam → 30 menit daily monitoring
- **Risk Mitigation:** Zero domain loss through proactive 30/14/7 day alerts
- **Security Enhancement:** 100% encrypted credentials dengan comprehensive audit trails
- **Cost Savings:** Rp 75+ juta annual savings dengan <Rp 6 juta investment

#### **Industry Template & Best Practices**
- **Reference Implementation:** Working ITM SCI system yang dapat diadaptasi untuk companies dengan multi-website challenges
- **Technology Stack Guidelines:** Proven Laravel + React architecture untuk monitoring platforms dalam shared hosting
- **Integration Cookbook:** Step-by-step approaches untuk third-party API integration (PagePilot, WHOIS) dengan error handling

### **🔬 METHODOLOGICAL CONTRIBUTIONS**

#### **Evaluation Framework**
- **Success Metrics Definition:** Comprehensive KPIs untuk measuring monitoring system effectiveness
- **TAM Application:** Customized Technology Acceptance Model questionnaire untuk enterprise monitoring tools
- **Multi-stakeholder Assessment:** Framework untuk gathering requirements dan feedback dari diverse stakeholder groups (IT, Management, Domain Admin)

#### **Development Methodology**
- **DSR Implementation Guide:** Practical roadmap untuk executing 6-activity DSR framework dalam real business context
- **Risk Mitigation Strategies:** Approaches untuk handling technical, business, dan academic risks dalam integrated projects

---

## 🔬 **RESEARCH METHODOLOGY PREVIEW**

### **Design Science Research (DSR) Framework**
**Selected Framework:** Peffers et al. (2007) - 6 Activities Model

**Rationale for DSR Choice:**
✅ **Problem-oriented:** ITM SCI addresses real business problem di PT Syntax  
✅ **Artifact-centric:** Creates working system sebagai primary contribution  
✅ **Evaluation-focused:** Requires rigorous assessment of effectiveness  
✅ **Iterative:** Allows continuous improvement berdasarkan stakeholder feedback  

### **Research Philosophy & Approach**
**Paradigm:** Pragmatic (focus pada practical solutions yang work)  
**Approach:** Mixed-methods (quantitative performance metrics + qualitative user feedback)  
**Strategy:** Case study dengan single organization (PT Syntax) for deep analysis  

### **Data Collection Methods Preview**
📊 **Quantitative Data:**
- Performance metrics (response time, uptime, error rates)
- Efficiency measurements (time tracking, productivity metrics)  
- Usage analytics (system adoption, feature utilization)

👥 **Qualitative Data:**
- Stakeholder interviews (requirements gathering, feedback collection)
- User satisfaction surveys (TAM questionnaire, SUS scale)
- Usability testing sessions (task-based evaluation)

---

## 💡 **RESEARCH SIGNIFICANCE**

### **🎓 Academic Significance**
**Theory Building:**
- Contributes to DSR methodology literature dengan real-world implementation example
- Extends digital asset management theory dengan integrated monitoring approaches
- Provides empirical evidence untuk effectiveness of dual authentication systems

**Knowledge Gap Filling:**
- Addresses limited research tentang monitoring systems dalam Indonesian business context
- Provides systematic evaluation framework untuk enterprise monitoring tools
- Documents best practices untuk third-party API integration dalam resource-constrained environments

### **💼 Industry Significance**
**Immediate Impact:**
- Solves critical business problem untuk PT Syntax (87.5% efficiency improvement)
- Prevents potential domain losses (Rp 10-150 juta annual risk mitigation)
- Enhances security posture untuk 132 OJS instances

**Broader Industry Value:**
- Template solution untuk companies managing multiple websites
- Proven technology stack recommendations (Laravel + React untuk monitoring)
- Reference architecture untuk similar monitoring platform development

### **🌍 Social & Economic Impact**
**Organizational Benefits:**
- Improved job satisfaction untuk IT team (less manual work)
- Better service reliability untuk website users
- Enhanced decision-making capability untuk management

**Knowledge Dissemination:**
- Open source potential (modified version) untuk community benefit
- Academic publication opportunities untuk knowledge sharing
- Training materials untuk future developers

---

## 📏 **RESEARCH SCOPE & LIMITATIONS**

### **✅ RESEARCH SCOPE (What's Included)**
**Functional Scope:**
- Monitoring system untuk 222 websites + 132 OJS instances
- Domain expiry tracking dengan automated alerts
- Performance monitoring (PageSpeed, uptime) dengan historical data
- Secure credential management dengan dual authentication

**Technical Scope:**
- Web-based application (Laravel + React)
- Integration dengan third-party APIs (PagePilot, WHOIS)
- Shared hosting deployment environment
- MySQL database untuk data storage

**Evaluation Scope:**
- 3-6 bulan post-deployment assessment period
- Single organization case study (PT Syntax)
- IT team (7 users) + Management (2 users) untuk evaluation
- Quantitative + qualitative assessment methods

### **❌ RESEARCH LIMITATIONS (What's Excluded)**
**Functional Limitations:**
- No automated website repair/remediation capabilities
- No native mobile application (web-responsive only)
- No advanced AI/ML prediction features
- No integration dengan CMS backends (WordPress admin, OJS admin)

**Technical Limitations:**
- Limited to shared hosting constraints (not cloud/VPS)
- Third-party API rate limits (PagePilot 500 requests/day)
- Single technology stack evaluation (no comparison dengan alternatives)
- Maximum 50 concurrent users (scalability limit)

**Research Limitations:**
- Single organization case study (limited generalizability)
- Short evaluation period (3-6 bulan, not longitudinal)
- Indonesian business context (cultural/regulatory specificity)
- Academic timeline constraints (18 minggu development)

---

## 🎯 **EXPECTED OUTCOMES & HYPOTHESES**

### **💡 RESEARCH HYPOTHESES**

#### **H1: Efficiency Improvement Hypothesis**
*"Implementation of integrated monitoring system (ITM SCI) will significantly improve operational efficiency of IT team, achieving minimum 80% reduction dalam daily monitoring time."*

**Basis:** Information Systems Success Theory (DeLone & McLean)  
**Measurement:** Time tracking before/after, productivity metrics  
**Target:** 87.5% improvement (240 menit → 30 menit)

#### **H2: Risk Reduction Hypothesis**  
*"Automated domain expiry alerts dan proactive monitoring will eliminate domain loss incidents dan reduce downtime detection time to <5 minutes."*

**Basis:** Early Warning Systems effectiveness theory  
**Measurement:** Incident tracking, alert response times  
**Target:** Zero domain loss, <5 min detection

#### **H3: User Acceptance Hypothesis**
*"ITM SCI system akan achieve high user acceptance (>4.0/5.0 TAM score) due to perceived usefulness dan ease of use improvements."*

**Basis:** Technology Acceptance Model (Davis, 1989)  
**Measurement:** TAM questionnaire, SUS scale, adoption rates  
**Target:** >4.0/5.0 satisfaction, >90% adoption

#### **H4: Performance Scalability Hypothesis**
*"Laravel + React architecture with proper optimization can handle 222+ digital assets monitoring dengan <3s dashboard load time dan 50 concurrent users."*

**Basis:** Web application performance best practices  
**Measurement:** Load testing, response time monitoring  
**Target:** <3s load, <2s API response, 50 users

---

## 📊 **VALIDATION FRAMEWORK**

### **Success Criteria Definition**
✅ **Academic Success:**
- DSR methodology properly implemented (all 6 activities completed)
- Rigorous evaluation dengan quantitative + qualitative methods
- Clear theoretical dan practical contributions documented
- Thesis defense ready dengan comprehensive documentation

✅ **Technical Success:**
- All functional requirements implemented dan working
- Performance targets achieved (<3s load, <2s API, 50 users)
- Security standards met (encryption, audit trails, access control)
- Integration successful dengan third-party APIs

✅ **Business Success:**
- Efficiency improvement ≥80% (target 87.5%)
- User satisfaction ≥4.0/5.0 (TAM survey)
- System adoption ≥90% (active usage rate)
- ROI positive (>1000% expected)

### **Evaluation Timeline**
📅 **Evaluation Phases:**
- **Week 15-16:** Technical evaluation (performance, security, functionality)
- **Week 17:** User acceptance testing (usability, satisfaction surveys)
- **Week 18:** Business impact assessment (efficiency gains, ROI calculation)
- **Week 19-20:** Comprehensive evaluation report dan thesis writing

---

*Rumusan Masalah Penelitian - ITM SCI*  
*Design Science Research Methodology*  
*[Tanggal] | [Nama Mahasiswa] | [Program Studi]*