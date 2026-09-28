# 🧪 POIN 5: RENCANA PENGUJIAN & INSTRUMEN
## ITM SCI - Testing Framework & Evaluation Instruments

---

## 🎯 **APA ITU RENCANA PENGUJIAN?**

### **Testing Framework Definition**
Rencana pengujian adalah **systematic approach** untuk validating sistem ITM SCI melalui:
- **Functional testing:** Memastikan semua fitur bekerja sesuai requirements
- **Performance testing:** Verify system meets speed + scalability targets  
- **Security testing:** Validate encryption + access control + audit trails
- **User acceptance testing:** Confirm usability + satisfaction + adoption

### **Kenapa Testing Critical untuk DSR?**
✅ **Validation Required:** DSR demands rigorous artifact evaluation  
✅ **Business Impact:** Must prove 87.5% efficiency improvement  
✅ **Academic Rigor:** Evidence-based conclusions untuk thesis  
✅ **Risk Mitigation:** Identify issues before production deployment  

### **Testing Types Hierarchy**
```
Unit Testing (Individual functions)
    ↓
Integration Testing (Module connections)  
    ↓
System Testing (End-to-end workflows)
    ↓
Performance Testing (Load + stress)
    ↓
Security Testing (Vulnerabilities + encryption)
    ↓
User Acceptance Testing (Real user scenarios)
```

---

## 🔧 **TECHNICAL TESTING FRAMEWORK**

### **1️⃣ UNIT TESTING**

#### **Backend Unit Tests (Laravel)**
**Testing Framework:** PHPUnit (Laravel default)  
**Coverage Target:** >80% code coverage untuk critical functions

**Test Categories:**
```php
// Authentication Tests
AuthenticationTest::can_login_with_valid_credentials()
AuthenticationTest::cannot_login_with_invalid_credentials()
AuthenticationTest::can_logout_successfully()

// Website Management Tests  
WebsiteControllerTest::can_create_website()
WebsiteControllerTest::can_update_website()
WebsiteControllerTest::can_delete_website()
WebsiteModelTest::validates_required_fields()

// OJS Management Tests
OjsInstanceTest::can_store_encrypted_credentials()
OjsSecureTest::dual_authentication_works()
OjsControllerTest::unauthorized_access_denied()

// Domain Monitoring Tests
DomainControllerTest::whois_integration_works()
DomainServiceTest::calculates_days_until_expiry()
DomainTest::filters_main_domains_only()
```

**Critical Functions untuk Unit Testing:**
- Authentication logic (login/logout/token validation)
- Encryption/decryption functions (OJS credentials)  
- WHOIS data parsing + expiry calculations
- API integrations (PagePilot, third-party services)
- Database operations (CRUD, relationships)

#### **Frontend Unit Tests (React + Jest)**
**Testing Framework:** Jest + React Testing Library  
**Coverage Target:** >70% untuk critical components

**Test Categories:**
```javascript
// Component Rendering Tests
Dashboard.test.js: renders without crashing
WebsiteList.test.js: displays websites correctly  
OjsSecure.test.js: shows login form when unauthenticated

// User Interaction Tests
LoginForm.test.js: submits form with valid data
SearchBar.test.js: filters results on input change
NotificationPanel.test.js: marks notifications as read

// API Integration Tests  
apiService.test.js: handles API responses correctly
authService.test.js: manages authentication tokens
errorHandler.test.js: displays appropriate error messages
```

### **2️⃣ INTEGRATION TESTING**

#### **API Integration Tests**
**Framework:** Postman + Newman (automated API testing)

**API Endpoint Coverage:**
```
Authentication Endpoints:
POST /api/login - Valid + invalid credentials
POST /api/logout - With + without token
GET /api/user - Authenticated + unauthenticated

Website Management:
GET /api/websites - List + pagination + filtering
POST /api/websites - Create dengan valid + invalid data
PUT /api/websites/{id} - Update existing + non-existent  
DELETE /api/websites/{id} - Delete with permissions

OJS Management:  
GET /api/ojs-instances - List dengan authentication
POST /api/ojs-secure/authenticate - Dual authentication
GET /api/ojs-secure/instances - Secure credential access

Domain Monitoring:
GET /api/domains - WHOIS integration working
GET /api/domains/expiry - Alert calculations correct

Performance Monitoring:
GET /api/pagespeed - PagePilot API integration
GET /api/uptime - Uptime checking functional
```

#### **Database Integration Tests**
**Framework:** Laravel Feature Tests dengan test database

**Database Operation Tests:**
- **Migrations:** All tables created correctly dengan proper schema
- **Relationships:** Foreign keys working, cascade deletes proper
- **Constraints:** Unique constraints enforced, validation working  
- **Indexing:** Query performance optimal dengan proper indexes
- **Transactions:** Data consistency maintained during operations

### **3️⃣ SYSTEM TESTING (END-TO-END)**

#### **Complete User Journey Testing**
**Framework:** Cypress (E2E testing framework)

**Critical User Workflows:**
```javascript
// Complete Admin Workflow
admin_workflow_test.js:
1. Login as admin user
2. Add new website to system
3. Configure domain monitoring  
4. Set up PageSpeed tracking
5. Verify notifications working
6. Logout successfully

// OJS Secure Workflow  
ojs_secure_workflow_test.js:
1. Login to main system
2. Access OJS Secure module
3. Authenticate with dual credentials
4. View OJS instances list
5. Edit OJS credentials
6. Verify audit trail logged

// Domain Management Workflow
domain_workflow_test.js:  
1. View domain monitoring dashboard
2. Check expiry dates accuracy
3. Trigger manual WHOIS update
4. Verify alert notifications  
5. Export domain report
```

#### **Cross-browser Compatibility**
**Testing Matrix:**
- **Chrome:** Latest version (primary browser)
- **Firefox:** Latest version (secondary support)
- **Safari:** Latest version (Mac compatibility)  
- **Edge:** Latest version (Windows compatibility)

**Mobile Responsiveness:**
- **iPhone:** Safari mobile testing
- **Android:** Chrome mobile testing
- **Tablet:** iPad + Android tablet layouts

---

## ⚡ **PERFORMANCE TESTING FRAMEWORK**

### **🚀 LOAD TESTING**

#### **Performance Targets & Benchmarks**
| Component | Target Performance | Load Test Scenario |
|-----------|-------------------|-------------------|
| **Dashboard Load** | <3 seconds | 50 concurrent users |
| **API Response** | <2 seconds | 100 requests/minute |
| **Database Queries** | <500ms per query | Complex joins testing |
| **Third-party APIs** | <5 seconds timeout | PagePilot + WHOIS stress |

#### **Load Testing Tools & Scripts**
**Tool:** Apache JMeter + LoadRunner (if available)

**Test Scenarios:**
```
Scenario 1: Normal Load
- 10 concurrent users
- 5-minute duration  
- Regular dashboard usage
- Target: All requests <3s

Scenario 2: Peak Load
- 50 concurrent users
- 15-minute duration
- Heavy API usage + reporting
- Target: 90% requests <5s

Scenario 3: Stress Test
- 100 concurrent users  
- 30-minute duration
- Maximum system capacity
- Target: System doesn't crash

Scenario 4: Endurance Test  
- 25 concurrent users
- 2-hour duration
- Memory leak detection
- Target: Stable performance
```

### **📊 DATABASE PERFORMANCE TESTING**

#### **Query Optimization Validation**
**Testing Focus Areas:**
- **Website queries:** Pagination efficiency dengan 222+ records
- **OJS queries:** Complex filtering + security checks
- **Domain queries:** WHOIS data joining + expiry calculations  
- **Monitoring queries:** Historical data aggregation
- **Dashboard queries:** Real-time statistics generation

**Performance Benchmarks:**
```sql
-- Website listing performance
EXPLAIN SELECT * FROM websites WHERE status = 'active' 
ORDER BY created_at DESC LIMIT 20 OFFSET 0;
-- Target: <100ms

-- Domain expiry checking  
EXPLAIN SELECT domain, expires_at, DATEDIFF(expires_at, NOW()) as days_left 
FROM domains WHERE expires_at <= DATE_ADD(NOW(), INTERVAL 30 DAY);
-- Target: <200ms

-- Dashboard statistics
EXPLAIN SELECT COUNT(*) as total_websites, 
       AVG(pagespeed_score) as avg_speed,
       COUNT(CASE WHEN status = 'down' THEN 1 END) as down_count
FROM websites;  
-- Target: <300ms
```

---

## 🔐 **SECURITY TESTING FRAMEWORK**

### **🛡️ PENETRATION TESTING**

#### **Security Test Categories**
**Framework:** OWASP Testing Guide + Manual security assessment

**Authentication Security:**
```
Test Case: Brute Force Protection
- Attempt 10+ failed logins rapidly
- Expected: Account lockout + rate limiting
- Tools: Burp Suite + custom scripts

Test Case: Session Management
- Token expiration testing (120-minute timeout)  
- Session hijacking attempts
- Tools: OWASP ZAP + manual testing

Test Case: Password Security
- Password strength validation
- Secure storage verification (bcrypt)
- Tools: Hash analysis + database inspection
```

**Authorization Testing:**
```
Test Case: Role-Based Access Control  
- Viewer accessing admin functions
- PageSpeed user accessing OJS Secure
- Tools: Manual testing + API calls

Test Case: Direct Object References
- Access other users' data via ID manipulation
- Expected: Access denied + audit logged
- Tools: Burp Suite parameter manipulation
```

#### **Encryption Validation**
**AES-256 Credential Encryption Testing:**
```php
// Encryption Test Suite
SecurityTest::credentials_encrypted_in_database()  
SecurityTest::decryption_requires_proper_key()
SecurityTest::encrypted_data_not_readable_raw()
SecurityTest::audit_trail_logs_credential_access()
```

**Data in Transit Security:**
- **HTTPS enforcement:** All communications encrypted  
- **API security:** Bearer tokens in headers only
- **Form submissions:** No sensitive data in URLs

### **🔍 VULNERABILITY ASSESSMENT**

#### **Automated Security Scanning**
**Tools Used:**
- **OWASP ZAP:** Web application vulnerability scanner
- **Nessus/OpenVAS:** Network vulnerability assessment  
- **SonarQube:** Static code analysis untuk security issues
- **npm audit:** Frontend dependency vulnerability check

**Critical Vulnerabilities to Check:**
- **SQL Injection:** Database query manipulation attempts
- **XSS (Cross-Site Scripting):** Malicious script injection
- **CSRF (Cross-Site Request Forgery):** Unauthorized action execution  
- **File Upload:** Malicious file upload prevention
- **Information Disclosure:** Sensitive data exposure

#### **Security Compliance Checklist**
✅ **Data Protection:**
- Personal data handling compliance
- Credential storage encryption (AES-256)
- Audit trail completeness  
- Access logging comprehensive

✅ **System Hardening:**
- Default passwords changed
- Unnecessary services disabled  
- Error messages don't reveal system info
- Security headers implemented

---

## 👥 **USER ACCEPTANCE TESTING (UAT)**

### **🎯 UAT FRAMEWORK & PARTICIPANTS**

#### **UAT Participant Matrix**
| User Role | Participant Count | Primary Focus | Testing Duration |
|-----------|------------------|---------------|------------------|
| **IT Team** | 7 users | Daily operations efficiency | 2 weeks |
| **Management** | 2 users | Dashboard + strategic insights | 1 week |  
| **Domain Admin** | 1 user | Domain monitoring + alerts | 1 week |
| **Power User** | 1 user (IT Lead) | Advanced features + edge cases | 2 weeks |

#### **UAT Environment Setup**
**Production-like Environment:**
- **Live data:** 222 websites + 132 OJS instances loaded
- **Real APIs:** PagePilot + WHOIS services connected  
- **Actual workflows:** Current business processes replicated
- **Support available:** Developer on-standby untuk issues

### **📋 UAT TEST SCENARIOS**

#### **Scenario 1: Daily Monitoring Workflow**
**Participant:** IT Team Members (All 7)  
**Duration:** 30 minutes per session

```
Pre-test Setup:
- User receives brief 10-minute system overview  
- Given realistic daily monitoring tasks
- Current manual process timing recorded

Test Tasks:
1. Login to ITM SCI system
2. Check dashboard untuk overnight incidents
3. Review domain expiry alerts (if any)
4. Update website status information  
5. Check PageSpeed reports untuk main websites
6. Add new website to monitoring
7. Generate weekly summary report
8. Logout dari system

Success Criteria:
- All tasks completed successfully
- Total time <30 minutes (vs 240 minutes manual)
- User satisfaction rating >4.0/5.0  
- No critical issues encountered
```

#### **Scenario 2: OJS Secure Management**  
**Participant:** OJS Administrators (2-3 users)
**Duration:** 45 minutes per session

```
Test Tasks:
1. Access OJS Secure module
2. Authenticate dengan dual credentials
3. View encrypted OJS instances list  
4. Update OJS credentials untuk test instance
5. Verify audit trail recorded properly
6. Search + filter OJS instances
7. Export credentials report (if authorized)
8. Logout secure session

Success Criteria:
- Dual authentication works smoothly
- Credential encryption/decryption transparent
- Audit trail complete + accurate  
- No unauthorized access possible
```

#### **Scenario 3: Executive Dashboard Usage**
**Participant:** Management (2 users)  
**Duration:** 20 minutes per session

```  
Test Tasks:
1. View executive dashboard overview
2. Analyze website uptime trends  
3. Review domain expiry timeline
4. Check PageSpeed performance summary
5. Filter data by holding company
6. Export executive summary report
7. Review notification alerts

Success Criteria:
- Information clear + actionable
- Dashboard loads <3 seconds consistently
- Data accuracy verified  
- Export functions working properly
```

---

## 📊 **EVALUATION INSTRUMENTS**

### **🔍 QUANTITATIVE MEASUREMENT INSTRUMENTS**

#### **Performance Metrics Collection**
**Automated Monitoring Tools:**
- **Application Performance Monitoring (APM):** New Relic atau Datadog
- **Database Performance:** MySQL slow query log + performance schema
- **Frontend Performance:** Google Lighthouse + Chrome DevTools  
- **User Analytics:** Custom tracking untuk task completion times

**Key Performance Indicators (KPIs):**
```
System Performance KPIs:
- Average dashboard load time (target: <3s)
- API response time distribution (target: 90% <2s)  
- Database query execution time (target: <500ms)
- System uptime percentage (target: >99.5%)

User Efficiency KPIs:  
- Daily monitoring time reduction (target: >80%)
- Task completion rate (target: >95%)
- Error rate per session (target: <5%)
- Feature adoption rate (target: >90%)

Business Impact KPIs:
- Domain incidents prevented (target: 0)
- Downtime detection speed (target: <5 minutes)  
- Security incidents (target: 0)
- Cost savings achieved (target: >Rp 75 juta/year)
```

#### **Usage Analytics Framework**
**Tracking Implementation:**
```javascript
// User interaction tracking
analytics.track('Dashboard Viewed', {
  user_id: user.id,
  load_time: performance.now(),
  timestamp: new Date()
});

analytics.track('Website Added', {
  user_id: user.id, 
  website_count: websites.length,
  completion_time: task_duration
});

analytics.track('OJS Secure Accessed', {
  user_id: user.id,
  authentication_method: 'dual_auth',
  success: true
});
```

### **📝 QUALITATIVE ASSESSMENT INSTRUMENTS**

#### **Technology Acceptance Model (TAM) Questionnaire**
**Framework:** Davis (1989) TAM model adapted untuk monitoring systems

**Questionnaire Structure (5-point Likert scale: 1=Strongly Disagree, 5=Strongly Agree):**

**Perceived Usefulness (PU):**
1. "ITM SCI system meningkatkan produktivitas monitoring saya"
2. "ITM SCI membuat pekerjaan monitoring menjadi lebih efisien"  
3. "ITM SCI membantu saya menyelesaikan tugas monitoring lebih cepat"
4. "ITM SCI bermanfaat untuk pekerjaan monitoring harian"
5. "ITM SCI memberikan value tambah untuk team IT"
6. "Overall, ITM SCI sangat berguna untuk operasional kami"

**Perceived Ease of Use (PEOU):**
1. "Belajar menggunakan ITM SCI mudah untuk saya"
2. "Interaksi dengan ITM SCI clear + understandable"  
3. "ITM SCI mudah untuk become skillful menggunakannya"
4. "Navigasi ITM SCI intuitif + user-friendly"
5. "ITM SCI mudah digunakan untuk accomplish monitoring tasks"
6. "Overall, ITM SCI sistem yang mudah digunakan"

**Attitude Toward Using (ATU):**
1. "Menggunakan ITM SCI adalah ide yang baik"
2. "Saya suka bekerja dengan ITM SCI"  
3. "ITM SCI membuat monitoring menjadi lebih enjoyable"
4. "ITM SCI approach yang smart untuk website monitoring"

**Behavioral Intention to Use (BI):**  
1. "Saya intend untuk menggunakan ITM SCI secara regular"
2. "Saya akan recommend ITM SCI untuk team lain"
3. "Saya plan untuk continue menggunakan ITM SCI"

#### **System Usability Scale (SUS) Assessment**
**Framework:** Brooke (1996) standard SUS questionnaire  
**Scale:** 5-point Likert (1=Strongly Disagree, 5=Strongly Agree)

**SUS Questions (alternating positive/negative):**
1. "I think I would like to use ITM SCI frequently"
2. "I found ITM SCI unnecessarily complex"  
3. "I thought ITM SCI was easy to use"
4. "I think I would need technical support to use ITM SCI"
5. "I found the various functions in ITM SCI well integrated"
6. "I thought there was too much inconsistency in ITM SCI"  
7. "I imagine most people would learn to use ITM SCI quickly"
8. "I found ITM SCI very cumbersome to use"
9. "I felt very confident using ITM SCI"
10. "I needed to learn a lot before I could get going with ITM SCI"

**SUS Scoring:** (Sum - 2.5) × 2.5 = Score out of 100  
**Target:** >68 (above average), ideal >80 (excellent)

#### **Custom Satisfaction Survey**
**Monitoring-specific Questions:**

**Efficiency Assessment:**
- "Berapa menit per hari Anda habiskan untuk monitoring sebelum ITM SCI?"
- "Berapa menit per hari sekarang dengan ITM SCI?"  
- "Seberapa puas dengan time savings yang achieved?" (1-5 scale)

**Feature-specific Satisfaction:**
- "Domain monitoring + alerts effectiveness?" (1-5 scale)
- "OJS Secure usability + security feeling?" (1-5 scale)  
- "Dashboard informativeness + clarity?" (1-5 scale)
- "Notification timeliness + relevance?" (1-5 scale)

**Overall Impact:**
- "Seberapa ITM SCI improve overall job satisfaction?" (1-5 scale)
- "Would you recommend ITM SCI to similar organizations?"
- "What's the most valuable feature untuk daily work?"
- "What improvements would make ITM SCI even better?"

---

## 📅 **TESTING TIMELINE & SCHEDULE**

### **🗓️ COMPREHENSIVE TESTING SCHEDULE**

#### **Development Phase Testing (Week 6-14)**
```
Week 6-8: Unit Testing + Integration Testing
- Backend unit tests development (PHPUnit)
- Frontend component tests (Jest)  
- API integration testing (Postman)
- Database operation validation

Week 9-11: System Testing + Security Testing  
- End-to-end workflow testing (Cypress)
- Security vulnerability assessment (OWASP ZAP)
- Performance baseline establishment
- Cross-browser compatibility testing

Week 12-14: Pre-UAT Testing + Bug Fixes
- Load testing implementation (JMeter)  
- Security hardening validation
- Performance optimization  
- Critical bug resolution
```

#### **Formal Testing Phase (Week 15-17)**
```
Week 15: System Demonstration + Initial UAT
- Stakeholder demo sessions (5 days)  
- Initial user feedback collection
- System performance validation
- Security compliance verification

Week 16: Full User Acceptance Testing
- IT Team UAT sessions (7 users × 2 sessions each)
- Management UAT sessions (2 users × 1 session each)  
- Domain Admin UAT (1 user × 2 sessions)
- Power User testing (1 user × advanced scenarios)

Week 17: Evaluation + Assessment  
- TAM questionnaire administration
- SUS scale assessment  
- Custom satisfaction surveys
- Performance metrics analysis
- Final bug fixes + optimizations
```

#### **Post-Testing Activities (Week 18)**
```
Documentation + Knowledge Transfer:
- Testing results compilation  
- User feedback analysis + recommendations
- System documentation finalization
- Training material preparation  
- Handover planning + support transition
```

---

## 📊 **SUCCESS CRITERIA & ACCEPTANCE THRESHOLDS**

### **🎯 TESTING SUCCESS BENCHMARKS**

#### **Technical Acceptance Criteria**
| Testing Category | Acceptance Threshold | Measurement Method |
|------------------|---------------------|-------------------|
| **Unit Test Coverage** | >80% critical functions | PHPUnit coverage report |
| **Integration Success** | >95% API tests pass | Postman test results |
| **Performance** | <3s dashboard load | Load testing verification |
| **Security** | Zero critical vulnerabilities | OWASP scan + pen testing |
| **Cross-browser** | 100% core functions work | Manual testing matrix |

#### **User Acceptance Criteria**  
| Assessment Method | Acceptance Threshold | Sample Size |
|------------------|---------------------|-------------|
| **TAM Score** | >4.0/5.0 average | All 10 users |
| **SUS Score** | >68 (target >80) | All 10 users |  
| **Task Completion** | >95% success rate | UAT sessions |
| **User Satisfaction** | >4.0/5.0 overall | Custom survey |
| **System Adoption** | >90% active usage | 4-week tracking |

#### **Business Impact Criteria**
| Business Metric | Success Threshold | Measurement Period |
|-----------------|-------------------|-------------------|
| **Monitoring Time** | >80% reduction achieved | 4-week comparison |
| **Domain Incidents** | Zero incidents | 6-month target |  
| **Detection Speed** | <5 minutes average | Incident tracking |
| **Cost Savings** | >Rp 60 juta annually | ROI calculation |

### **🚨 FAILURE CRITERIA & MITIGATION**

#### **Critical Failure Indicators**
⚠️ **Technical Failures:**
- **Security vulnerabilities:** Any critical security issues discovered
- **Performance failure:** Consistent >5s dashboard load times  
- **Data integrity:** Any data loss atau corruption incidents
- **Integration failure:** Third-party APIs consistently failing

**Mitigation Strategy:** 2-week remediation period dengan focused fixes

⚠️ **User Acceptance Failures:**
- **TAM score <3.5:** Indicates fundamental usability issues
- **SUS score <50:** System unusable untuk average users
- **Adoption rate <70%:** Users tidak willing to use system
- **Task completion <90%:** Core workflows not intuitive

**Mitigation Strategy:** UX redesign + additional training + feature simplification

⚠️ **Business Impact Failures:**
- **<60% efficiency gain:** Not meeting minimum business case
- **User satisfaction <3.5:** Not achieving user acceptance targets  
- **System uptime <99%:** Reliability issues affecting business
- **ROI negative:** Cost exceeds benefits

**Mitigation Strategy:** Scope adjustment + timeline extension + success criteria renegotiation

---

## ✅ **TESTING DELIVERABLES & REPORTS**

### **📋 TESTING DOCUMENTATION PACKAGE**

#### **Technical Testing Reports**
- **Unit Testing Report:** Coverage statistics + test results summary
- **Integration Testing Report:** API testing results + integration matrix
- **Performance Testing Report:** Load testing results + optimization recommendations
- **Security Testing Report:** Vulnerability assessment + remediation status
- **System Testing Report:** End-to-end testing results + browser compatibility

#### **User Acceptance Testing Reports**  
- **UAT Summary Report:** Participant feedback + task completion analysis
- **TAM Assessment Report:** Technology acceptance analysis + user insights
- **SUS Evaluation Report:** System usability scoring + benchmarking  
- **User Satisfaction Report:** Custom survey results + improvement recommendations

#### **Business Impact Assessment**
- **Efficiency Improvement Report:** Before/after comparison dengan statistical analysis
- **ROI Validation Report:** Cost-benefit analysis dengan actual vs projected
- **Risk Mitigation Report:** Security + operational risk assessment results
- **Adoption Success Report:** User engagement + system utilization metrics

### **🎯 FINAL TESTING CONCLUSION**

#### **Testing Success Definition**
✅ **ITM SCI considered successful when:**
- All technical acceptance criteria met (performance + security + functionality)
- User acceptance thresholds achieved (TAM >4.0, SUS >68, satisfaction >4.0)  
- Business impact targets reached (>80% efficiency, zero incidents, positive ROI)
- Academic evaluation requirements satisfied (rigorous assessment + documentation)

#### **Knowledge Contribution from Testing**
📚 **Testing Framework Contribution:**
- Comprehensive testing methodology untuk integrated monitoring systems
- User acceptance evaluation framework untuk enterprise applications  
- Performance benchmarking guidelines untuk shared hosting environments
- Security testing checklist untuk credential management systems

*Testing & Evaluation Framework - ITM SCI*  
*Comprehensive Quality Assurance Strategy*  
*[Tanggal] | [Nama Mahasiswa] | [Program Studi]*