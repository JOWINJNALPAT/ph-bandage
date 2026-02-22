require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Bandage = require('../models/Bandage');
const Scan = require('../models/Scan');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ph-bandage');
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Bandage.deleteMany({});
    await Scan.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@hospital.com',
      password: 'password123',
      role: 'admin',
      department: 'Administration',
    });

    const doctorUser = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'sarah@hospital.com',
      password: 'password123',
      role: 'doctor',
      department: 'Wound Care Unit',
    });

    const nurseUser = await User.create({
      name: 'Nurse Emily Brown',
      email: 'emily@hospital.com',
      password: 'password123',
      role: 'nurse',
      department: 'Wound Care Unit',
    });

    console.log('👤 Created users');

    // Create patients
    const patient1 = await Patient.create({
      name: 'John Doe',
      age: 65,
      gender: 'Male',
      patientId: 'PAT-001',
      assignedDoctor: doctorUser._id,
      medicalHistory: 'Diabetes Type 2, Hypertension',
      woundStatus: 'Active',
    });

    const patient2 = await Patient.create({
      name: 'Jane Smith',
      age: 45,
      gender: 'Female',
      patientId: 'PAT-002',
      assignedDoctor: doctorUser._id,
      medicalHistory: 'No major medical history',
      woundStatus: 'Active',
    });

    console.log('🏥 Created patients');

    // Create bandages
    const bandage1 = await Bandage.create({
      bandageId: 'BANDAGE-001',
      patientId: patient1._id,
      woundLocation: 'Right leg, above knee',
      initialNotes: 'Post-surgical wound',
      isActive: true,
    });

    const bandage2 = await Bandage.create({
      bandageId: 'BANDAGE-002',
      patientId: patient2._id,
      woundLocation: 'Left forearm',
      initialNotes: 'Laceration wound',
      isActive: true,
    });

    console.log('🩹 Created bandages');

    // Create scans
    const scan1 = await Scan.create({
      bandageId: bandage1._id,
      patientId: patient1._id,
      nurseId: nurseUser._id,
      colorDetected: 'Yellow',
      rgbValue: { r: 255, g: 200, b: 50 },
      phValue: 6.0,
      infectionLevel: 'Healthy',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    const scan2 = await Scan.create({
      bandageId: bandage1._id,
      patientId: patient1._id,
      nurseId: nurseUser._id,
      colorDetected: 'Green',
      rgbValue: { r: 100, g: 200, b: 100 },
      phValue: 6.9,
      infectionLevel: 'Mild Risk',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    const scan3 = await Scan.create({
      bandageId: bandage1._id,
      patientId: patient1._id,
      nurseId: nurseUser._id,
      colorDetected: 'Blue',
      rgbValue: { r: 100, g: 150, b: 220 },
      phValue: 7.6,
      infectionLevel: 'Medium Infection',
      timestamp: new Date(),
    });

    const scan4 = await Scan.create({
      bandageId: bandage2._id,
      patientId: patient2._id,
      nurseId: nurseUser._id,
      colorDetected: 'Yellow',
      rgbValue: { r: 255, g: 200, b: 50 },
      phValue: 6.0,
      infectionLevel: 'Healthy',
      timestamp: new Date(),
    });

    console.log('📊 Created scans');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Test Accounts:');
    console.log('-------------------------------------------');
    console.log('Admin:  admin@hospital.com / password123');
    console.log('Doctor: sarah@hospital.com / password123');
    console.log('Nurse:  emily@hospital.com / password123');
    console.log('-------------------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
