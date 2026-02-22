# 📡 API Documentation

Complete API reference for pH Bandage System

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 🔐 Auth Endpoints

### Register User
**POST** `/auth/register`

Request:
```json
{
  "name": "John Nurse",
  "email": "john@hospital.com",
  "password": "password123",
  "role": "nurse",
  "department": "Wound Care"
}
```

Response (201):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Nurse",
    "email": "john@hospital.com",
    "role": "nurse"
  }
}
```

---

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "john@hospital.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Nurse",
    "email": "john@hospital.com",
    "role": "nurse"
  }
}
```

---

### Get Current User
**GET** `/auth/me`

Headers: `Authorization: Bearer {token}`

Response (200):
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "name": "John Nurse",
  "email": "john@hospital.com",
  "role": "nurse",
  "department": "Wound Care",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

## 🩹 Scan Endpoints

### Submit Scan (Nurse Only)
**POST** `/scans/submit`

Headers:
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

Form Data:
```
bandageId: "BANDAGE-001"
color: "Yellow" (if no image)
image: <binary file> (optional)
```

Response (201):
```json
{
  "message": "Scan submitted successfully",
  "scan": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "bandageId": "BANDAGE-001",
    "color": "Yellow",
    "phValue": 6.0,
    "infectionLevel": "Healthy",
    "timestamp": "2024-01-15T14:30:00Z"
  }
}
```

Error Response (400):
```json
{
  "message": "Either image upload or color selection is required"
}
```

---

### Get Scan History
**GET** `/scans/history/:patientId`

Headers: `Authorization: Bearer {token}`

Required Roles: `doctor`, `admin`

Response (200):
```json
{
  "message": "Scan history retrieved",
  "patientName": "John Doe",
  "scans": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "bandageId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "patientId": "65a1b2c3d4e5f6g7h8i9j0k3",
      "nurseId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
        "name": "Emily Brown",
        "email": "emily@hospital.com"
      },
      "colorDetected": "Yellow",
      "phValue": 6.0,
      "infectionLevel": "Healthy",
      "timestamp": "2024-01-15T14:30:00Z"
    }
  ]
}
```

---

### Get Latest Scan
**GET** `/scans/latest/:patientId`

Headers: `Authorization: Bearer {token}`

Required Roles: `doctor`, `admin`

Response (200):
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "bandageId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "patientId": "65a1b2c3d4e5f6g7h8i9j0k3",
  "nurseId": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
    "name": "Emily Brown",
    "email": "emily@hospital.com"
  },
  "colorDetected": "Blue",
  "phValue": 7.6,
  "infectionLevel": "Medium Infection",
  "timestamp": "2024-01-15T16:45:00Z"
}
```

---

## 👥 Patient Endpoints

### Create Patient (Admin Only)
**POST** `/patients`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "name": "Jane Doe",
  "age": 55,
  "gender": "Female",
  "patientId": "PAT-002",
  "assignedDoctor": "65a1b2c3d4e5f6g7h8i9j0k1",
  "medicalHistory": "Diabetes Type 2"
}
```

Response (201):
```json
{
  "message": "Patient created successfully",
  "patient": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Jane Doe",
    "age": 55,
    "gender": "Female",
    "patientId": "PAT-002",
    "assignedDoctor": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Dr. Sarah Johnson",
      "email": "sarah@hospital.com"
    },
    "medicalHistory": "Diabetes Type 2",
    "woundStatus": "Active"
  }
}
```

---

### Get My Patients (Doctor Only)
**GET** `/patients/my-patients`

Headers: `Authorization: Bearer {token}`

Response (200):
```json
{
  "message": "Patients retrieved",
  "patients": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "age": 65,
      "gender": "Male",
      "patientId": "PAT-001",
      "medicalHistory": "Diabetes Type 2, Hypertension",
      "woundStatus": "Active"
    }
  ]
}
```

---

### Get Patient Details
**GET** `/patients/:patientId`

Headers: `Authorization: Bearer {token}`

Required Roles: `doctor`, `admin`

Response (200):
```json
{
  "patient": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "age": 65,
    "gender": "Male",
    "patientId": "PAT-001",
    "assignedDoctor": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Dr. Sarah Johnson",
      "email": "sarah@hospital.com"
    },
    "medicalHistory": "Diabetes Type 2, Hypertension",
    "woundStatus": "Active"
  },
  "latestScan": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "colorDetected": "Blue",
    "phValue": 7.6,
    "infectionLevel": "Medium Infection",
    "timestamp": "2024-01-15T16:45:00Z"
  }
}
```

---

### Update Patient
**PUT** `/patients/:patientId`

Headers: `Authorization: Bearer {token}`

Required Roles: `doctor`, `admin`

Request:
```json
{
  "woundStatus": "Healing",
  "medicalNotes": "Patient responding well to antibiotics"
}
```

Response (200):
```json
{
  "message": "Patient updated successfully",
  "patient": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "woundStatus": "Healing",
    "medicalHistory": "Patient responding well to antibiotics"
  }
}
```

---

## 👨‍💼 Admin Endpoints

### Get All Users (Admin Only)
**GET** `/admin/users`

Headers: `Authorization: Bearer {token}`

Response (200):
```json
{
  "message": "Users retrieved",
  "users": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Admin User",
      "email": "admin@hospital.com",
      "role": "admin",
      "department": "Administration",
      "isActive": true
    },
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Dr. Sarah Johnson",
      "email": "sarah@hospital.com",
      "role": "doctor",
      "department": "Wound Care Unit",
      "isActive": true
    }
  ]
}
```

---

### Create User (Admin Only)
**POST** `/admin/users`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "name": "New Doctor",
  "email": "newdoc@hospital.com",
  "password": "password123",
  "role": "doctor",
  "department": "ICU"
}
```

Response (201):
```json
{
  "message": "User created successfully",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "New Doctor",
    "email": "newdoc@hospital.com",
    "role": "doctor"
  }
}
```

---

### Update User Status (Admin Only)
**PUT** `/admin/users/:userId`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "isActive": false
}
```

Response (200):
```json
{
  "message": "User status updated",
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Nurse",
    "email": "john@hospital.com",
    "role": "nurse",
    "isActive": false
  }
}
```

---

### Get Analytics (Admin Only)
**GET** `/admin/analytics`

Headers: `Authorization: Bearer {token}`

Response (200):
```json
{
  "message": "Analytics retrieved",
  "totalUsers": 8,
  "totalPatients": 15,
  "totalScans": 47,
  "infectionStats": [
    {
      "_id": "Healthy",
      "count": 20
    },
    {
      "_id": "Mild Risk",
      "count": 12
    },
    {
      "_id": "Medium Infection",
      "count": 10
    },
    {
      "_id": "High Infection",
      "count": 5
    }
  ],
  "usersByRole": [
    {
      "_id": "nurse",
      "count": 4
    },
    {
      "_id": "doctor",
      "count": 3
    },
    {
      "_id": "admin",
      "count": 1
    }
  ]
}
```

---

## ❌ Error Responses

### Unauthorized (401)
```json
{
  "message": "Invalid credentials"
}
```

### Forbidden (403)
```json
{
  "message": "Access denied. Insufficient permissions."
}
```

### Not Found (404)
```json
{
  "message": "Patient not found"
}
```

### Bad Request (400)
```json
{
  "message": "Please provide all required fields"
}
```

### Server Error (500)
```json
{
  "message": "Server error",
  "error": "Error details here"
}
```

---

## 🧪 Testing with cURL

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"emily@hospital.com","password":"password123"}'
```

### Test Submit Scan
```bash
curl -X POST http://localhost:5000/api/scans/submit \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "bandageId=BANDAGE-001" \
  -F "color=Yellow"
```

### Test Get Patients
```bash
curl -X GET http://localhost:5000/api/patients/my-patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📋 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

**Last Updated:** January 2024
