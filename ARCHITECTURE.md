# 🏥 pH BANDAGE SYSTEM - VISUAL PROJECT OVERVIEW

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React.js)                          │
│                   Port 3000                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Login     │  │  Register    │  │  Dashboard   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                              │                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────▼──────────────┐  │
│  │Nurse         │  │ Doctor       │  │ Admin Dashboard    │  │
│  │Scan Submit   │  │ Patient View │  │ Analytics          │  │
│  │             │  │ Trends       │  │ User Management    │  │
│  │             │  │ Notes        │  │                    │  │
│  └──────────────┘  └──────────────┘  └────────────────────┘  │
│                                                                 │
│         ⬇️  Axios HTTP Client                                 │
└──────────────┬────────────────────────────────────────────────┘
               │
               │ API Calls (JSON)
               │
┌──────────────▼────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                        │
│                   Port 5000                                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Routes         Controllers        Models                    │
│  ┌──────────┐   ┌──────────┐     ┌──────────┐              │
│  │/auth     │──→│Auth      │────→│ User     │              │
│  │/scans    │   │Scan      │     │ Patient  │              │
│  │/patients │   │Patient   │     │ Bandage  │              │
│  │/admin    │   │Admin     │     │ Scan     │              │
│  └──────────┘   └──────────┘     └──────────┘              │
│                                                               │
│  Utils                                                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ • colorAnalysis.js - Color→pH→Infection Logic       │    │
│  │ • imageProcessor.js - Sharp Image Processing        │    │
│  │ • authMiddleware.js - JWT Verification              │    │
│  │ • roleMiddleware.js - RBAC Enforcement              │    │
│  └─────────────────────────────────────────────────────┘    │
│                        ⬇️                                     │
└──────────────┬────────────────────────────────────────────────┘
               │
               │ Mongoose ODM
               │
┌──────────────▼────────────────────────────────────────────────┐
│              DATABASE (MongoDB)                               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Collections:                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Users    │  │ Patients │  │ Bandages │  │  Scans   │   │
│  │          │  │          │  │          │  │          │   │
│  │• email   │  │• name    │  │• location│  │• color   │   │
│  │• password│  │• age     │  │• applied │  │• phValue │   │
│  │• role    │  │• doctor  │  │• status  │  │• infection   │
│  │• dept    │  │• status  │  │          │  │• timestamp   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
NURSE WORKFLOW:
──────────────
    1. Login
       ↓
    2. Enter Bandage ID
       ↓
    3. Upload Image OR Select Color
       ↓
    4. Submit Scan
       ↓
       └─→ Backend:
           ├─ Validate input
           ├─ Extract/Detect color
           ├─ Convert RGB→Color
           ├─ Convert Color→pH
           ├─ Classify pH→Infection
           └─ Store in Database
                ↓
    5. Get Result (Infection Level)
       ↓
    6. Scan Complete ✅

DOCTOR WORKFLOW:
───────────────
    1. Login
       ↓
    2. View Patient List
       ↓
    3. Select Patient
       ↓
       └─→ Backend:
           ├─ Fetch patient data
           ├─ Fetch scan history
           ├─ Calculate pH trends
           └─ Return all data
                ↓
    4. View:
       ├─ Patient info
       ├─ Latest infection level
       ├─ pH trend graph
       ├─ Scan history
       └─ Bandage images
           ↓
    5. Add Notes
       ↓
    6. Mark Status
       ↓
    7. Analysis Complete ✅

ADMIN WORKFLOW:
──────────────
    1. Login
       ↓
    2. Dashboard
       ├─ Create User
       │  └─→ Backend creates user account
       ├─ View Users
       │  └─→ Backend returns user list
       ├─ View Analytics
       │  └─→ Backend calculates statistics
       └─ Manage System
          └─→ Backend processes admin requests
           ↓
    3. System Management Complete ✅
```

---

## 🎨 User Interface Hierarchy

```
PUBLIC PAGES:
├── Login Page
│   ├── Email input
│   ├── Password input
│   ├── Login button
│   └── Register link
│
└── Register Page
    ├── Name input
    ├── Email input
    ├── Password input
    ├── Role selector
    ├── Department input
    ├── Register button
    └── Login link

NURSE DASHBOARD:
├── Header (Logo, User Name, Logout)
├── Main Content:
│   ├── Scan Form
│   │   ├── Bandage ID input
│   │   ├── Image upload
│   │   ├── Color selector (4 options)
│   │   └── Submit button
│   └── Color Guide (reference)

DOCTOR DASHBOARD:
├── Header (Logo, User Name, Logout)
├── Patient List:
│   ├── Patient Card 1
│   │   ├── Name
│   │   ├── ID
│   │   ├── Status badge
│   │   └── View Details button
│   └── Patient Card 2...

PATIENT DETAILS:
├── Header (Back button, Patient name, Logout)
├── Patient Information Card:
│   ├── Name
│   ├── Age
│   ├── Gender
│   └── Wound Status
├── pH Trend Graph (Recharts)
├── Medical Notes Section:
│   ├── Notes textarea
│   └── Save button
└── Scan History:
    ├── Scan 1
    │   ├── Timestamp
    │   ├── Status badge
    │   ├── Color
    │   ├── pH value
    │   ├── Nurse name
    │   └── Image preview
    └── Scan 2...

ADMIN DASHBOARD:
├── Header (Logo, Admin name, Logout)
├── Tabs:
│   ├── Analytics Tab:
│   │   ├── Total Users card
│   │   ├── Total Patients card
│   │   ├── Total Scans card
│   │   ├── High Infections card
│   │   ├── Infection Stats table
│   │   └── Users by Role table
│   │
│   ├── Users Tab:
│   │   └── Users table:
│   │       ├── Name
│   │       ├── Email
│   │       ├── Role
│   │       ├── Department
│   │       └── Status
│   │
│   └── Create User Tab:
│       ├── Name input
│       ├── Email input
│       ├── Password input
│       ├── Role selector
│       ├── Department input
│       └── Create button
```

---

## 🔐 Authentication & Authorization Flow

```
REGISTRATION:
──────────────
User fills form
    ↓
POST /api/auth/register
    ↓
Backend validates input
    ↓
Backend hashes password (Bcrypt)
    ↓
Backend saves to MongoDB
    ↓
Backend generates JWT token
    ↓
Return token + user info
    ↓
Frontend stores token in localStorage
    ↓
Redirect to dashboard
    ↓
✅ User registered and logged in

LOGIN:
──────
User enters credentials
    ↓
POST /api/auth/login
    ↓
Backend finds user by email
    ↓
Backend compares password (Bcrypt)
    ↓
Backend generates JWT token
    ↓
Return token + user info
    ↓
Frontend stores token in localStorage
    ↓
Redirect to role-based dashboard
    ↓
✅ User logged in

PROTECTED ROUTE:
────────────────
User tries to access protected page
    ↓
Frontend checks token in localStorage
    ├─ If missing: Redirect to /login
    └─ If exists: Include in Authorization header
        ↓
Backend receives request
    ↓
Middleware extracts token from header
    ↓
Middleware verifies token signature
    ├─ If invalid: Return 401 Unauthorized
    └─ If valid: Extract user info
        ↓
Middleware checks user role
    ├─ If not allowed: Return 403 Forbidden
    └─ If allowed: Pass to controller
        ↓
Controller processes request
    ↓
Return response
    ↓
✅ Access granted
```

---

## 🧬 Color Detection & Infection Mapping

```
IMAGE INPUT:
    ↓
Sharp (Image Processing):
├─ Resize to 100×100
├─ Extract RGB values
├─ Calculate average
└─ Return {r, g, b}
    ↓
RGB → COLOR:
├─ Analyze r, g, b dominance
├─ Map to color category
└─ Return color name
    ↓
COLOR → pH:
├─ Look up pH range for color
├─ Return midpoint pH
└─ Example: Yellow (5.5-6.5) → 6.0
    ↓
pH → INFECTION:
├─ 5.5-6.5   → Healthy (🟡 Yellow)
├─ 6.6-7.2   → Mild Risk (🟢 Green)
├─ 7.3-8.0   → Medium Infection (🔵 Blue)
└─ 8.1-14.0  → High Infection (🟦 Dark Blue)
    ↓
RESULT:
    {
      color: "Yellow",
      phValue: 6.0,
      infectionLevel: "Healthy"
    }
```

---

## 📁 File Organization

```
BACKEND STRUCTURE:
backend/
├── models/ (4 files)
│   ├── User.js          (Schema + methods)
│   ├── Patient.js       (Schema + relations)
│   ├── Bandage.js       (Schema + tracking)
│   └── Scan.js          (Schema + results)
│
├── routes/ (4 files)
│   ├── authRoutes.js    (Auth endpoints)
│   ├── scanRoutes.js    (Scan endpoints)
│   ├── patientRoutes.js (Patient endpoints)
│   └── adminRoutes.js   (Admin endpoints)
│
├── controllers/ (4 files)
│   ├── authController.js    (Auth logic)
│   ├── scanController.js    (Scan processing)
│   ├── patientController.js (Patient CRUD)
│   └── adminController.js   (Admin logic)
│
├── middleware/ (2 files)
│   ├── authMiddleware.js    (JWT verification)
│   └── roleMiddleware.js    (RBAC enforcement)
│
├── utils/ (2 files)
│   ├── colorAnalysis.js     (Color→pH logic)
│   └── imageProcessor.js    (Image processing)
│
├── scripts/
│   └── seedData.js      (Database seeding)
│
├── uploads/             (Image storage)
├── server.js           (Main server)
├── package.json
├── .env.example
└── .gitignore

FRONTEND STRUCTURE:
frontend/
├── src/
│   ├── pages/ (6 files)
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── NurseDashboard.js
│   │   ├── DoctorDashboard.js
│   │   ├── PatientDetails.js
│   │   └── AdminDashboard.js
│   │
│   ├── components/ (Ready for expansion)
│   │
│   ├── hooks/ (1 file)
│   │   └── useAuth.js (Auth state hook)
│   │
│   ├── utils/ (2 files)
│   │   ├── api.js (API client)
│   │   └── helpers.js (Utilities)
│   │
│   ├── App.js       (Routing)
│   ├── index.js     (Entry point)
│   └── index.css    (Global styles)
│
├── public/
│   └── index.html
│
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env.example
└── .gitignore

DOCUMENTATION:
├── README.md                    (2000+ words)
├── QUICKSTART.md               (400 words)
├── API.md                      (1500+ words)
├── DEPLOYMENT.md               (1000 words)
├── PROJECT_SUMMARY.md          (2000 words)
├── IMPLEMENTATION_CHECKLIST.md (2000 words)
├── FILE_REFERENCE.md           (Reference)
├── INDEX.md                    (Navigation)
├── DELIVERY_SUMMARY.md         (Overview)
├── setup.sh                    (Unix script)
├── setup.bat                   (Windows script)
└── This file
```

---

## 🌊 Component Data Flow

```
App.js (Main)
    ├── Routes
    ├── Protected Routes
    └── Role-based redirects
        ↓
    ├─→ LoginPage
    │   └── useAuth hook
    │       └── authAPI.login()
    │           └── localStorage token
    │
    ├─→ NurseDashboard
    │   ├── useAuth hook (verify role)
    │   └── scanAPI.submitScan()
    │       ├── Image upload (Multer)
    │       ├── Color detection (Sharp)
    │       ├── pH calculation
    │       └── Database storage
    │
    ├─→ DoctorDashboard
    │   ├── useAuth hook (verify role)
    │   ├── patientAPI.getMyPatients()
    │   └── Patient cards with links
    │
    ├─→ PatientDetails
    │   ├── useAuth hook (verify role)
    │   ├── patientAPI.getPatientDetails()
    │   ├── scanAPI.getScanHistory()
    │   ├── Recharts trend graph
    │   ├── Scan history list
    │   └── patientAPI.updatePatient()
    │
    └─→ AdminDashboard
        ├── useAuth hook (verify role)
        ├── adminAPI.getAnalytics()
        ├── adminAPI.getAllUsers()
        ├── authAPI.register()
        └── adminAPI.updateUserStatus()
```

---

## ✨ Feature Matrix

```
                    Nurse   Doctor  Admin   System
─────────────────────────────────────────────────
Scan Submission      ✅
View Scans                   ✅      ✅      ✅
View Patients                ✅      ✅
Add Notes                    ✅
View Analytics                       ✅
Manage Users                         ✅
Color Detection                              ✅
pH Calculation                               ✅
Infection Detection                          ✅
Trend Analysis               ✅      ✅      ✅
Audit Trail                          ✅      ✅
Authentication      ✅      ✅      ✅      ✅
Authorization       ✅      ✅      ✅      ✅
```

---

## 🔗 API Endpoint Map

```
/api/
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── GET /me (protected)
│
├── /scans
│   ├── POST /submit (nurse, protected)
│   ├── GET /history/:patientId (doctor, protected)
│   └── GET /latest/:patientId (doctor, protected)
│
├── /patients
│   ├── POST / (admin, protected)
│   ├── GET /my-patients (doctor, protected)
│   ├── GET /:patientId (doctor/admin, protected)
│   └── PUT /:patientId (doctor/admin, protected)
│
└── /admin
    ├── GET /users (admin, protected)
    ├── POST /users (admin, protected)
    ├── PUT /users/:userId (admin, protected)
    └── GET /analytics (admin, protected)
```

---

## 🎯 Deployment Architecture

```
DEVELOPMENT:
────────────
    Browser (localhost:3000)
          ↕️ HTTP
    React Dev Server
          ↕️ Proxy
    Backend (localhost:5000)
          ↕️ MongoDB
    MongoDB (localhost:27017)

PRODUCTION:
───────────
Option 1 - Heroku + Netlify:
    CDN (Static assets)
          ↕️ HTTPS
    Netlify (Frontend)
          ↕️ HTTPS
    Heroku (Backend)
          ↕️ TLS
    MongoDB Atlas (Cloud Database)

Option 2 - Docker + AWS:
    CloudFront CDN
          ↕️ HTTPS
    ECS (Frontend Container)
          ↕️ HTTPS
    ECS (Backend Container)
          ↕️ TLS
    RDS (Database)

Option 3 - AWS EC2:
    CloudFront (Static assets)
          ↕️ HTTPS
    Route53 (DNS)
          ↕️ HTTPS
    EC2 (Full Stack)
          ↕️ TLS
    RDS (Database)
```

---

## 📊 Database Relationships

```
Users (1) ──────→ (Many) Patients
 │
 ├─ Doctors assigned to many patients
 ├─ Nurses create many scans
 └─ Admins manage all

Patients (1) ──────→ (Many) Bandages
 │
 └─ Each patient has multiple bandages

Bandages (1) ──────→ (Many) Scans
 │
 └─ Each bandage has multiple scans

Scans contains:
 ├─ Reference to Bandage
 ├─ Reference to Patient
 ├─ Reference to Nurse (creator)
 ├─ Color data
 ├─ pH value
 ├─ Infection level
 └─ Timestamp
```

---

**This visual guide helps you understand the complete architecture and flow of the pH Bandage System!**

**For more details, see the accompanying documentation files.**
