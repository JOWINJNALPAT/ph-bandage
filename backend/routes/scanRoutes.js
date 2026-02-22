const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const scanController = require('../controllers/scanController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Use memory storage — works everywhere (no filesystem dependency on Render)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
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
