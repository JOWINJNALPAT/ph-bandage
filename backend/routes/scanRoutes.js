const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const scanController = require('../controllers/scanController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

// Nurse: Submit scan
router.post(
  '/submit',
  authMiddleware,
  roleMiddleware(['nurse']),
  upload.single('image'),
  scanController.submitScan
);

// Doctor: Get scan history for patient
router.get(
  '/history/:patientId',
  authMiddleware,
  roleMiddleware(['doctor', 'admin']),
  scanController.getScanHistory
);

// Doctor: Get latest scan for patient
router.get(
  '/latest/:patientId',
  authMiddleware,
  roleMiddleware(['doctor', 'admin']),
  scanController.getLatestScan
);

module.exports = router;
