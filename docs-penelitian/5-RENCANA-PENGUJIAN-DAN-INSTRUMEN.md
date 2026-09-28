# RENCANA PENGUJIAN & INSTRUMEN
## Syntax Comprehensive Interface (ITM SCI)

---

## 1. OVERVIEW PENGUJIAN

### 1.1 Tujuan Pengujian
Memastikan sistem ITM SCI memenuhi semua requirements (fungsional dan non-fungsional) serta memberikan bukti empiris bahwa artefak berhasil menyelesaikan masalah yang diidentifikasi.

### 1.2 Scope Pengujian
- **Functional Testing:** Semua fitur bekerja sesuai requirements
- **Performance Testing:** Response time, throughput, scalability
- **Security Testing:** Authentication, authorization, data protection
- **Usability Testing:** User experience dan ease of use
- **Integration Testing:** Third-party API integration
- **User Acceptance Testing:** Stakeholder validation

### 1.3 Testing Strategy
**Approach:** Multi-level testing (Unit → Integration → System → Acceptance)  
**Methods:** Manual testing + Automated testing  
**Timeline:** Parallel dengan development + dedicated testing phase

---

## 2. METRIK TEKNIS (TECHNICAL METRICS)

### 2.1 Performance Metrics

#### A. Response Time Testing
**Objective:** Memastikan sistem responsive dan fast loading

| Test Case | Target | Measurement Method | Tools |
|-----------|--------|-------------------|-------|
| Dashboard load time | < 3 detik | Browser DevTools Network tab | Chrome DevTools, Lighthouse |
| API response time | < 2 detik (90% requests) | Server-side logging | Laravel Telescope, Postman |
| Database query time | < 500ms per query | Query profiling | MySQL slow query log |
| Page transition time | < 1 detik | Frontend performance | React DevTools Profiler |

**Test Procedure:**
1. Clear browser cache
2. Load dashboard dengan fresh session
3. Measure time to interactive (TTI)
4. Record Largest Contentful Paint (LCP)
5. Repeat 10x dan calculate average

#### B. Throughput & Scalability Testing
**Objective:** Memastikan sistem dapat handle concurrent users

| Metric | Target | Test Method |
|--------|--------|-------------|
| Concurrent users | 50 users | Load testing dengan Apache JMeter |
| API requests/minute | 500 requests | Stress testing |
| Database connections | Max 20 concurrent | Connection pool monitoring |
| Memory usage | < 512MB | Server resource monitoring |

**Load Testing Scenarios:**
- **Normal Load:** 10 concurrent users, 5 menit
- **Peak Load:** 25 concurrent users, 10 menit  
- **Stress Load:** 50 concurrent users, 15 menit
- **Spike Load:** 0 → 30 → 0 users dalam 2 menit
### 2.2 Security Metrics

#### A. Authentication & Authorization Testing
**Objective:** Memastikan access control berjalan dengan benar

| Test Case | Expected Result | Method |
|-----------|----------------|--------|
| Login dengan invalid credentials | Access denied | Manual testing |
| Access protected route tanpa auth | Redirect to login | Automated testing |
| Role-based access control | Users hanya akses allowed features | Role testing matrix |
| Session timeout | Auto logout setelah 120 menit | Timer testing |
| Password encryption | Credentials encrypted di database | Database inspection |

#### B. Data Security Testing
**Objective:** Memastikan sensitive data protected

| Security Aspect | Test Method | Target |
|-----------------|-------------|--------|
| HTTPS enforcement | Check all communications | 100% HTTPS |
| Credential encryption | Database audit | AES-256 encryption |
| SQL injection prevention | OWASP testing | Zero vulnerabilities |
| XSS protection | Input validation testing | All inputs sanitized |
| CSRF protection | Token validation | All forms protected |

**Security Test Cases:**
1. **Authentication Bypass Attempts**
   - Direct URL access tanpa login
   - Token manipulation
   - Session hijacking simulation

2. **Input Validation**
   - SQL injection attempts di form fields
   - XSS payload injection
   - File upload restrictions (jika ada)

3. **Data Encryption**
   - Verify OJS credentials encrypted di database
   - Check sensitive data di network traffic
   - API token security

### 2.3 Reliability & Error Handling Metrics

#### A. System Reliability
**Objective:** Memastikan sistem stable dan fault-tolerant

| Metric | Target | Measurement |
|--------|--------|-------------|
| System uptime | > 99.5% | Uptime monitoring |
| Error rate | < 0.1% requests | Error log analysis |
| Mean Time Between Failures (MTBF) | > 720 jam (30 hari) | Incident tracking |
| Mean Time To Recovery (MTTR) | < 15 menit | Recovery time monitoring |

#### B. Error Handling Testing
**Test Scenarios:**
1. **Network Failures**
   - Third-party API unavailable (PagePilot, WHOIS)
   - Database connection loss
   - Server timeout scenarios

2. **Invalid Data Handling**
   - Malformed API responses
   - Empty database results
   - Invalid user inputs

3. **Resource Exhaustion**
   - High CPU usage simulation
   - Memory overflow testing
   - Disk space limitations

**Expected Behavior:**
- Graceful degradation (tidak crash)
- User-friendly error messages
- Automatic retry mechanisms
- Logging untuk debugging

### 2.4 Integration Testing Metrics

#### A. Third-Party API Integration
**Objective:** Memastikan external services terintegrasi dengan baik

| Integration | Test Cases | Success Criteria |
|-------------|------------|------------------|
| **PagePilot API** | Speed test requests, rate limiting handling | 95% success rate, proper error handling |
| **WHOIS Services** | Domain lookup, retry mechanism | Accurate data retrieval, fallback options |
| **MySQL Database** | CRUD operations, transactions | Data consistency, rollback capability |

#### B. Module Integration Testing
**Test inter-module communications:**
1. Website data → Domain monitoring integration
2. OJS instances → OJS Secure credential mapping  
3. Uptime checks → Notification system trigger
4. PageSpeed results → Dashboard display
5. Notification system → User interface updates

---
## 3. KUESIONER PENERIMAAN PENGGUNA

### 3.1 Framework: Technology Acceptance Model (TAM)

**Theoretical Base:** TAM (Davis, 1989) + DeLone & McLean IS Success Model

**Constructs:**
- **Perceived Usefulness (PU):** Seberapa berguna sistem untuk pekerjaan
- **Perceived Ease of Use (PEOU):** Seberapa mudah sistem digunakan
- **Intention to Use (ITU):** Niat untuk terus menggunakan sistem
- **System Quality (SQ):** Kualitas teknis sistem
- **Information Quality (IQ):** Kualitas informasi yang disediakan
- **User Satisfaction (US):** Kepuasan pengguna overall

### 3.2 Instrumen Kuesioner

**Target Respondents:** IT Team (5 orang) + Management (2 orang)  
**Scale:** 5-point Likert scale (1=Sangat Tidak Setuju, 5=Sangat Setuju)  
**Language:** Bahasa Indonesia  
**Distribution:** Google Forms  
**Timeline:** 2 minggu setelah full deployment

#### A. Perceived Usefulness (PU) - 6 Items

| No | Statement | Dimension |
|----|-----------|-----------|
| PU1 | Sistem ITM SCI membantu saya menyelesaikan tugas monitoring lebih cepat | Job Performance |
| PU2 | Sistem ini meningkatkan produktivitas saya dalam mengelola website | Productivity |
| PU3 | Sistem ini memberikan value yang berguna untuk pekerjaan sehari-hari | Job Relevance |
| PU4 | Fitur monitoring terpadu memudahkan saya dalam mengambil keputusan | Decision Making |
| PU5 | Sistem ini mengurangi effort yang dibutuhkan untuk monitoring | Effort Reduction |
| PU6 | Secara keseluruhan, sistem ini berguna untuk pekerjaan saya | Overall Usefulness |

#### B. Perceived Ease of Use (PEOU) - 6 Items

| No | Statement | Dimension |
|----|-----------|-----------|
| PEOU1 | Interface sistem mudah dipahami dan dipelajari | Learnability |
| PEOU2 | Navigasi sistem intuitif dan mudah digunakan | Navigation |
| PEOU3 | Saya dapat menggunakan sistem tanpa banyak bantuan | Independence |
| PEOU4 | Sistem memberikan feedback yang jelas untuk setiap aksi | Feedback |
| PEOU5 | Error messages mudah dipahami dan membantu | Error Handling |
| PEOU6 | Secara keseluruhan, sistem ini mudah digunakan | Overall Ease |

#### C. System Quality (SQ) - 5 Items

| No | Statement | Dimension |
|----|-----------|-----------|
| SQ1 | Sistem memiliki response time yang cepat | Performance |
| SQ2 | Sistem jarang mengalami error atau crash | Reliability |
| SQ3 | Sistem dapat diakses kapan saja dibutuhkan | Availability |
| SQ4 | Fitur-fitur sistem berfungsi sesuai yang diharapkan | Functionality |
| SQ5 | Sistem aman dalam melindungi data sensitive | Security |

#### D. Information Quality (IQ) - 5 Items

| No | Statement | Dimension |
|----|-----------|-----------|
| IQ1 | Informasi yang ditampilkan akurat dan dapat dipercaya | Accuracy |
| IQ2 | Data dalam sistem selalu up-to-date | Timeliness |
| IQ3 | Informasi yang disediakan lengkap sesuai kebutuhan | Completeness |
| IQ4 | Format penyajian informasi mudah dipahami | Understandability |
| IQ5 | Informasi yang relevan mudah ditemukan | Accessibility |

#### E. Intention to Use (ITU) - 4 Items

| No | Statement | Dimension |
|----|-----------|-----------|
| ITU1 | Saya berencana untuk terus menggunakan sistem ini | Continuance Intention |
| ITU2 | Saya akan merekomendasikan sistem ini kepada rekan kerja | Recommendation |
| ITU3 | Saya lebih suka menggunakan sistem ini daripada metode lama | Preference |
| ITU4 | Sistem ini akan saya gunakan secara rutin | Regular Usage |

#### F. User Satisfaction (US) - 4 Items

| No | Statement | Dimension |
|----|-----------|-----------|
| US1 | Saya puas dengan performa sistem secara keseluruhan | Overall Satisfaction |
| US2 | Sistem ini memenuhi harapan saya | Expectation Fulfillment |
| US3 | Saya senang menggunakan sistem ini | Enjoyment |
| US4 | Sistem ini adalah solusi yang baik untuk kebutuhan kami | Solution Adequacy |

### 3.3 Demographic Questions

| Variable | Options |
|----------|---------|
| Role | IT Staff, IT Team Lead, Management |
| Experience with IT systems | < 1 tahun, 1-3 tahun, 3-5 tahun, > 5 tahun |
| Frequency of website monitoring | Daily, Weekly, Monthly, Occasional |
| Age group | < 25, 25-35, 35-45, > 45 |

### 3.4 Open-Ended Questions

1. **Fitur favorit:** "Fitur apa yang paling Anda sukai dari sistem ITM SCI? Mengapa?"

2. **Improvement suggestions:** "Apa yang perlu diperbaiki atau ditambahkan pada sistem ini?"

3. **Impact assessment:** "Bagaimana sistem ini mengubah cara Anda bekerja sehari-hari?"

4. **Challenges faced:** "Kesulitan apa yang Anda hadapi saat menggunakan sistem ini?"

5. **Overall feedback:** "Komentar atau saran tambahan untuk pengembangan sistem?"

---
## 4. USABILITY TESTING

### 4.1 Usability Testing Framework

**Methodology:** Task-based usability testing dengan think-aloud protocol  
**Participants:** 5 users (IT team members)  
**Duration:** 60-90 menit per participant  
**Environment:** Real work environment dengan actual data  
**Recording:** Screen capture + audio (dengan permission)

### 4.2 Usability Test Scenarios

#### Scenario 1: Daily Monitoring Routine
**Context:** "Anda baru masuk kantor dan ingin melakukan pengecekan harian kondisi semua website"

**Tasks:**
1. Login ke sistem ITM SCI
2. Lihat overview status semua website di dashboard
3. Check apakah ada notifications atau alerts
4. Identifikasi website yang memiliki masalah (jika ada)
5. Lihat trend PageSpeed untuk website-website utama
6. Check domain yang akan expire dalam 30 hari ke depan

**Success Metrics:**
- Task completion rate: 100%
- Task completion time: < 10 menit
- Number of errors: < 2
- User satisfaction rating: > 4/5

#### Scenario 2: Domain Expiry Management  
**Context:** "Anda menerima notifikasi bahwa ada domain yang akan expire, dan perlu melakukan tindak lanjut"

**Tasks:**
1. Buka notification panel
2. Klik alert tentang domain expiry
3. Lihat detail informasi domain (registrar, expiry date, etc.)
4. Check apakah ini main domain atau subdomain
5. Mark notification sebagai handled
6. Export list domain yang akan expire untuk laporan

**Success Metrics:**
- Task completion rate: 100%
- Task completion time: < 5 menit
- User confidence level: Tinggi (subjective)

#### Scenario 3: OJS Credential Access
**Context:** "Anda perlu mengakses OJS untuk maintenance, dan membutuhkan username/password"

**Tasks:**
1. Navigate ke OJS Secure module
2. Masukkan OJS Secure credentials
3. Search untuk specific OJS instance
4. Copy username dan password
5. Update credential yang sudah expired
6. Logout dari OJS Secure

**Success Metrics:**
- Security compliance: 100% (proper auth flow)
- Task completion time: < 7 menit
- No credential exposure: Pass

### 4.3 Usability Metrics

#### A. Effectiveness Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Task completion rate | > 95% | Successfully completed tasks / Total tasks |
| Error rate | < 5% | Number of user errors / Total actions |
| Task success rate | > 90% | Tasks completed without assistance |

#### B. Efficiency Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Time on task | Baseline established in pre-test | Time to complete each scenario |
| Steps to completion | Minimize navigation clicks | Count clicks/steps per task |
| Learning curve | Improvement dalam repeated tasks | Time reduction dari first → second attempt |

#### C. Satisfaction Metrics
| Metric | Measurement Method | Target |
|--------|-------------------|--------|
| System Usability Scale (SUS) | Standard 10-item questionnaire | Score > 70 |
| Net Promoter Score (NPS) | "Would you recommend this system?" | Score > 8/10 |
| Subjective satisfaction | Post-test interview | Positive feedback |

### 4.4 System Usability Scale (SUS) Questionnaire

**Instructions:** Untuk setiap statement, berikan rating 1-5 (1=Sangat Tidak Setuju, 5=Sangat Setuju)

| No | Statement |
|----|-----------|
| 1 | Saya akan sering menggunakan sistem ini |
| 2 | Saya merasa sistem ini terlalu rumit |
| 3 | Sistem ini mudah digunakan |
| 4 | Saya memerlukan bantuan teknis untuk menggunakan sistem ini |
| 5 | Berbagai fitur dalam sistem terintegrasi dengan baik |
| 6 | Terlalu banyak inconsistency dalam sistem ini |
| 7 | Saya yakin kebanyakan orang akan cepat belajar menggunakan sistem ini |
| 8 | Sistem ini sangat merepotkan untuk digunakan |
| 9 | Saya merasa percaya diri menggunakan sistem ini |
| 10 | Saya perlu belajar banyak hal sebelum bisa menggunakan sistem ini |

**SUS Score Calculation:**
- Odd items (1,3,5,7,9): Score = rating - 1
- Even items (2,4,6,8,10): Score = 5 - rating  
- Total = (Sum of scores) × 2.5
- **Target:** SUS Score > 70 (Above Average)

---

## 5. ACCEPTANCE TESTING

### 5.1 User Acceptance Testing (UAT)

#### A. UAT Planning
**Participants:** Key stakeholders (IT Team Lead, Management Representative)  
**Duration:** 2 minggu full testing  
**Environment:** Production-like environment dengan real data  
**Methodology:** Scenario-based testing + Exploratory testing

#### B. Acceptance Criteria

**Functional Acceptance:**
✅ Semua 222 website data dapat dimanage dengan benar  
✅ OJS Secure credential management berfungsi aman  
✅ Domain monitoring memberikan accurate alerts  
✅ PageSpeed monitoring menampilkan data real-time  
✅ Uptime monitoring detect downtime < 5 menit  
✅ Notification system deliver alerts tepat waktu  
✅ Role-based access control berjalan sesuai design  
✅ Dashboard load dalam < 3 detik  

**Business Acceptance:**
✅ Monitoring time reduction minimal 80% (vs manual process)  
✅ Zero domain expiry incidents selama testing period  
✅ User satisfaction rata-rata > 4.0/5.0  
✅ System uptime > 99% selama UAT period  
✅ All security requirements met  

### 5.2 Go/No-Go Criteria

#### Must-Have (Go/No-Go)
- [ ] Semua critical bugs resolved (severity high/critical = 0)
- [ ] Performance requirements met (response time < target)
- [ ] Security audit passed (no high/critical vulnerabilities)
- [ ] Data migration completed successfully
- [ ] Backup & recovery procedures tested
- [ ] User training completed
- [ ] Documentation delivered & approved

#### Should-Have (Strong consideration for delay)
- [ ] Medium priority bugs < 5
- [ ] User acceptance score > 80%
- [ ] Performance within 10% of target
- [ ] All integration tests passed

#### Could-Have (Can be post-launch)
- [ ] Low priority bugs
- [ ] Nice-to-have features
- [ ] Additional integrations
- [ ] Advanced reporting features

---

## 6. TEST EXECUTION PLAN

### 6.1 Testing Phases & Timeline

| Phase | Duration | Activities | Deliverables |
|-------|----------|------------|--------------|
| **Phase 1: Unit Testing** | Weeks 5-14 | Developer testing per module | Test reports per sprint |
| **Phase 2: Integration Testing** | Week 13 | Module integration, API testing | Integration test report |
| **Phase 3: System Testing** | Week 14 | End-to-end testing, performance | System test report |
| **Phase 4: Security Testing** | Week 15 | Vulnerability assessment | Security audit report |
| **Phase 5: Usability Testing** | Week 16 | User experience testing | Usability test report |
| **Phase 6: UAT** | Week 17-18 | Stakeholder acceptance testing | UAT sign-off document |

### 6.2 Test Environment Setup

#### A. Test Data Preparation
- **Production data subset:** 50 websites, 25 OJS instances (sanitized)
- **Synthetic test data:** Various edge cases, boundary conditions
- **Security test data:** Invalid inputs, malicious payloads

#### B. Test Environment Configuration
- **Staging server:** Mirror of production environment
- **Test database:** Isolated dari production
- **Third-party API mocks:** Untuk testing tanpa external dependencies

### 6.3 Defect Management

#### Bug Severity Classification:
- **Critical:** System crash, data loss, security breach
- **High:** Major feature tidak berfungsi, performance severely degraded
- **Medium:** Minor feature issue, workaround available
- **Low:** Cosmetic issue, enhancement request

#### Bug Resolution Timeline:
- **Critical:** 24 jam
- **High:** 72 jam  
- **Medium:** 1 minggu
- **Low:** Next release cycle

### 6.4 Test Deliverables

| Deliverable | Content | Timeline |
|-------------|---------|----------|
| **Test Plan Document** | Comprehensive testing strategy | Week 4 |
| **Test Cases Specification** | Detailed test scenarios | Week 13 |
| **Test Execution Reports** | Results per testing phase | Weekly during testing |
| **Performance Test Report** | Load testing results | Week 15 |
| **Security Audit Report** | Vulnerability assessment | Week 15 |
| **Usability Test Report** | User experience findings | Week 16 |
| **UAT Report** | Stakeholder acceptance results | Week 18 |
| **Final Test Summary** | Consolidated testing summary | Week 18 |

---

## 7. SUCCESS CRITERIA SUMMARY

### 7.1 Technical Success Criteria

| Category | Metric | Target | Measurement |
|----------|---------|--------|-------------|
| **Performance** | Dashboard load time | < 3 detik | Automated testing |
| **Performance** | API response time | < 2 detik (90%) | Server monitoring |
| **Security** | Vulnerability count | 0 critical/high | Security scanning |
| **Reliability** | System uptime | > 99.5% | Uptime monitoring |
| **Functionality** | Feature completeness | 100% requirements | Test case coverage |

### 7.2 User Acceptance Criteria

| Category | Metric | Target | Measurement |
|----------|---------|--------|-------------|
| **Usability** | SUS Score | > 70 | SUS questionnaire |
| **Satisfaction** | User rating | > 4.0/5.0 | TAM survey |
| **Adoption** | Usage rate | > 90% | Usage analytics |
| **Effectiveness** | Task completion | > 95% | Usability testing |
| **Efficiency** | Time savings | > 80% reduction | Time & motion study |

### 7.3 Business Impact Criteria

| Category | Metric | Target | Measurement |
|----------|---------|--------|-------------|
| **Efficiency** | Monitoring time | < 30 min/day | Time tracking |
| **Risk Reduction** | Domain incidents | 0 incidents | Incident tracking |
| **Proactivity** | Downtime detection | < 5 minutes | Alert response time |
| **ROI** | Cost savings | Positive ROI | Cost-benefit analysis |

---

*Rencana Pengujian & Instrumen*  
*Syntax Comprehensive Interface (ITM SCI)*  
*Versi 1.0*