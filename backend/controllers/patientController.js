const Patient = require('../models/Patient');
const Scan = require('../models/Scan');

/**
 * Create a new patient
 */
const createPatient = async (req, res) => {
  try {
    const { name, age, gender, patientId, assignedDoctor, medicalHistory } = req.body;

    // Validate required fields
    if (!name || !age || !gender || !patientId || !assignedDoctor) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if patient ID already exists
    const existingPatient = await Patient.findOne({ patientId });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient ID already exists' });
    }

    const patient = new Patient({
      name,
      age,
      gender,
      patientId,
      assignedDoctor,
      medicalHistory: medicalHistory || '',
    });

    await patient.save();
    await patient.populate('assignedDoctor', 'name email');

    res.status(201).json({
      message: 'Patient created successfully',
      patient,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all patients assigned to a doctor
 */
const getPatientsByDoctor = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const patients = await Patient.find({ assignedDoctor: doctorId, isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: 'Patients retrieved',
      patients,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a single patient with latest scan
 */
const getPatientDetails = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId).populate('assignedDoctor', 'name email');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get latest scan
    const latestScan = await Scan.findOne({ patientId }).sort({ timestamp: -1 });

    res.status(200).json({
      patient,
      latestScan: latestScan || null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update patient status
 */
const updatePatientStatus = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { woundStatus, medicalNotes } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      {
        woundStatus: woundStatus || patient.woundStatus,
        medicalHistory: medicalNotes || patient.medicalHistory,
      },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({
      message: 'Patient updated successfully',
      patient,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPatient,
  getPatientsByDoctor,
  getPatientDetails,
  updatePatientStatus,
};
