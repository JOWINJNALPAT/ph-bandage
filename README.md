# 🏥 pH-based Smart Bandage Infection Detection System

A hospital-grade full-stack web application for detecting wound infections through smart bandage color analysis, pH measurement, and trend visualization.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Color-to-pH-to-Infection Mapping](#color-to-ph-to-infection-mapping)
- [Database Schema](#database-schema)

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with 7-day token expiry
- Bcrypt password hashing with salt
- Role-based access control (RBAC)
- Protected API endpoints
- Secure session management

### 👩‍⚕️ Nurse Dashboard
- Quick bandage scan submission
- Camera image capture or manual upload
- Automatic color detection from images
- Manual color selection (yellow/green/blue/dark blue)
- Bandage ID entry or QR code scanning
- Simple, hospital-optimized UI
- Read-only scan history

### 👨‍⚕️ Doctor Dashboard
- View assigned patients
- Track latest infection levels
- View pH trends over time with interactive graphs
- Access scan history with timestamps
- Add medical notes and observations
- Mark wound status (Active/Healing/Healed)
- View nurse scan logs (who scanned & when)

### 👨‍💼 Admin Dashboard
- User management (create, activate/deactivate)
- Patient assignment to doctors
- Hospital-level analytics
- Infection statistics
- User role distribution
- Monitor system usage

### 🔬 Smart Detection System
- RGB to color conversion
- Color to pH value mapping
- pH-based infection level classification
- Automatic alert generation for infections
- Trend analysis and visualization

## 🛠️ Tech Stack

### Frontend
- **React.js** 18.2 - UI framework
- **React Router** 6 - Navigation
- **Tailwind CSS** 3.3 - Styling
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **jsPDF/html2canvas** - Report generation

### Backend
- **Node.js** - Runtime
- **Express.js** 4.18 - Server framework
- **MongoDB** - Database
- **Mongoose** 7 - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Sharp** - Image processing

## 📁 Project Structure

```
ph-bandage/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Bandage.js
│   │   └── Scan.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── scanRoutes.js
│   │   ├── patientRoutes.js
│   │   └── adminRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── scanController.js
│   │   ├── patientController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── utils/
│   │   ├── colorAnalysis.js
│   │   └── imageProcessor.js
│   ├── scripts/
│   │   └── seedData.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   ├── NurseDashboard.js
    │   │   ├── DoctorDashboard.js
    │   │   ├── PatientDetails.js
    │   │   └── AdminDashboard.js
    │   ├── components/
    │   ├── hooks/
    │   │   └── useAuth.js
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── helpers.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── public/
    │   └── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── .gitignore
```

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- MongoDB 4.4+ (local or cloud)
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/ph-bandage
# JWT_SECRET=your_secret_key_here_change_in_production
# PORT=5000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
# REACT_APP_API_URL=http://localhost:5000/api
```

## ⚙️ Configuration

### Backend .env File
```env
MONGODB_URI=mongodb://localhost:27017/ph-bandage
JWT_SECRET=your_super_secret_key_here_make_it_long_and_random
PORT=5000
NODE_ENV=development
```

### Frontend Environment (Optional)
Create `.env` in frontend folder:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Start MongoDB
```bash
# On Windows
# MongoDB should be running as a service or start manually

# On macOS
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### Start Backend Server
```bash
cd backend

# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Seed sample data
npm run seed
```
Backend will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend

# Start React development server
npm start
```
Frontend will run on `http://localhost:3000`

## 📡 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@hospital.com",
  "password": "password123",
  "role": "nurse",
  "department": "Wound Care"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@hospital.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@hospital.com",
    "role": "nurse"
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}
```

### Scan Endpoints

#### Submit Scan
```
POST /api/scans/submit
Content-Type: multipart/form-data
Authorization: Bearer {token}

FormData:
  - bandageId: "BANDAGE-001"
  - image: <file> (optional)
  - color: "Yellow" (if no image)
```

#### Get Scan History
```
GET /api/scans/history/:patientId
Authorization: Bearer {token}
```

#### Get Latest Scan
```
GET /api/scans/latest/:patientId
Authorization: Bearer {token}
```

### Patient Endpoints

#### Create Patient
```
POST /api/patients
Authorization: Bearer {token}
Role: admin

{
  "name": "Jane Doe",
  "age": 50,
  "gender": "Female",
  "patientId": "PAT-001",
  "assignedDoctor": "doctor_user_id",
  "medicalHistory": "Diabetes"
}
```

#### Get My Patients
```
GET /api/patients/my-patients
Authorization: Bearer {token}
Role: doctor
```

#### Get Patient Details
```
GET /api/patients/:patientId
Authorization: Bearer {token}
Role: doctor, admin
```

#### Update Patient
```
PUT /api/patients/:patientId
Authorization: Bearer {token}
Role: doctor, admin

{
  "woundStatus": "Healing",
  "medicalNotes": "Patient responding well to treatment"
}
```

### Admin Endpoints

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer {token}
Role: admin
```

#### Create User
```
POST /api/admin/users
Authorization: Bearer {token}
Role: admin
```

#### Get Analytics
```
GET /api/admin/analytics
Authorization: Bearer {token}
Role: admin
```

## 📖 Usage Guide

### For Nurses

1. **Login** with nurse credentials
2. **Enter Bandage ID** (from patient chart or QR code)
3. **Capture/Upload Image** of the bandage OR **select color** manually
4. **Submit Scan** - System automatically detects color and calculates infection level
5. **System confirms** scan submission - Doctor gets notified automatically

**Key Points:**
- Keep the interface simple and fast
- Take clear, well-lit photos of bandages
- Enter accurate bandage IDs
- Do NOT diagnose - that's the doctor's job

### For Doctors

1. **Login** to access patient dashboard
2. **Select Patient** to view details
3. **Review pH Trend Graph** over time
4. **Check Scan History** with timestamps and nurse names
5. **Add Medical Notes** about wound status and treatment
6. **Mark Wound Status** as Active/Healing/Healed
7. **Monitor Alerts** for medium/high infection levels

**Key Features:**
- Visual pH trend analysis
- Historical scan data
- Nurse audit trail
- Medical notes integration
- Status tracking

### For Admins

1. **Login** to admin dashboard
2. **View Analytics** - Total users, patients, scans, infections
3. **Manage Users** - Create/activate/deactivate staff
4. **Assign Patients** to doctors
5. **Monitor System Health** - Role distribution, infection statistics

## 🧬 Color-to-pH-to-Infection Mapping

The system uses a validated color-to-pH mapping based on smart bandage technology:

| Color | pH Range | Infection Level | Details |
|-------|----------|-----------------|---------|
| 🟡 Yellow | 5.5 - 6.5 | Healthy | Acidic environment, no infection risk |
| 🟢 Green | 6.6 - 7.2 | Mild Risk | Neutral pH, slight inflammation |
| 🔵 Blue | 7.3 - 8.0 | Medium Infection | Alkaline shift, moderate bacterial growth |
| 🟦 Dark Blue | > 8.0 | High Infection | Highly alkaline, severe infection - needs urgent attention |

### Color Detection Algorithm
1. Analyze image RGB values
2. Calculate dominant color
3. Map to infection level
4. Generate automatic alerts for high-risk cases

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (nurse/doctor/admin),
  department: String,
  isActive: Boolean,
  timestamps: true
}
```

### Patient Model
```javascript
{
  name: String,
  age: Number,
  gender: String,
  patientId: String (unique),
  assignedDoctor: ObjectId (ref User),
  medicalHistory: String,
  woundStatus: String (Active/Healing/Healed),
  isActive: Boolean,
  timestamps: true
}
```

### Bandage Model
```javascript
{
  bandageId: String (unique),
  patientId: ObjectId (ref Patient),
  appliedDate: Date,
  removedDate: Date,
  woundLocation: String,
  initialNotes: String,
  isActive: Boolean,
  timestamps: true
}
```

### Scan Model
```javascript
{
  bandageId: ObjectId (ref Bandage),
  patientId: ObjectId (ref Patient),
  nurseId: ObjectId (ref User),
  imageUrl: String,
  colorDetected: String,
  rgbValue: { r, g, b },
  phValue: Number,
  infectionLevel: String,
  notes: String,
  timestamp: Date,
  timestamps: true
}
```

## 🔒 Security Features

- ✅ JWT authentication with expiry
- ✅ Bcrypt password hashing (10 salt rounds)
- ✅ Role-based access control
- ✅ Protected API endpoints
- ✅ CORS configuration
- ✅ Input validation
- ✅ Error handling
- ✅ SQL injection prevention (using Mongoose)

## 🧪 Testing the System

### With Seed Data
```bash
# In backend directory
npm run seed

# Test accounts created:
# Admin:  admin@hospital.com / password123
# Doctor: sarah@hospital.com / password123
# Nurse:  emily@hospital.com / password123
```

### Manual Testing Flow
1. Register a new nurse account
2. Have a doctor register
3. Admin creates a patient and assigns to doctor
4. Nurse submits a scan
5. Doctor views patient and sees infection level
6. Admin checks analytics

## 📊 Performance Considerations

- Image uploads limited to 10MB
- Efficient MongoDB queries with indexing
- JWT token validation on each protected route
- Client-side caching of authentication tokens
- Responsive image processing with Sharp

## 🚨 Troubleshooting

### MongoDB Connection Error
```
Solution: Ensure MongoDB is running
Mac: brew services start mongodb-community
Windows: Check Services > MongoDB
```

### Port Already in Use
```
Solution: Change PORT in .env or kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS Issues
```
Solution: Ensure frontend URL matches CORS origin in server.js
Default: http://localhost:3000
```

### Image Upload Fails
```
Solution: Check uploads/ folder permissions
Ensure path exists: backend/uploads/
```

## 📞 Support & Documentation

For issues or questions:
1. Check error messages in browser console
2. Review backend logs in terminal
3. Verify .env configuration
4. Ensure all dependencies are installed

## 📝 License

This project is for educational and healthcare purposes.

---

**Built with ❤️ for healthcare professionals**
