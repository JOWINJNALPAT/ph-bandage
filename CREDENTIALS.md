# pH Bandage — Seeded Database Credentials & Details

> All accounts use the password: **`password123`**

---

## 🔐 Admin

| Name | Email | Password | Department |
|------|-------|----------|------------|
| Dr. Admin Raj | admin@hospital.com | password123 | Administration |

---

## 👨‍⚕️ Doctors

| # | Name | Email | Password | Department |
|---|------|-------|----------|------------|
| 1 | Dr. Sarah Johnson | sarah@hospital.com | password123 | Wound Care |
| 2 | Dr. Michael Chen | michael@hospital.com | password123 | Surgery |
| 3 | Dr. Priya Nair | priya@hospital.com | password123 | Dermatology |
| 4 | Dr. James Williams | james@hospital.com | password123 | Orthopaedics |
| 5 | Dr. Ananya Sharma | ananya@hospital.com | password123 | General Medicine |

---

## 👩‍⚕️ Nurses

| # | Name | Email | Password | Department |
|---|------|-------|----------|------------|
| 1 | Emily Davis | emily@hospital.com | password123 | Wound Care |
| 2 | Rose Thomas | rose@hospital.com | password123 | Surgery |
| 3 | Kavya Menon | kavya@hospital.com | password123 | Dermatology |
| 4 | Linda George | linda@hospital.com | password123 | Orthopaedics |
| 5 | Sunita Patel | sunita@hospital.com | password123 | General Medicine |

---

## 🏥 Patients & Assigned Doctors

| Patient ID | Name | Age | Gender | Medical History | Wound Status | Assigned Doctor | Bandage ID | Wound Location |
|------------|------|-----|--------|-----------------|--------------|-----------------|------------|----------------|
| PAT-001 | John Doe | 45 | Male | Post-surgical wound | Active | Dr. Sarah Johnson | BANDAGE-001 | Left foot |
| PAT-002 | Jane Smith | 62 | Female | Diabetic foot ulcer | Active | Dr. Sarah Johnson | BANDAGE-002 | Right foot |
| PAT-003 | Robert Brown | 38 | Male | Burn wound | Active | Dr. Michael Chen | BANDAGE-003 | Abdomen |
| PAT-004 | Mary Wilson | 55 | Female | Pressure sore | Active | Dr. Michael Chen | BANDAGE-004 | Lower back |
| PAT-005 | Carlos Mendez | 29 | Male | Laceration wound | Active | Dr. Priya Nair | BANDAGE-005 | Left arm |
| PAT-006 | Aisha Patel | 71 | Female | Venous leg ulcer | Active | Dr. Priya Nair | BANDAGE-006 | Right leg |
| PAT-007 | David Okafor | 50 | Male | Infected wound | Active | Dr. James Williams | BANDAGE-007 | Right arm |
| PAT-008 | Meera Krishnan | 44 | Female | Post-op wound | Active | Dr. James Williams | BANDAGE-008 | Abdomen |
| PAT-009 | Samuel Lee | 67 | Male | Chronic ulcer | Active | Dr. Ananya Sharma | BANDAGE-009 | Left leg |
| PAT-010 | Fatima Al-Hassan | 33 | Female | Traumatic wound | Active | Dr. Ananya Sharma | BANDAGE-010 | Right shoulder |

---

## 📊 Scan Data Summary

Each bandage has 1–2 scans recorded by nurses. pH color mapping:

| Color | pH Range | Infection Level | Scanned By |
|-------|----------|-----------------|------------|
| 🟡 Yellow | 5.8 | Healthy | Emily Davis |
| 🟢 Green | 6.8 | Mild Risk | Rose Thomas |
| 🔵 Blue | 7.8 | Medium Infection | Kavya Menon |
| 🔷 Dark Blue | 8.8 | High Infection | Linda George |

> **Total scans seeded:** 15 (10 initial + 5 follow-up scans for the first 5 patients)

---

## 🖥️ Application URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |

---

## 🔑 Quick Login Reference

```
Admin   →  admin@hospital.com       / password123
Doctor  →  sarah@hospital.com       / password123
Doctor  →  michael@hospital.com     / password123
Doctor  →  priya@hospital.com       / password123
Doctor  →  james@hospital.com       / password123
Doctor  →  ananya@hospital.com      / password123
Nurse   →  emily@hospital.com       / password123
Nurse   →  rose@hospital.com        / password123
Nurse   →  kavya@hospital.com       / password123
Nurse   →  linda@hospital.com       / password123
Nurse   →  sunita@hospital.com      / password123
```
