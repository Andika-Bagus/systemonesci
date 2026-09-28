# 🔬 POIN 4: RANCANGAN METODE DSR 
## ITM SCI - Design Science Research Framework & Implementation

---

## 🎯 **APA ITU DESIGN SCIENCE RESEARCH (DSR)?**

### **DSR Definition**
Design Science Research adalah **metodologi penelitian** yang fokus pada:
- **Creating artifacts** (sistem, model, framework) untuk solve practical problems
- **Demonstrating utility** melalui rigorous evaluation  
- **Contributing knowledge** untuk theory dan practice
- **Iterative process** dengan continuous improvement

### **Kenapa Pilih DSR untuk ITM SCI?**
✅ **Problem-oriented:** PT Syntax punya real business problem (manual monitoring inefficiency)  
✅ **Artifact-centric:** Creates working system (ITM SCI) sebagai solution  
✅ **Evaluation-focused:** Must prove effectiveness dengan measurable results  
✅ **Practical impact:** Immediate business value + academic contribution  

### **DSR vs Traditional Research**
| Aspect | Traditional Research | Design Science Research |
|--------|---------------------|------------------------|
| **Focus** | Understanding phenomena | Creating solutions |
| **Output** | Knowledge, theories | Artifacts, systems |
| **Validation** | Statistical testing | Utility demonstration |
| **Impact** | Academic contribution | Business + academic value |

---

## 📋 **DSR FRAMEWORK: PEFFERS MODEL (2007)**

### **6-Activity DSR Framework Selected**
**Framework:** Peffers, Tuunanen, Rothenberger & Chatterjee (2007)  
**Rationale:** Most comprehensive + widely accepted dalam Information Systems research

### **🔄 DSR ACTIVITIES OVERVIEW**

```
Activity 1: Problem Identification & Motivation
         ↓
Activity 2: Define Objectives of Solution  
         ↓
Activity 3: Design & Development
         ↓
Activity 4: Demonstration
         ↓
Activity 5: Evaluation
         ↓
Activity 6: Communication
```

---

## 🎯 **ACTIVITY 1: PROBLEM IDENTIFICATION & MOTIVATION**

### **Problem Definition Process**
🔍 **Stakeholder Analysis (Week 1):**
- **Primary interviews** dengan 7 IT team members PT Syntax
- **Management interviews** dengan 2 decision makers
- **Domain administrator interview** untuk understand current process
- **Observation** proses monitoring manual selama 1 week

### **Problem Statement Refinement**
📝 **From Initial Problem to Research Problem:**
1. **Business Problem:** "Manual monitoring 4 jam/hari tidak efficient"
2. **Technical Problem:** "No integrated system untuk 222 websites + 132 OJS"
3. **Research Problem:** "Lack of framework untuk developing integrated monitoring systems dalam Indonesian business context"

### **Motivation & Significance**
💡 **Why This Problem Matters:**
- **Financial Impact:** Rp 85-708 juta annual cost of current inefficiencies
- **Operational Risk:** 2-3 domain near-miss incidents per year
- **Security Risk:** 132 OJS credentials stored plain text
- **Strategic Risk:** No real-time visibility untuk decision making

### **Problem Validation Methods**
✅ **Evidence Gathering:**
- Time & motion study (shadow IT team untuk 1 week)
- Document analysis (existing spreadsheets, procedures, incidents)
- Industry benchmarking (compare dengan best practices)
- Cost-benefit analysis (quantify current vs future state)

### **Activity 1 Deliverables**
📋 **Output Documents:**
- Problem statement document dengan stakeholder validation
- Current state analysis report (as-is process mapping)
- Business case justification dengan ROI calculation
- Research gap analysis dalam monitoring systems literature

---

## 🎯 **ACTIVITY 2: DEFINE OBJECTIVES OF SOLUTION**

### **Solution Objectives Hierarchy**

#### **🏆 PRIMARY OBJECTIVE**
*"Develop integrated monitoring system (ITM SCI) that achieves 87.5% efficiency improvement dalam daily monitoring operations while ensuring security, scalability, dan usability standards."*

#### **📊 SPECIFIC OBJECTIVES & SUCCESS METRICS**
| Objective Category | Specific Target | Success Metric | Timeline |
|--------------------|-----------------|----------------|----------|
| **Efficiency** | 87.5% time reduction | 240 min → 30 min | 3 months |
| **Risk Mitigation** | Zero domain loss | 0 incidents | 12 months |
| **Performance** | Fast system response | <3s dashboard load | Go-live |
| **Security** | Encrypted credentials | 100% AES-256 | Go-live |
| **Usability** | High user acceptance | >4.0/5.0 TAM score | 6 months |

### **Objectives Validation Process**
🎯 **Stakeholder Alignment Sessions:**
- **Business objectives validation** dengan management
- **Technical feasibility review** dengan IT team  
- **User experience objectives** dengan end users
- **Academic objectives alignment** dengan dosen pembimbing

### **SMART Objectives Framework**
✅ **Specific:** Clear definition untuk each objective  
✅ **Measurable:** Quantifiable metrics untuk each target  
✅ **Achievable:** Realistic given 18-week timeline  
✅ **Relevant:** Addresses core business problems  
✅ **Time-bound:** Clear deadlines untuk evaluation  

### **Activity 2 Deliverables**  
📋 **Output Documents:**
- Solution objectives document dengan stakeholder sign-off
- Success criteria definition dengan measurement methods
- Requirements specification (functional + non-functional)
- Project charter dengan scope, timeline, resources

---

## 🎯 **ACTIVITY 3: DESIGN & DEVELOPMENT**

### **Design Process Framework**

#### **🏗️ ARCHITECTURAL DESIGN (Week 3-5)**
**System Architecture Design:**
- **Frontend:** React 18 + TypeScript + TailwindCSS
- **Backend:** Laravel 11 + PHP 8.2 + RESTful APIs
- **Database:** MySQL dengan optimized schema design
- **Integration:** PagePilot API + WHOIS services + Laravel Sanctum

**Design Patterns Applied:**
- **MVC Pattern:** Laravel backend structure
- **Component Architecture:** React modular components
- **Repository Pattern:** Data access abstraction
- **Observer Pattern:** Real-time notifications

#### **🗄️ DATABASE DESIGN (Week 4)**
**Entity Relationship Design:**
```
Users (authentication) ←→ Websites (222 records)
                      ←→ OJS Instances (132 records)  
                      ←→ Domain Monitoring
                      ←→ PageSpeed History
                      ←→ Uptime Checks
                      ←→ Notifications
                      ←→ Secure Sessions (OJS/WP)
```

**Optimization Strategies:**
- Indexing untuk frequent queries
- Partitioning untuk historical data
- Caching strategies untuk dashboard

#### **🔐 SECURITY DESIGN (Week 5)**
**Multi-layer Security Architecture:**
- **Authentication:** Laravel Sanctum token-based
- **Authorization:** Role-based access control (RBAC)
- **Encryption:** AES-256 untuk sensitive credentials
- **Audit Trail:** Comprehensive logging untuk all operations
- **Dual Authentication:** Additional layer untuk OJS Secure module

### **Development Methodology**

#### **📅 ITERATIVE DEVELOPMENT (Week 6-14)**
**Sprint-based Approach:**
- **Sprint 1 (Week 6-7):** Core authentication + website management
- **Sprint 2 (Week 8-9):** OJS management + secure credentials
- **Sprint 3 (Week 10-11):** Domain monitoring + alerts
- **Sprint 4 (Week 12-13):** Performance monitoring + dashboard
- **Sprint 5 (Week 14):** Integration testing + bug fixes

**Quality Assurance Process:**
- Code review untuk each module
- Unit testing untuk critical functions  
- Integration testing untuk APIs
- Security testing untuk vulnerabilities
- Performance testing untuk load capacity

### **Development Tools & Environment**
🛠️ **Development Stack:**
- **IDE:** Visual Studio Code dengan extensions
- **Version Control:** Git dengan feature branches
- **Database:** MySQL Workbench untuk schema design
- **API Testing:** Postman untuk endpoint validation
- **Performance:** Browser DevTools + server monitoring

### **Activity 3 Deliverables**
📋 **Output Artifacts:**
- Complete ITM SCI system (working application)
- Technical architecture documentation
- Database schema dengan optimization notes
- API documentation dengan examples
- Security implementation guide
- Developer setup & deployment guide

---

## 🎯 **ACTIVITY 4: DEMONSTRATION**

### **Demonstration Strategy**

#### **🎪 PROOF-OF-CONCEPT DEMOS (Week 15)**
**Demo Sessions Schedule:**
- **Day 1:** Core functionality demo (website + OJS management)
- **Day 2:** Monitoring features demo (domain + performance tracking)
- **Day 3:** Security features demo (OJS Secure + audit trails)
- **Day 4:** Dashboard & reporting demo (real-time data + notifications)
- **Day 5:** Integration demo (third-party APIs + complete workflow)

#### **👥 STAKEHOLDER DEMO SESSIONS**
**Audience-specific Demonstrations:**
- **IT Team Demo:** Focus pada daily workflow efficiency
- **Management Demo:** Executive dashboard + strategic insights  
- **Domain Admin Demo:** Domain tracking + renewal planning
- **Security Demo:** Credential management + audit capabilities

### **Demonstration Environment**
🖥️ **Setup Requirements:**
- **Live Environment:** Production-like shared hosting setup
- **Real Data:** 222 websites + 132 OJS instances loaded
- **API Integration:** Working PagePilot + WHOIS connections
- **User Scenarios:** Realistic task-based demonstrations

### **Demo Success Criteria**
✅ **Technical Demonstration:**
- All features working without critical bugs
- Performance meets targets (<3s dashboard load)
- Security features operational (encryption + audit)
- Integration stable dengan third-party APIs

✅ **User Experience Demo:**
- Intuitive navigation + task completion
- Responsive design across devices
- Error handling graceful + informative
- Real-time features working smoothly

### **Activity 4 Deliverables**
📋 **Output Materials:**
- Demo scenarios dan test cases
- Stakeholder feedback collection forms
- Technical demonstration recordings
- Feature showcase presentation
- Issues log dan improvement suggestions

---

## 🎯 **ACTIVITY 5: EVALUATION**

### **Comprehensive Evaluation Framework**

#### **📊 QUANTITATIVE EVALUATION (Week 16-17)**

**Performance Metrics Evaluation:**
| Metric Category | Measurement Method | Target | Evaluation Period |
|-----------------|-------------------|--------|-------------------|
| **System Performance** | Load testing tools | <3s dashboard | 2 weeks |
| **API Performance** | Response time monitoring | <2s API calls | 2 weeks |
| **User Efficiency** | Time tracking study | 87.5% improvement | 4 weeks |
| **System Reliability** | Uptime monitoring | >99.5% availability | 4 weeks |

**Business Impact Metrics:**
- **Monitoring Time:** Before/after comparison (240 min vs 30 min)
- **Domain Incidents:** Track zero incidents target
- **Detection Speed:** Measure <5 minute downtime detection
- **Cost Savings:** Calculate actual vs projected ROI

#### **👥 QUALITATIVE EVALUATION (Week 17-18)**

**User Acceptance Evaluation - Technology Acceptance Model (TAM):**
```
Perceived Usefulness → 
                     → Attitude Toward Using → Behavioral Intention
Perceived Ease of Use → 
```

**TAM Questionnaire Sections:**
- **Perceived Usefulness (PU):** 6 questions, 5-point Likert scale
- **Perceived Ease of Use (PEOU):** 6 questions, 5-point Likert scale  
- **Attitude Toward Using (ATU):** 4 questions, 5-point Likert scale
- **Behavioral Intention (BI):** 3 questions, 5-point Likert scale

**System Usability Scale (SUS) Assessment:**
- 10 questions standard SUS questionnaire
- Target: >68 (above average), ideal >80 (excellent)
- Administered to all 9 primary users (7 IT + 2 Management)

#### **🔍 MIXED-METHODS EVALUATION**

**Triangulation Approach:**
1. **Quantitative Data:** Performance metrics + usage analytics
2. **Qualitative Data:** Interviews + surveys + observations  
3. **Cross-validation:** Multiple data sources untuk reliability

**Evaluation Participants:**
- **Primary Users:** 7 IT team members (daily users)
- **Secondary Users:** 2 management (strategic users)
- **Domain Expert:** 1 domain administrator (specialized user)
- **Observer:** Academic advisor (methodology validation)

### **Evaluation Methods Detail**

#### **📈 EFFICIENCY MEASUREMENT PROTOCOL**
**Pre-implementation Baseline (1 Week):**
- Time & motion study: Record current monitoring process
- Task analysis: Break down activities into components  
- Productivity measurement: Websites monitored per hour
- Pain point identification: Document friction areas

**Post-implementation Assessment (4 Weeks):**
- Same measurement protocol applied dengan ITM SCI
- Daily time logs untuk all monitoring activities
- Comparative analysis: Before vs after efficiency
- Statistical significance testing (paired t-test)

#### **💯 USER SATISFACTION ASSESSMENT**
**Multi-method User Research:**
- **Surveys:** TAM questionnaire + SUS scale + custom satisfaction
- **Interviews:** Semi-structured interviews dengan key users  
- **Usability Testing:** Task-based testing dengan think-aloud protocol
- **Focus Groups:** Group discussions untuk collective insights

### **Activity 5 Deliverables**
📋 **Output Reports:**
- Comprehensive evaluation report (quantitative + qualitative)
- Performance benchmarking results
- User acceptance assessment (TAM + SUS scores)
- Business impact analysis dengan ROI calculation
- Recommendations untuk improvement + future enhancement

---

## 🎯 **ACTIVITY 6: COMMUNICATION**

### **Communication Strategy**

#### **📚 ACADEMIC COMMUNICATION**
**Thesis Document Structure:**
1. **BAB 1 - PENDAHULUAN:** Problem identification + research questions
2. **BAB 2 - TINJAUAN PUSTAKA:** Literature review + theoretical foundation
3. **BAB 3 - METODOLOGI:** DSR framework implementation details
4. **BAB 4 - ANALISIS & PERANCANGAN:** Requirements + system design
5. **BAB 5 - IMPLEMENTASI:** Development process + technical details
6. **BAB 6 - EVALUASI:** Comprehensive evaluation results
7. **BAB 7 - PENUTUP:** Conclusions + recommendations + future work

**Academic Presentations:**
- **Seminar Proposal:** Research methodology + planned approach
- **Seminar Hasil:** Implementation progress + preliminary results  
- **Sidang Skripsi:** Complete research + comprehensive evaluation
- **Publikasi (Optional):** Conference paper atau journal article

#### **💼 BUSINESS COMMUNICATION**
**Stakeholder Reporting:**
- **Executive Summary:** High-level results untuk management
- **Technical Report:** Detailed implementation untuk IT team
- **User Guide:** Comprehensive manual untuk system operation  
- **ROI Report:** Financial impact analysis untuk business justification

**Knowledge Transfer:**
- **Training Sessions:** Hands-on training untuk all users
- **Documentation Handover:** Complete technical + user documentation
- **Support Transition:** Setup helpdesk + maintenance procedures

#### **🌍 INDUSTRY & COMMUNITY SHARING**
**Knowledge Dissemination:**
- **Case Study Publication:** ITM SCI implementation story
- **Best Practices Guide:** Framework untuk similar implementations
- **Open Source Components (Selective):** Share non-sensitive modules
- **Conference Presentations:** Share DSR methodology experience

### **Communication Timeline**
📅 **Structured Communication Schedule:**
- **Week 18:** Academic thesis draft completion
- **Week 19:** Business deliverables + training materials
- **Week 20:** Final presentations + knowledge transfer
- **Week 21-22:** Thesis refinement + defense preparation
- **Post-defense:** Industry sharing + potential publication

### **Activity 6 Deliverables**
📋 **Output Communications:**
- Complete thesis document (80-120 pages)
- Executive summary untuk business stakeholders  
- Technical documentation package
- Training materials + user guides
- Academic presentation materials
- Industry case study report

---

## 🔄 **DSR ITERATION & FEEDBACK LOOPS**

### **Iterative Refinement Process**

#### **🔄 BUILD-EVALUATE-REFINE CYCLES**
**Iteration 1 (Week 6-8):** Core functionality + initial user feedback  
**Iteration 2 (Week 9-11):** Enhanced features + performance optimization  
**Iteration 3 (Week 12-14):** Integration refinement + security hardening  
**Iteration 4 (Week 15-17):** Evaluation feedback + final adjustments  

### **Feedback Integration Mechanism**
🔍 **Continuous Stakeholder Engagement:**
- **Weekly Check-ins:** Progress updates + immediate feedback
- **Milestone Reviews:** Formal evaluation + direction confirmation  
- **User Testing Sessions:** Regular usability testing + improvement suggestions
- **Academic Reviews:** Methodology validation + theoretical alignment

### **Quality Assurance Throughout DSR**
✅ **Multi-perspective Validation:**
- **Technical Validation:** Code review + performance testing
- **Business Validation:** Stakeholder approval + ROI verification
- **Academic Validation:** Methodology rigor + contribution assessment  
- **User Validation:** Acceptance testing + satisfaction measurement

---

## 🎯 **DSR SUCCESS CRITERIA**

### **Academic Excellence Criteria**
✅ **Methodology Rigor:**
- All 6 DSR activities completed systematically  
- Proper literature review + theoretical grounding
- Rigorous evaluation dengan multiple methods
- Clear contributions to knowledge + practice

### **Technical Achievement Criteria**  
✅ **System Quality:**
- All functional requirements implemented
- Performance targets achieved consistently
- Security standards met comprehensively
- Integration successful dengan all APIs

### **Business Impact Criteria**
✅ **Practical Value:**
- Efficiency improvement ≥80% (target 87.5%)
- User satisfaction ≥4.0/5.0 (TAM assessment)
- System adoption ≥90% (active usage rate)
- Positive ROI achieved within evaluation period

---

## 📊 **RISK MITIGATION DALAM DSR**

### **Technical Risks & Mitigation**
⚠️ **API Integration Failures:**
- **Risk:** Third-party services unreliable
- **Mitigation:** Retry mechanisms + fallback strategies + error handling

⚠️ **Performance Degradation:**  
- **Risk:** System slow dengan 222+ assets
- **Mitigation:** Database optimization + caching + load testing

⚠️ **Security Vulnerabilities:**
- **Risk:** Credential exposure atau unauthorized access  
- **Mitigation:** Encryption + audit trails + security testing

### **Business Risks & Mitigation**
⚠️ **User Resistance:**
- **Risk:** IT team tidak adopt new system
- **Mitigation:** User involvement + training + gradual transition

⚠️ **Scope Creep:**
- **Risk:** Requirements expand beyond timeline
- **Mitigation:** Clear scope definition + change control process

### **Academic Risks & Mitigation**
⚠️ **Methodology Validity:**
- **Risk:** DSR implementation not rigorous
- **Mitigation:** Advisor guidance + literature adherence + peer review

⚠️ **Evaluation Insufficient:**
- **Risk:** Assessment not comprehensive enough
- **Mitigation:** Multi-method evaluation + stakeholder validation

---

## ✅ **DSR METHODOLOGY CONCLUSION**

### **Why DSR is Optimal untuk ITM SCI**
🎯 **Perfect Fit Reasons:**
- **Real Problem:** PT Syntax genuine business challenge  
- **Practical Solution:** Working system sebagai artifact
- **Measurable Impact:** Clear success metrics defined
- **Knowledge Creation:** Academic + industry contributions
- **Stakeholder Value:** Immediate business benefits

### **Expected DSR Outcomes**
🏆 **Multi-level Success:**
- **Artifact:** High-quality ITM SCI monitoring system
- **Knowledge:** DSR framework untuk monitoring systems
- **Impact:** 87.5% efficiency improvement for PT Syntax
- **Learning:** Valuable experience untuk future projects

### **DSR Framework Summary**
📋 **18-Week DSR Implementation:**
- **Week 1-2:** Problem identification + stakeholder analysis
- **Week 3-4:** Objectives definition + requirements gathering  
- **Week 5-14:** Design + development dengan iterations
- **Week 15:** Demonstration + stakeholder validation
- **Week 16-17:** Comprehensive evaluation (quantitative + qualitative)
- **Week 18:** Communication + knowledge transfer

*Design Science Research Methodology - ITM SCI*  
*Peffers Framework Implementation*  
*[Tanggal] | [Nama Mahasiswa] | [Program Studi]*