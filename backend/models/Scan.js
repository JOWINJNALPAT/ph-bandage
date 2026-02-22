const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema(
  {
    bandageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bandage',
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    nurseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    colorDetected: {
      type: String,
      enum: ['Yellow', 'Green', 'Blue', 'Dark Blue'],
      required: true,
    },
    rgbValue: {
      r: Number,
      g: Number,
      b: Number,
    },
    phValue: {
      type: Number,
      required: true,
      min: 0,
      max: 14,
    },
    infectionLevel: {
      type: String,
      enum: ['Healthy', 'Mild Risk', 'Medium Infection', 'High Infection'],
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scan', scanSchema);
