# RANCANGAN METODE DESIGN SCIENCE RESEARCH (DSR)
## Syntax Comprehensive Interface (ITM SCI)

---

## PENDAHULUAN

Penelitian ini menggunakan **Design Science Research (DSR)** methodology berdasarkan framework Peffers et al. (2007) yang terdiri dari **6 aktivitas** utama. DSR dipilih karena sesuai untuk penelitian yang bertujuan menghasilkan artefak (sistem) sebagai solusi atas masalah praktis.

### Karakteristik DSR dalam Penelitian Ini:
- **Problem-driven:** Berangkat dari masalah nyata di PT Syntax
- **Artifact-centric:** Menghasilkan sistem monitoring terpadu sebagai artefak
- **Evaluation-based:** Artefak dievaluasi secara rigorous
- **Iterative:** Development cycle dengan continuous improvement
- **Practical relevance:** Solusi applicable di dunia nyata

---

## DSR FRAMEWORK: 6 AKTIVITAS

```
┌──────────────────────────────────────────────────────────────────┐
│           Design Science Research - 6 Activities                  │
│                    (Peffers et al., 2007)                         │
└──────────────────────────────────────────────────────────────────┘

   1️⃣ Problem Identification & Motivation
         │
         ▼
   2️⃣ Define Objectives of Solution
         │
         ▼
   3️⃣ Design & Development (ARTEFACT)
         │
         ▼
   4️⃣ Demonstration
         │
         ▼
   5️⃣ Evaluation
         │
         ▼
   6️⃣ Communication
```

---

## AKTIVITAS 1: PROBLEM IDENTIFICATION & MOTIVATION

### 1.1 Tujuan Aktivitas
Mengidentifikasi dan mendefinisikan masalah penelitian secara spesifik, serta memotivasi pentingnya solusi yang dikembangkan.

### 1.2 Metode Pengumpulan Data

#### A. Interview dengan Stakeholders
**Target:** IT Team Lead, IT Staff (2-3 orang), Management Representative  
**Format:** Semi-structured interview  
**Durasi:** 45-60 menit per stakeholder  
**Topics:**
- Current monitoring process (step-by-step)
- Pain points dan challenges sehari-hari
- Time spent untuk monitoring activities
- Issues yang sering terjadi (domain expiry, downtime, dll)
- Expectations terhadap sistem baru

**Output:** Interview transcripts, pain points list, requirements wishlist

#### B. Observasi Proses Existing
**Metode:** Shadowing IT team selama monitoring activities  
**Durasi:** 2-3 hari full observation  
**Focus areas:**
- How they check website status
- Tools yang digunakan saat ini
- Where credentials stored
- How they handle incidents
- Documentation practices

**Output:** Process flowchart, time & motion study data

#### C. Document Analysis
**Dokumen yang dianalisis:**
- Existing spreadsheet/database website
- Domain renewal records
- Incident logs (jika ada)
- Email correspondence tentang issues
- Current SOP (jika ada)

**Output:** Current state documentation, data structure understanding


### 1.3 Analisis Masalah

**Framework:** Problem Analysis using 5W1H  
- **What:** 222 website monitoring manual, tidak efisien
- **Why:** Tidak ada sistem terpadu, informasi fragmented
- **Who:** IT team yang terdampak, management lack visibility
- **When:** Daily operations, terutama saat ada incidents
- **Where:** PT Syntax Transformation Indonesia
- **How:** Manual checking, spreadsheet-based tracking

**Root Cause Analysis:**
Menggunakan teknik Fishbone Diagram untuk identify root causes:
- People: Limited IT staff, skill limitations
- Process: No standardized monitoring process
- Technology: No integrated system, manual tools
- Environment: Multi-website complexity, shared hosting constraints

### 1.4 Output Aktivitas 1

| Deliverable | Description | Status |
|-------------|-------------|---------|
| Problem Statement Document | Comprehensive problem definition | ✅ (Rumusan Masalah Penelitian) |
| Stakeholder Analysis | Map of stakeholders & their needs | ✅ |
| Current Process Documentation | As-is process flowchart | ✅ |
| Pain Points & Impact Analysis | Quantified impact of problems | ✅ |
| Motivation & Justification | Why this research is important | ✅ |

### 1.5 Timeline Aktivitas 1
**Durasi:** Minggu 1-2  
- Minggu 1: Interviews & observations
- Minggu 2: Document analysis & problem formulation

---

## AKTIVITAS 2: DEFINE OBJECTIVES OF SOLUTION

### 2.1 Tujuan Aktivitas
Menentukan objectives yang harus dipenuhi oleh artefak (sistem) berdasarkan masalah yang teridentifikasi.

### 2.2 Metode Perumusan Objectives

#### A. Objectives Workshop dengan Stakeholders
**Format:** Facilitated workshop  
**Participants:** IT team, management, domain administrator  
**Duration:** 3-4 jam  
**Activities:**
1. Present problem findings (dari Aktivitas 1)
2. Brainstorming solutions
3. Prioritize features (MoSCoW method)
4. Define success criteria

**Output:** Prioritized objectives, success metrics definition

#### B. Literature Review
**Topics:**
- Digital asset management systems
- Enterprise monitoring solutions
- Web application architecture best practices
- Security patterns untuk credential management
- Laravel + React integration patterns

**Sources:**
- Academic journals (IEEE, ACM, ScienceDirect)
- Industry reports (Gartner, Forrester)
- Technical documentation
- Case studies

**Output:** State-of-the-art understanding, technology options

#### C. Technology Feasibility Study
**Evaluation criteria:**
- Technical capabilities vs requirements
- Development time & complexity
- Performance expectations
- Security features
- Cost (licensing, hosting, third-party APIs)
- Learning curve

**Technologies considered:**
- ✅ Laravel 11 + React (selected)
- Alternatives: Node.js, Django, etc.

**Output:** Technology stack justification


### 2.3 Solution Objectives

#### Functional Objectives:
1. **Centralized Website Repository:** System harus dapat store dan display 222 website data
2. **Domain Expiry Monitoring:** Automated checking dan alerts 30/14/7 hari before expiry
3. **Secure Credential Management:** Encrypted storage untuk OJS credentials dengan audit trail
4. **Performance Monitoring:** PageSpeed tracking (mobile + desktop) dengan historical data
5. **Uptime Monitoring:** Availability checking dengan downtime alerting
6. **Notification System:** Real-time alerts untuk critical events
7. **Comprehensive Dashboard:** Overview metrics, charts, filtering
8. **Role-Based Access:** Authentication dengan 3 roles (Super Admin, Viewer, PageSpeed)

#### Non-Functional Objectives:
1. **Performance:** Dashboard load < 3s, API response < 2s
2. **Security:** Encrypted credentials, secure sessions, audit trail
3. **Usability:** Intuitive UI, responsive design, easy navigation
4. **Reliability:** 99.5% uptime, graceful error handling
5. **Scalability:** Support 222 → 500+ websites

### 2.4 Requirements Specification

**Business Requirements Document (BRD):** ✅ (Created)

**Functional Requirements (High-Level):**
- FR-1 to FR-8 (Detail in BRD)

**Non-Functional Requirements:**
- NFR-1 to NFR-5 (Detail in BRD)

### 2.5 Output Aktivitas 2

| Deliverable | Description | Status |
|-------------|-------------|---------|
| Objectives Document | Functional & non-functional objectives | ✅ |
| BRD (1-2 pages) | Business requirements summary | ✅ |
| Success Criteria & KPIs | Measurable targets | ✅ |
| Technology Stack Decision | Justified technology choices | ✅ |
| Feature Prioritization | MoSCoW classification | ✅ |

### 2.6 Timeline Aktivitas 2
**Durasi:** Minggu 3-4  
- Minggu 3: Workshop, literature review
- Minggu 4: Technology evaluation, BRD finalization

---

## AKTIVITAS 3: DESIGN & DEVELOPMENT (ARTEFACT)

### 3.1 Tujuan Aktivitas
Merancang dan mengembangkan artefak (sistem ITM SCI) yang memenuhi objectives yang telah didefinisikan.

### 3.2 Design Phase

#### A. System Architecture Design
**Metode:** Layered Architecture Approach  
**Deliverables:**
- System architecture diagram
- Component diagram
- Deployment diagram
- Technology stack documentation

**Architecture:**
```
┌─────────────────────────────────────────────┐
│         FRONTEND (React + TypeScript)        │
│  - UI Components (shadcn/ui, TailwindCSS)   │
│  - State Management (React Hooks)           │
│  - API Client (Axios)                       │
│  - Routing (React Router)                   │
└──────────────────┬──────────────────────────┘
                   │ HTTPS/REST API
┌──────────────────▼──────────────────────────┐
│          BACKEND (Laravel 11)                │
│  - Controllers (Business Logic)              │
│  - Models (Eloquent ORM)                     │
│  - Middleware (Auth, CORS)                   │
│  - Jobs & Queues                            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│            DATABASE (MySQL)                  │
│  - Websites, OJS Instances                   │
│  - Domain Info, PageSpeed Data              │
│  - Notifications, Tickets                    │
│  - Users & Sessions                         │
└──────────────────┬──────────────────────────┘
                   │
          ┌────────┴────────┐
          │                 │
    ┌─────▼──────┐    ┌────▼────────┐
    │ PagePilot  │    │   WHOIS     │
    │    API     │    │  Services   │
    └────────────┘    └─────────────┘
```


#### B. Database Design
**Metode:** Entity-Relationship Modeling  
**Deliverables:** ERD, Data Dictionary, Migration files

**Core Tables:**
- `users` - Authentication
- `websites` - Website repository
- `ojs_instances` - OJS data
- `ojs_secure_sessions` - Secure credential access
- `uptime_checks` - Uptime history
- `uptime_incidents` - Downtime records
- `page_speeds` - PageSpeed data
- `page_speed_history` - Historical tracking
- `notifications` - Alert system
- `tickets` - Issue tracking
- `sop_webs` - SOP documents

#### C. API Design
**Standard:** RESTful API  
**Authentication:** Laravel Sanctum (token-based)  
**Deliverables:** API specification document

**Core Endpoints:**
- `POST /api/login` - Authentication
- `GET /api/websites` - List all websites
- `GET /api/ojs-instances` - List OJS
- `POST /api/ojs-secure/authenticate` - OJS Secure login
- `GET /api/domains` - Domain monitoring data
- `POST /api/page-speed/check/{id}` - Trigger PageSpeed check
- `GET /api/uptime/all-status` - Uptime overview
- `GET /api/notifications` - User notifications

#### D. UI/UX Design
**Tool:** Figma (wireframes & mockups)  
**Design System:** shadcn/ui + TailwindCSS  
**Deliverables:**
- Wireframes (low-fidelity)
- Mockups (high-fidelity)
- Style guide
- Component library

**Key Screens:**
- Login page
- Dashboard overview
- Website list & detail
- OJS Secure (credential management)
- Domain Monitor (with tabs)
- PageSpeed Dashboard
- Notification panel


### 3.3 Development Phase

#### Development Methodology: Agile (Scrum-inspired)
- **Sprint duration:** 2 minggu
- **Sprint planning:** Define sprint goals & tasks
- **Daily standup:** (Self) progress tracking
- **Sprint review:** Demo to stakeholders
- **Sprint retrospective:** Continuous improvement

#### Sprint Breakdown:

**Sprint 1-2 (Minggu 5-8): Core Infrastructure**
- Setup project (Laravel + React)
- Database schema & migrations
- Authentication system (Sanctum)
- Base UI components
- Website CRUD
- OJS Instance CRUD

**Sprint 3-4 (Minggu 9-12): Advanced Features**
- OJS Secure module (dual auth)
- Domain monitoring integration
- PageSpeed integration (PagePilot API)
- Uptime monitoring
- Notification system
- SOP Management
- Ticketing system

**Sprint 5 (Minggu 13-14): Refinement & Testing**
- UI/UX improvements
- Performance optimization
- Bug fixing
- Security hardening
- Documentation

#### Development Tools & Practices:
- **Version Control:** Git + GitHub
- **Code Quality:** ESLint, PHP CS Fixer
- **Testing:** PHPUnit (unit), React Testing Library
- **CI/CD:** Basic automated deployment
- **Documentation:** Code comments, README, API docs

### 3.4 The ARTEFACT: ITM SCI System

**Artefact Type:** Construct + Model + Method + Instantiation

1. **Construct:** Conceptual framework for integrated monitoring
2. **Model:** System architecture & design patterns
3. **Method:** Development methodology & best practices
4. **Instantiation:** Working prototype/product (ITM SCI application)


#### Key Features of Artefact:

**Module 1: Website Management**
- CRUD operations untuk 222 websites
- Server & CDN tracking
- Ads status monitoring
- Holding company categorization
- Search & filter capabilities

**Module 2: OJS Management**  
- CRUD operations untuk 132 OJS instances
- Version tracking
- Server location management
- **OJS Secure:** Credential management dengan dual authentication & encryption

**Module 3: Domain Monitoring**
- WHOIS integration untuk domain expiry checking
- Days until expiry calculation
- Automated alerts (30/14/7 days before)
- Domain registrar tracking
- Support website & OJS domains
- Main domain filtering (exclude subdomain)

**Module 4: PageSpeed Monitoring**
- Integration dengan PagePilot API
- Mobile & desktop testing
- Historical data tracking
- Trend analysis
- Performance scoring
- Breakdown by holding

**Module 5: Uptime Monitoring**
- Availability checking (every 5 min)
- Response time tracking
- Downtime incident recording
- Uptime percentage calculation
- Real-time alerts

**Module 6: Notification System**
- In-app notifications
- Real-time updates
- Event types: domain expiry, downtime, PageSpeed degradation
- Mark as read functionality
- Notification history

**Module 7: Ticketing System**
- Issue reporting
- Status tracking (open/in progress/resolved)
- Priority management
- Assignment capabilities
- Statistics dashboard

**Module 8: SOP Management**
- Document storage
- Version control
- Access management

**Module 9: Dashboard & Reporting**
- Statistics cards (total websites, OJS, uptime %, etc.)
- Charts & visualizations
- Recent activity feed
- Quick actions
- Comprehensive filtering

### 3.5 Output Aktivitas 3

| Deliverable | Description | Status |
|-------------|-------------|---------|
| System Architecture Document | Complete architecture design | ✅ |
| Database Schema | ERD + migrations | ✅ |
| API Documentation | All endpoints documented | ✅ |
| UI/UX Design | Wireframes + mockups | ✅ |
| Source Code (Backend) | Laravel application | ✅ |
| Source Code (Frontend) | React application | ✅ |
| Test Cases | Unit + integration tests | ✅ |
| Technical Documentation | Architecture, setup, deployment | ✅ |

### 3.6 Timeline Aktivitas 3
**Durasi:** Minggu 5-14 (10 minggu development)

---

## AKTIVITAS 4: DEMONSTRATION

### 4.1 Tujuan Aktivitas
Mendemonstrasikan bahwa artefak dapat menyelesaikan masalah yang telah diidentifikasi.

### 4.2 Metode Demonstrasi

#### A. Internal Testing (Alpha Testing)
**Participants:** Developer (self-testing)  
**Scope:** All modules dan features  
**Method:** 
- Functionality testing
- Integration testing
- Edge case testing
- Error handling verification

**Test Scenarios:**
1. Login dengan berbagai roles
2. Add/edit/delete website data
3. OJS Secure authentication flow
4. Domain monitoring dengan various expiry dates
5. PageSpeed check untuk sample websites
6. Uptime monitoring simulation
7. Notification triggering
8. Dashboard data accuracy
9. Performance under load
10. Security penetration testing (basic)

#### B. Stakeholder Demo Sessions
**Participants:** IT Team, Management  
**Format:** Live demonstration + Q&A  
**Frequency:** Bi-weekly (setiap sprint review)  
**Duration:** 60-90 menit per session

**Demo Agenda:**
1. Show new features developed in sprint
2. Walk through user scenarios
3. Demonstrate problem-solving capabilities
4. Gather feedback
5. Discuss next priorities

**Documentation:** Demo slides, feedback notes, action items

#### C. Pilot Deployment
**Scope:** Production environment dengan real data  
**Users:** Selected IT team members (2-3 orang)  
**Duration:** 2 minggu  
**Objectives:**
- Verify system works dengan production data
- Identify any deployment issues
- Observe actual usage patterns
- Collect initial performance metrics

**Monitoring:**
- System uptime
- Response times
- Error logs
- User activity logs

### 4.3 Use Case Demonstrations

**Use Case 1: Daily Monitoring Routine**
- User login → View dashboard
- Check uptime status (all green?)
- Review notifications (any alerts?)
- Check PageSpeed trends
- Verify domain expiry dates
**Expected Outcome:** Complete daily check in < 5 minutes

**Use Case 2: Domain Expiry Alert Response**
- System detects domain expiring in 30 days
- Notification sent to user
- User views domain details
- User notes renewal action
- User marks notification as handled
**Expected Outcome:** Proactive domain renewal, zero miss

**Use Case 3: Website Downtime Response**
- System detects website down
- Immediate notification sent
- User investigates via dashboard
- User creates ticket for team
- User monitors resolution
**Expected Outcome:** Detection < 5 minutes, fast response

**Use Case 4: PageSpeed Analysis**
- User checks PageSpeed dashboard
- Identifies slow websites (score < 50)
- Views historical trends
- Exports data for report
- Plans optimization actions
**Expected Outcome:** Data-driven optimization decisions

**Use Case 5: Secure OJS Credential Access**
- User navigates to OJS Secure
- Authenticates with OJS credentials
- Views all OJS login data
- Copies credentials for use
- Edits expired credentials
- System logs access for audit
**Expected Outcome:** Secure yet convenient access

### 4.4 Output Aktivitas 4

| Deliverable | Description | Status |
|-------------|-------------|---------|
| Test Results Documentation | All test cases + results | ✅ |
| Demo Presentation Slides | For stakeholder demos | ✅ |
| Pilot Deployment Report | Findings from pilot period | Pending |
| Use Case Walkthroughs | Documentation + screenshots | ✅ |
| Feedback Collection | Stakeholder input | Pending |

### 4.5 Timeline Aktivitas 4
**Durasi:** Minggu 13-15  
- Minggu 13-14: Internal testing + demos
- Minggu 15: Pilot deployment

---

## AKTIVITAS 5: EVALUATION

### 5.1 Tujuan Aktivitas
Mengevaluasi seberapa baik artefak mencapai objectives dan menyelesaikan masalah.

### 5.2 Evaluation Framework

#### Framework: Multi-Method Evaluation
- **Quantitative:** Performance metrics, usage statistics
- **Qualitative:** User satisfaction, expert review
- **Observational:** Actual usage patterns
- **Analytical:** Security audit, code quality

### 5.3 Quantitative Evaluation

#### A. Performance Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Dashboard Load Time | < 3 detik | Browser DevTools, Lighthouse |
| API Response Time | < 2 detik (90% requests) | Laravel Telescope, logs |
| Database Query Time | < 500ms | Query profiling |
| System Uptime | > 99.5% | Uptime monitoring tool |
| Concurrent Users Support | 50 users | Load testing (Apache JMeter) |

**Tools:** 
- Google Lighthouse (frontend performance)
- Laravel Telescope (backend monitoring)
- MySQL slow query log
- Apache JMeter (load testing)

#### B. Efficiency Metrics

| Metric | Before | Target After | Actual After | % Improvement |
|--------|--------|--------------|--------------|---------------|
| Monitoring Time/Day | 240 min | 30 min | _[Measured]_ | _[Calculated]_ |
| Websites Monitored/Hour | ~55 | ~450 | _[Measured]_ | _[Calculated]_ |
| Domain Expiry Incidents | 2-3/year | 0/year | _[Tracked]_ | _[Calculated]_ |
| Downtime Detection Time | 2-4 jam | < 5 min | _[Measured]_ | _[Calculated]_ |

**Measurement Period:** 3 bulan post-deployment

#### C. Security & Quality Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Credential Encryption | 100% | Code audit, database inspection |
| Audit Trail Coverage | 100% sensitive operations | Log analysis |
| Authentication Success Rate | > 99% | Auth log analysis |
| Unauthorized Access Attempts | 0 successful | Security log monitoring |
| Code Quality Score | > 8.0/10 | SonarQube/CodeClimate |
| Test Coverage | > 80% | PHPUnit coverage report |

### 5.4 Qualitative Evaluation

#### A. User Satisfaction Survey
**Target:** Semua users (IT team, management)  
**Method:** Online questionnaire (Google Forms)  
**Scale:** 5-point Likert scale  
**Dimensions:**
- **Perceived Usefulness** (PU)
- **Perceived Ease of Use** (PEOU) 
- **Intention to Use** (ITU)
- **System Quality**
- **Information Quality**
- **Service Quality**

**Sample Questions:**
- "Sistem ini membantu saya menyelesaikan tugas lebih cepat" (PU)
- "Interface sistem mudah dipahami dan digunakan" (PEOU)
- "Saya berencana terus menggunakan sistem ini" (ITU)
- "Data yang ditampilkan akurat dan up-to-date" (Information Quality)

**Target:** Average score > 4.0/5.0

#### B. Expert Evaluation
**Evaluator:** Dosen pembimbing + IT expert external  
**Method:** Heuristic evaluation + cognitive walkthrough  
**Focus areas:**
- System architecture soundness
- Security implementation
- Code quality & best practices
- UI/UX design principles
- Scalability considerations

**Deliverable:** Expert evaluation report dengan recommendations

### 5.5 Observational Evaluation

#### A. Usage Analytics
**Tools:** Laravel application logs, Google Analytics (jika applicable)  
**Metrics:**
- Daily/weekly active users
- Feature usage frequency
- User session duration
- Most accessed modules
- Error rates per feature

**Analysis period:** 4 minggu post-deployment

#### B. Task Performance Measurement
**Method:** Time and motion study (before vs after)  
**Tasks:**
1. Check all website status → Target: < 5 menit
2. Find domain expiry info → Target: < 2 menit  
3. Access OJS credentials → Target: < 3 menit
4. Generate uptime report → Target: < 5 menit
5. Respond to downtime alert → Target: < 3 menit

**Participants:** IT team members (3 orang)

### 5.6 Evaluation Timeline & Methods

| Week | Evaluation Activity | Method | Participants |
|------|-------------------|--------|--------------|
| 16 | Performance testing | Automated tools | Developer |
| 16 | Security audit | Code review + testing | Developer + Expert |
| 17 | User satisfaction survey | Online questionnaire | All users |
| 17 | Expert evaluation | Heuristic evaluation | External expert |
| 18 | Usage analytics | Log analysis | Developer |
| 18 | Task performance | Time & motion study | IT team |

### 5.7 Success Criteria Validation

**Primary Success Criteria:**

✅ **Efficiency Improvement:** Target 87.5% time reduction  
📊 Measurement: Time tracking before/after implementation

✅ **Risk Reduction:** Target zero domain loss, < 5 min downtime detection  
📊 Measurement: Incident tracking, alert response time

✅ **User Satisfaction:** Target > 80% satisfaction rate  
📊 Measurement: Survey results, adoption rate

✅ **System Performance:** Target < 3s dashboard load, < 2s API response  
📊 Measurement: Performance monitoring tools

### 5.8 Output Aktivitas 5

| Deliverable | Description | Status |
|-------------|-------------|---------|
| Performance Test Report | Load testing + response time analysis | Pending |
| Security Audit Report | Vulnerability assessment + compliance | Pending |
| User Satisfaction Survey Report | Survey results + analysis | Pending |
| Expert Evaluation Report | External expert assessment | Pending |
| Usage Analytics Report | User behavior + feature adoption | Pending |
| Task Performance Analysis | Before/after efficiency comparison | Pending |
| Evaluation Summary | Consolidated findings + recommendations | Pending |

---
## AKTIVITAS 6: COMMUNICATION

### 6.1 Tujuan Aktivitas
Mengkomunikasikan hasil penelitian kepada academic community dan praktisi.

### 6.2 Target Audience & Communication Channels

#### A. Academic Community
**Target:** Dosen, mahasiswa SI/TI, peneliti DSR  
**Channels:**
- **Skripsi/Thesis document** (primary deliverable)
- **Jurnal publikasi** (optional, future work)
- **Conference presentation** (if opportunity available)
- **Seminar internal** (departemen/fakultas)

#### B. Industry Practitioners  
**Target:** IT professionals, system developers, management Syntax  
**Channels:**
- **Technical documentation** (GitHub repository)
- **Case study presentation** (internal Syntax)
- **Blog post/article** (Medium, LinkedIn)
- **Open source release** (modified version)

#### C. Academic Institution
**Target:** Universitas, dosen pembimbing  
**Channels:**
- **Final presentation** (sidang skripsi)
- **Progress reports** (weekly/monthly)
- **Research poster** (if applicable)

### 6.3 Communication Deliverables

#### A. Academic Publications

**1. Skripsi Document (Primary)**
- **Structure:** Standard academic format
- **Length:** 80-120 halaman
- **Language:** Bahasa Indonesia
- **Content:**
  - BAB I: Pendahuluan (latar belakang, rumusan masalah, tujuan)
  - BAB II: Tinjauan Pustaka (literature review, DSR theory)
  - BAB III: Metodologi (DSR 6 activities)
  - BAB IV: Analisis & Perancangan (requirements, design)
  - BAB V: Implementasi (development, artefak)
  - BAB VI: Pengujian & Evaluasi (testing, evaluation results)
  - BAB VII: Penutup (kesimpulan, saran)

**2. Research Paper (Future Work)**
- **Target:** Jurnal nasional/internasional
- **Focus:** DSR application dalam enterprise monitoring
- **Title:** "Design and Development of Integrated Digital Asset Monitoring System using Design Science Research Approach"

#### B. Technical Documentation

**1. System Documentation**
- **Architecture guide:** System design & components
- **Developer guide:** Setup, configuration, customization
- **User manual:** End-user instructions
- **API documentation:** Complete endpoint reference
- **Deployment guide:** Production setup instructions

**2. GitHub Repository**
- **README.md:** Project overview, setup instructions
- **CONTRIBUTING.md:** Guidelines untuk contributors
- **CHANGELOG.md:** Version history
- **LICENSE:** Open source license (if applicable)
- **Code documentation:** Inline comments, docblocks

#### C. Presentation Materials

**1. Final Defense Presentation**
- **Duration:** 20-30 menit + Q&A
- **Audience:** Dosen penguji, mahasiswa
- **Content:**
  - Problem identification & motivation
  - Research questions & objectives
  - DSR methodology implementation
  - Artefak demonstration
  - Evaluation results
  - Contributions & future work

**2. Stakeholder Presentation**
- **Duration:** 45 menit
- **Audience:** Management Syntax, IT team
- **Content:**
  - Business problem & solution
  - System demonstration
  - Benefits achieved
  - ROI analysis
  - Recommendations & future enhancements

### 6.4 Key Messages & Contributions

#### For Academic Audience:
**Key Messages:**
- DSR methodology dapat diterapkan secara efektif untuk enterprise monitoring systems
- Integration challenges dalam multi-module web applications dapat diatasi dengan layered architecture
- Security implementation untuk credential management memerlukan balance antara usability dan protection

**Theoretical Contributions:**
- Framework untuk DSR application dalam digital asset management domain
- Guidelines untuk integrated monitoring system development
- Best practices untuk dual authentication implementation

#### For Industry Practitioners:
**Key Messages:**
- Manual monitoring processes dapat digantikan dengan automated systems untuk significant efficiency gains
- Proactive monitoring approach lebih efektif dari reactive approach
- Security dan usability tidak mutually exclusive dalam credential management

**Practical Contributions:**
- Working system yang dapat diadaptasi untuk similar organizations
- Technology stack recommendations (Laravel + React)
- Implementation patterns untuk common monitoring features

### 6.5 Communication Timeline

| Week | Activity | Deliverable | Audience |
|------|----------|-------------|----------|
| 17-18 | Documentation writing | Technical docs, user manual | Developers, users |
| 18 | Skripsi writing start | Draft chapters | Academic |
| 19-20 | Stakeholder presentation | Business results presentation | Syntax management |
| 21-22 | Skripsi completion | Final thesis document | Academic committee |
| 23 | Final defense preparation | Defense presentation | Examiners |
| 24 | Final defense | Oral presentation + Q&A | Academic committee |

### 6.6 Success Metrics for Communication

**Academic Success:**
- Skripsi approved by committee
- Thesis defense passed
- Academic contributions acknowledged

**Industry Success:**
- System adopted by Syntax (100% user adoption)
- Stakeholders satisfied with solution
- Potential for replication in other organizations

**Knowledge Transfer Success:**
- Technical documentation useful for future developers
- Methodology replicable by other researchers
- Open source community interest (if released)

### 6.7 Output Aktivitas 6

| Deliverable | Description | Status |
|-------------|-------------|---------|
| Skripsi Document | Complete thesis (80-120 pages) | Pending |
| Technical Documentation | System docs, user guide, API docs | Pending |
| Defense Presentation | Final presentation slides | Pending |
| Stakeholder Report | Business impact & ROI analysis | Pending |
| GitHub Repository | Open source code + documentation | Pending |
| Research Poster | Visual summary (if required) | Optional |

---

## RENCANA ARTEFAK YANG DIKEMBANGKAN

### Artefak Utama: ITM SCI System

**Type:** Instantiation (Working System)  
**Components:**

1. **Backend Application (Laravel 11)**
   - REST API dengan 50+ endpoints
   - Database dengan 15+ tables
   - Authentication & authorization system
   - Background jobs untuk monitoring tasks
   - Integration dengan third-party APIs

2. **Frontend Application (React + TypeScript)**
   - Responsive web interface
   - 20+ pages/screens
   - Real-time notifications
   - Interactive dashboard & charts
   - Component-based architecture

3. **Database Schema**
   - Normalized database design
   - Migration files untuk reproducibility
   - Seed data untuk testing
   - Indexing untuk performance

### Artefak Pendukung:

4. **System Architecture Model**
   - Layered architecture diagram
   - Component interaction model
   - Deployment architecture
   - Security model

5. **Development Framework**
   - DSR-based development methodology
   - Best practices documentation
   - Template untuk similar projects
   - Evaluation framework

6. **Documentation Suite**
   - Technical documentation
   - User manuals
   - API reference
   - Development guide

### Innovation Aspects:

**Technical Innovation:**
- Dual authentication pattern untuk secure modules
- Integrated monitoring approach (multi-domain dalam single platform)
- Efficient WHOIS integration dengan retry mechanisms
- Real-time notification system

**Methodological Innovation:**
- DSR application dalam enterprise monitoring context
- Systematic evaluation framework untuk monitoring systems
- Stakeholder-driven requirements gathering approach

**Business Innovation:**
- 87.5% efficiency improvement dalam monitoring processes
- Zero-loss domain management approach
- Proactive vs reactive monitoring paradigm shift

---

## KESIMPULAN METODOLOGI DSR

### Kesesuaian DSR dengan Penelitian

**Why DSR is Appropriate:**
1. **Problem-oriented:** Berangkat dari real business problem di PT Syntax
2. **Artifact-centric:** Menghasilkan working system sebagai solution
3. **Evaluation-focused:** Rigorous evaluation dengan multiple methods
4. **Iterative:** Continuous improvement berdasarkan feedback
5. **Practical relevance:** Solution applicable di dunia nyata

### Expected Contributions

**Untuk Science:**
- Demonstrasi DSR application dalam digital asset management
- Framework untuk integrated monitoring systems
- Guidelines untuk enterprise web application development

**Untuk Practice:**
- Working solution untuk PT Syntax (direct impact)
- Template untuk organizations dengan similar challenges
- Best practices untuk monitoring system implementation

### Rigor & Relevance Balance

**Rigor (Academic Quality):**
- Systematic methodology (DSR 6 activities)
- Comprehensive evaluation (quantitative + qualitative)
- Theoretical foundation (literature review)
- Reproducible research process

**Relevance (Practical Value):**
- Solves real business problem
- Measurable impact (87.5% efficiency gain)
- Adoptable by other organizations
- Industry-standard technology stack

---

*Rancangan Metode Design Science Research (DSR)*  
*Syntax Comprehensive Interface (ITM SCI)*  
*Versi 1.0*