const mongoose = require('mongoose');

const bandageSchema = new mongoose.Schema(
  {
    bandageId: {
      type: String,
      unique: true,
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    removedDate: {
      type: Date,
      default: null,
    },
    woundLocation: {
      type: String,
      required: true,
    },
    initialNotes: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bandage', bandageSchema);
