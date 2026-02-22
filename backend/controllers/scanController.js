const Scan = require('../models/Scan');
const Bandage = require('../models/Bandage');
const Patient = require('../models/Patient');
const { extractAverageColor } = require('../utils/imageProcessor');
const { rgbToColor, colorToPhValue, getInfectionLevel } = require('../utils/colorAnalysis');

/**
 * Submit a scan with image or manual color
 */
const submitScan = async (req, res) => {
  try {
    const { bandageId, color } = req.body;
    const nurseId = req.user.id;
    const imagePath = req.file?.path;

    // Validate input
    if (!bandageId) {
      return res.status(400).json({ message: 'Bandage ID is required' });
    }

    // Find bandage by bandageId string or MongoDB ID
    const mongoose = require('mongoose');
    const isObjectId = mongoose.Types.ObjectId.isValid(bandageId);
    const query = isObjectId
      ? { $or: [{ _id: bandageId }, { bandageId: bandageId }] }
      : { bandageId: bandageId };
    let bandage = await Bandage.findOne(query);
    
    if (!bandage) {
      return res.status(404).json({ message: 'Bandage not found' });
    }

    let detectedColor = color;
    let rgbValue = null;

    // If image is provided, extract color
    if (imagePath) {
      try {
        rgbValue = await extractAverageColor(imagePath);
        detectedColor = rgbToColor(rgbValue.r, rgbValue.g, rgbValue.b);
      } catch (error) {
        return res.status(400).json({ message: 'Failed to process image', error: error.message });
      }
    } else if (!color) {
      return res.status(400).json({ message: 'Either image upload or color selection is required' });
    }

    // Validate color
    const validColors = ['Yellow', 'Green', 'Blue', 'Dark Blue'];
    if (!validColors.includes(detectedColor)) {
      return res.status(400).json({ message: 'Invalid color detected or selected' });
    }

    // Calculate pH value and infection level
    const phValue = colorToPhValue(detectedColor);
    const infectionLevel = getInfectionLevel(phValue);

    // Create scan record
    const scan = new Scan({
      bandageId: bandage._id,
      patientId: bandage.patientId,
      nurseId,
      imageUrl: imagePath || null,
      colorDetected: detectedColor,
      rgbValue: rgbValue || { r: 0, g: 0, b: 0 },
      phValue: parseFloat(phValue.toFixed(2)),
      infectionLevel,
      timestamp: new Date(),
    });

    await scan.save();

    res.status(201).json({
      message: 'Scan submitted successfully',
      scan: {
        id: scan._id,
        bandageId: bandage.bandageId,
        color: detectedColor,
        phValue: scan.phValue,
        infectionLevel,
        timestamp: scan.timestamp,
      },
    });
  } catch (error) {
    console.error('Scan submission error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: error.stack 
    });
  }
};

/**
 * Get scan history for a patient
 */
const getScanHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Find patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get all scans for the patient
    const scans = await Scan.find({ patientId })
      .populate('nurseId', 'name email')
      .sort({ timestamp: -1 });

    res.status(200).json({
      message: 'Scan history retrieved',
      patientName: patient.name,
      scans,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get latest scan for a patient
 */
const getLatestScan = async (req, res) => {
  try {
    const { patientId } = req.params;

    const scan = await Scan.findOne({ patientId })
      .sort({ timestamp: -1 })
      .populate('nurseId', 'name email');

    if (!scan) {
      return res.status(404).json({ message: 'No scans found for this patient' });
    }

    res.status(200).json(scan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitScan,
  getScanHistory,
  getLatestScan,
};
