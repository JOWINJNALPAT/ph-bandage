require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Bandage = require('../models/Bandage');
const Scan = require('../models/Scan');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ph-bandage';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('📦 Connected to MongoDB');

  // Clear existing data
  await Scan.deleteMany({});
  await Bandage.deleteMany({});
  await Patient.deleteMany({});
  await User.deleteMany({});
  console.log('🗑️  Cleared existing data');

  const salt = await bcrypt.genSalt(10);
  const hash = (pw) => bcrypt.hash(pw, salt);

  // ── 1 Admin ──────────────────────────────────────────────
  const admin = await User.create({
    name: 'Dr. Admin Raj',
    email: 'admin@hospital.com',
    password: await hash('password123'),
    role: 'admin',
    department: 'Administration',
  });

  // ── 5 Doctors ────────────────────────────────────────────
  const doctorData = [
    { name: 'Dr. Sarah Johnson', email: 'sarah@hospital.com', department: 'Wound Care' },
    { name: 'Dr. Michael Chen', email: 'michael@hospital.com', department: 'Surgery' },
    { name: 'Dr. Priya Nair', email: 'priya@hospital.com', department: 'Dermatology' },
    { name: 'Dr. James Williams', email: 'james@hospital.com', department: 'Orthopaedics' },
    { name: 'Dr. Ananya Sharma', email: 'ananya@hospital.com', department: 'General Medicine' },
  ];

  const doctors = await User.insertMany(
    await Promise.all(doctorData.map(async (d) => ({
      ...d,
      password: await hash('password123'),
      role: 'doctor',
    })))
  );

  // ── 5 Nurses ─────────────────────────────────────────────
  const nurseData = [
    { name: 'Emily Davis', email: 'emily@hospital.com', department: 'Wound Care' },
    { name: 'Rose Thomas', email: 'rose@hospital.com', department: 'Surgery' },
    { name: 'Kavya Menon', email: 'kavya@hospital.com', department: 'Dermatology' },
    { name: 'Linda George', email: 'linda@hospital.com', department: 'Orthopaedics' },
    { name: 'Sunita Patel', email: 'sunita@hospital.com', department: 'General Medicine' },
  ];

  const nurses = await User.insertMany(
    await Promise.all(nurseData.map(async (n) => ({
      ...n,
      password: await hash('password123'),
      role: 'nurse',
    })))
  );

  console.log('👤 Created 1 admin, 5 doctors, 5 nurses');

  // ── 10 Patients (2 per doctor) ───────────────────────────
  const patientRecords = [
    { name: 'John Doe', age: 45, gender: 'Male', ward: 'Ward A', diagnosis: 'Post-surgical wound', doctorIndex: 0 },
    { name: 'Jane Smith', age: 62, gender: 'Female', ward: 'Ward B', diagnosis: 'Diabetic foot ulcer', doctorIndex: 0 },
    { name: 'Robert Brown', age: 38, gender: 'Male', ward: 'Ward C', diagnosis: 'Burn wound', doctorIndex: 1 },
    { name: 'Mary Wilson', age: 55, gender: 'Female', ward: 'Ward A', diagnosis: 'Pressure sore', doctorIndex: 1 },
    { name: 'Carlos Mendez', age: 29, gender: 'Male', ward: 'Ward D', diagnosis: 'Laceration wound', doctorIndex: 2 },
    { name: 'Aisha Patel', age: 71, gender: 'Female', ward: 'Ward B', diagnosis: 'Venous leg ulcer', doctorIndex: 2 },
    { name: 'David Okafor', age: 50, gender: 'Male', ward: 'Ward C', diagnosis: 'Infected wound', doctorIndex: 3 },
    { name: 'Meera Krishnan', age: 44, gender: 'Female', ward: 'Ward A', diagnosis: 'Post-op wound', doctorIndex: 3 },
    { name: 'Samuel Lee', age: 67, gender: 'Male', ward: 'Ward D', diagnosis: 'Chronic ulcer', doctorIndex: 4 },
    { name: 'Fatima Al-Hassan', age: 33, gender: 'Female', ward: 'Ward B', diagnosis: 'Traumatic wound', doctorIndex: 4 },
  ];

  const patients = await Patient.insertMany(
    patientRecords.map((p) => ({
      name: p.name,
      age: p.age,
      gender: p.gender,
      ward: p.ward,
      diagnosis: p.diagnosis,
      doctorId: doctors[p.doctorIndex]._id,
    }))
  );

  console.log('🏥 Created 10 patients (2 per doctor)');

  // ── Bandages (1 per patient) ─────────────────────────────
  const bandages = await Bandage.insertMany(
    patients.map((p, i) => ({
      bandageId: `BANDAGE-${String(i + 1).padStart(3, '0')}`,
      patientId: p._id,
      type: 'pH Sensitive Strip',
      appliedDate: new Date(),
      active: true,
    }))
  );

  console.log('🩹 Created 10 bandages');

  // ── Sample Scans (1–2 per bandage) ───────────────────────
  const colors = ['Yellow', 'Green', 'Blue', 'Dark Blue'];
  const phMap = { Yellow: 5.8, Green: 6.8, Blue: 7.8, 'Dark Blue': 8.8 };
  const lvlMap = { Yellow: 'Healthy', Green: 'Mild Risk', Blue: 'Medium Infection', 'Dark Blue': 'High Infection' };

  const scans = [];
  for (let i = 0; i < bandages.length; i++) {
    const color = colors[i % colors.length];
    scans.push({
      bandageId: bandages[i]._id,
      patientId: patients[i]._id,
      nurseId: nurses[i % nurses.length]._id,
      colorDetected: color,
      rgbValue: { r: 100, g: 120, b: 140 },
      phValue: phMap[color],
      infectionLevel: lvlMap[color],
      timestamp: new Date(Date.now() - i * 3600000),
    });
    // Add a follow-up scan for first 5
    if (i < 5) {
      const c2 = colors[(i + 1) % colors.length];
      scans.push({
        bandageId: bandages[i]._id,
        patientId: patients[i]._id,
        nurseId: nurses[(i + 1) % nurses.length]._id,
        colorDetected: c2,
        rgbValue: { r: 110, g: 130, b: 150 },
        phValue: phMap[c2],
        infectionLevel: lvlMap[c2],
        timestamp: new Date(Date.now() - i * 3600000 - 1800000),
      });
    }
  }
  await Scan.insertMany(scans);
  console.log(`📊 Created ${scans.length} scans`);

  console.log('\n✅ Database seeded successfully!');
  console.log('─────────────────────────────────');
  console.log('Admin  : admin@hospital.com   / password123');
  console.log('Doctors: sarah, michael, priya, james, ananya @hospital.com / password123');
  console.log('Nurses : emily, rose, kavya, linda, sunita @hospital.com / password123');
  console.log('─────────────────────────────────');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
