const Scan = require('../models/Scan');
const Bandage = require('../models/Bandage');
const Patient = require('../models/Patient');
const { extractAverageColorFromBuffer } = require('../utils/imageProcessor');
const { rgbToColor, colorToPhValue, getInfectionLevel } = require('../utils/colorAnalysis');
// 

/**
 * Submit a scan with image or manual color
 */
const submitScan = async (req, res) => {
  try {
    const { bandageId: rawBandageId, color, confidence, phValue: manualPh } = req.body;
    const bandageId = (rawBandageId || '').trim();
    const nurseId = req.user.id;
    const imageBuffer = req.file?.buffer;

    // Validate input
    if (!bandageId) {
      return res.status(400).json({ message: 'Bandage ID is required' });
    }

    // Find bandage
    const mongoose = require('mongoose');
    let bandage = await Bandage.findOne({ bandageId: bandageId });
    if (!bandage && mongoose.Types.ObjectId.isValid(bandageId)) {
      bandage = await Bandage.findById(bandageId);
    }

    if (!bandage) {
      return res.status(404).json({
        message: `Bandage "${bandageId}" not found. Please check the ID and try again. Valid IDs look like: BANDAGE-001`,
      });
    }

    let detectedColor = color;
    let rgbValue = null;
    let phValue;
    let infectionLevel;
    let scanConfidence = confidence ? parseFloat(confidence) : 0;

    // ── Analyze image or use color ──────────────
    if (imageBuffer) {
      try {
        rgbValue = await extractAverageColorFromBuffer(imageBuffer);
        detectedColor = rgbToColor(rgbValue.r, rgbValue.g, rgbValue.b);
      } catch (imgError) {
        console.error('Image processing failed:', imgError.message);
        if (color) {
          detectedColor = color;
        } else {
          return res.status(400).json({
            message: 'Failed to process the uploaded image. Please select a color manually instead.',
          });
        }
      }
    } else if (!color) {
      return res.status(400).json({ message: 'Please upload an image or select a color manually.' });
    }

    // Validate colour
    const validColors = ['Yellow', 'Green', 'Blue', 'Dark Blue'];
    if (!validColors.includes(detectedColor)) {
      return res.status(400).json({
        message: `Color "${detectedColor}" is not recognised. Please select: Yellow, Green, Blue, or Dark Blue.`,
      });
    }

    // Calculate pH / infection if not already set
    if (phValue === undefined) {
      phValue = manualPh ? parseFloat(manualPh) : colorToPhValue(detectedColor);
    }
    if (infectionLevel === undefined) {
      infectionLevel = getInfectionLevel(phValue);
    }

    // Save scan
    const scan = new Scan({
      bandageId: bandage._id,
      patientId: bandage.patientId,
      nurseId,
      imageUrl: null,
      colorDetected: detectedColor,
      rgbValue: rgbValue || { r: 0, g: 0, b: 0 },
      phValue: parseFloat(phValue.toFixed(2)),
      infectionLevel,
      confidence: scanConfidence,
      timestamp: new Date(),
    });

    await scan.save();

    res.status(201).json({
      message: 'Scan submitted successfully',
      scan: {
        id: scan._id,
        bandageId: bandage.bandageId,
        colorDetected: detectedColor,
        phValue: scan.phValue,
        infectionLevel,
        confidence: scan.confidence,
        timestamp: scan.timestamp,
      },
    });
  } catch (error) {
    console.error('Scan submission error:', error);
    res.status(500).json({
      message: 'An unexpected server error occurred. Please try again.',
      error: error.message,
    });
  }
};

/**
 * Get scan history for a patient
 */
const getScanHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

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
