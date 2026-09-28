# 🧪 POIN 5: RENCANA TESTING ITM SCI

## 🎯 APA ITU TESTING?

### Testing = Memastikan sistem ITM SCI:
- **Semua fitur working** sesuai requirements
- **Performance cepat** (<3 detik dashboard)
- **Security aman** (enkripsi + audit trail)
- **User senang** pakai sistem (>4.0/5.0 satisfaction)

### Kenapa Testing Penting?
- ✅ **Prove effectiveness:** Harus buktikan 87.5% improvement
- ✅ **Find bugs:** Sebelum production deployment
- ✅ **User confidence:** Pastikan sistem reliable
- ✅ **Academic requirement:** DSR butuh evaluation rigorous

## 🔧 JENIS-JENIS TESTING

### 1️⃣ TECHNICAL TESTING

#### Unit Testing (Individual Functions):
```
✅ Authentication: Login/logout/token validation
✅ Website CRUD: Create, read, update, delete websites
✅ OJS Security: Encryption/decryption credentials  
✅ Domain Monitoring: WHOIS integration + expiry calculation
✅ API Integration: PagePilot + third-party services
```

#### Integration Testing (Module Connections):
```
✅ Frontend ↔ Backend API calls
✅ Database ↔ Application queries
✅ Third-party APIs ↔ ITM SCI system
✅ Authentication ↔ All secure modules
```

#### Performance Testing:
```
Target Performance:
- Dashboard load: <3 seconds
- API response: <2 seconds  
- Database queries: <500ms
- Concurrent users: 50 users
- System uptime: >99.5%

Load Testing Scenarios:
- Normal: 10 users, 5 minutes
- Peak: 50 users, 15 minutes
- Stress: 100 users, 30 minutes (find breaking point)
```

### 2️⃣ SECURITY TESTING

#### Encryption Validation:
- ✅ **OJS credentials encrypted** dalam database (AES-256)
- ✅ **Decryption requires proper key** (tidak bisa raw access)
- ✅ **Audit trail complete** (semua access logged)

#### Access Control Testing:
- ✅ **Role-based permissions:** Viewer tidak bisa access admin functions
- ✅ **Session management:** Token expiry working (120 minutes)
- ✅ **Unauthorized access blocked:** Proper error handling

#### Vulnerability Assessment:
- **SQL Injection:** Coba manipulasi database queries
- **XSS (Cross-Site Scripting):** Coba inject malicious scripts
- **CSRF:** Coba unauthorized actions
- **Tools used:** OWASP ZAP + manual testing

### 3️⃣ USER ACCEPTANCE TESTING (UAT)

#### Test Participants:
```
IT Team (7 users):
- Focus: Daily monitoring efficiency
- Duration: 2 weeks testing
- Task: Complete daily workflow dalam <30 menit

Management (2 users):  
- Focus: Executive dashboard insights
- Duration: 1 week testing
- Task: Generate reports + strategic overview

Domain Admin (1 user):
- Focus: Domain monitoring + alerts
- Duration: 1 week testing  
- Task: Domain expiry management workflow
```

#### UAT Scenarios:
```
Scenario 1: Daily Monitoring (30 minutes)
1. Login to ITM SCI
2. Check dashboard untuk overnight issues
3. Review domain expiry alerts  
4. Update website status
5. Check PageSpeed reports
6. Add new website
7. Generate summary report
8. Logout

Success: All tasks completed <30 minutes (vs 240 manual)
```

## 📊 EVALUATION INSTRUMENTS

### 📋 QUANTITATIVE MEASUREMENTS

#### Performance Metrics:
```
System Performance:
- Dashboard load time (automated measurement)
- API response distribution (server logs)
- Database query execution time (MySQL profiling)
- System uptime percentage (monitoring tools)

User Efficiency:  
- Daily monitoring time (before/after comparison)
- Task completion rate (>95% target)
- Error rate per session (<5% target)
- Feature adoption rate (>90% target)
```

#### Usage Analytics:
```javascript
// Track user interactions
- Dashboard views + load times
- Feature usage frequency  
- Task completion times
- Error encounters + recovery
```

### 📝 QUALITATIVE ASSESSMENTS

#### TAM Survey (Technology Acceptance Model):
**5-point scale (1=Strongly Disagree, 5=Strongly Agree)**

**Perceived Usefulness (6 questions):**
1. "ITM SCI meningkatkan produktivitas monitoring saya"
2. "ITM SCI membuat monitoring lebih efisien"
3. "ITM SCI membantu selesaikan tugas lebih cepat"
4. "ITM SCI bermanfaat untuk pekerjaan harian"
5. "ITM SCI memberikan value tambah untuk team"
6. "Overall, ITM SCI sangat berguna"

**Perceived Ease of Use (6 questions):**  
1. "Belajar ITM SCI mudah untuk saya"
2. "Interaksi dengan ITM SCI clear + understandable"
3. "ITM SCI mudah untuk mahir menggunakannya"
4. "Navigasi ITM SCI intuitif + user-friendly"  
5. "ITM SCI mudah accomplish monitoring tasks"
6. "Overall, ITM SCI mudah digunakan"

**Target TAM Score:** >4.0/5.0 average

#### SUS Scale (System Usability Scale):
**10 questions standard, alternating positive/negative**
1. "I would like to use ITM SCI frequently"
2. "I found ITM SCI unnecessarily complex"  
3. "I thought ITM SCI was easy to use"
4. "I need technical support to use ITM SCI"
... (10 total questions)

**SUS Scoring:** Formula gives 0-100 score
**Target:** >68 (above average), ideal >80 (excellent)

#### Custom Satisfaction Survey:
```
Efficiency Questions:
- "Berapa menit monitoring sebelum ITM SCI?" 
- "Berapa menit sekarang dengan ITM SCI?"
- "Seberapa puas dengan time savings?" (1-5)

Feature Satisfaction:
- "Domain monitoring effectiveness?" (1-5)
- "OJS Secure usability?" (1-5)  
- "Dashboard clarity?" (1-5)
- "Notification timeliness?" (1-5)

Overall Impact:
- "ITM SCI improve job satisfaction?" (1-5)
- "Would recommend to other organizations?"
- "Most valuable feature untuk daily work?"
- "What improvements needed?"
```

## 📅 TESTING TIMELINE

### 🗓️ TESTING SCHEDULE

#### Development Phase (Week 6-14):
```
Week 6-8: Unit + Integration Testing
- Backend unit tests (PHPUnit)
- Frontend component tests (Jest)  
- API integration testing (Postman)

Week 9-11: System + Security Testing
- End-to-end workflows (Cypress)
- Security vulnerability assessment  
- Performance baseline establishment

Week 12-14: Pre-UAT Preparation
- Load testing implementation
- Bug fixes + optimizations
- Test environment setup
```

#### Formal Testing (Week 15-17):
```
Week 15: System Demonstration
- Stakeholder demo sessions (5 days)
- Initial feedback collection
- Performance validation

Week 16: User Acceptance Testing  
- IT Team UAT (7 users × 2 sessions)
- Management UAT (2 users × 1 session)
- Domain Admin UAT (1 user × 2 sessions)

Week 17: Final Evaluation
- TAM questionnaire administration
- SUS scale assessment
- Performance metrics compilation
- Final improvements
```

## ✅ SUCCESS CRITERIA

### 📊 TESTING SUCCESS THRESHOLDS

#### Technical Acceptance:
| Metric | Threshold | Method |
|--------|-----------|---------|
| **Unit Test Coverage** | >80% | PHPUnit report |
| **API Tests Pass** | >95% | Postman results |  
| **Performance** | <3s load | Load testing |
| **Security** | Zero critical vulns | OWASP scan |
| **Cross-browser** | 100% core functions | Manual testing |

#### User Acceptance:
| Assessment | Threshold | Sample |
|------------|-----------|---------|
| **TAM Score** | >4.0/5.0 | 10 users |
| **SUS Score** | >68 (target >80) | 10 users |
| **Task Success** | >95% completion | UAT sessions |
| **Satisfaction** | >4.0/5.0 | Custom survey |
| **Adoption** | >90% active use | 4-week tracking |

#### Business Impact:
| Metric | Threshold | Period |
|--------|-----------|---------|
| **Time Reduction** | >80% achieved | 4-week comparison |
| **Domain Incidents** | 0 incidents | 6-month target |
| **Detection Speed** | <5 minutes | Real monitoring |
| **ROI** | >500% | Annual calculation |

## 🚨 FAILURE CRITERIA & RECOVERY

### Critical Failures (Project at risk):
- **Security:** Any critical vulnerabilities found
- **Performance:** Consistent >5s dashboard load  
- **User adoption:** <70% willing to use
- **Business impact:** <60% efficiency gain

### Recovery Strategy:
```
If Technical Failure:
- 2-week focused remediation
- Expert consultation if needed
- Scope adjustment if necessary

If User Acceptance Failure:  
- UX redesign + additional training
- Feature simplification
- Extended trial period

If Business Failure:
- Requirements renegotiation  
- Timeline extension
- Alternative success metrics
```

## 📋 TESTING DELIVERABLES

### Reports Required:
- ✅ **Technical Testing Report:** Performance + security + functionality
- ✅ **UAT Summary:** User feedback + task completion analysis  
- ✅ **TAM Assessment:** Technology acceptance analysis
- ✅ **Business Impact Report:** Efficiency + ROI validation
- ✅ **Final Evaluation:** Overall success assessment

### Success Declaration:
**ITM SCI considered successful when:**
- All technical criteria met (performance + security + functionality)
- User acceptance achieved (TAM >4.0, SUS >68, satisfaction >4.0)
- Business targets reached (>80% efficiency, positive ROI)
- Academic standards satisfied (rigorous evaluation + documentation)