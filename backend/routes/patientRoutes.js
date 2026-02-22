const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Admin: Create patient
router.post('/', authMiddleware, roleMiddleware(['admin']), patientController.createPatient);

// Doctor: Get all assigned patients
router.get('/my-patients', authMiddleware, roleMiddleware(['doctor']), patientController.getPatientsByDoctor);

// Doctor: Get patient details with latest scan
router.get('/:patientId', authMiddleware, roleMiddleware(['doctor', 'admin']), patientController.getPatientDetails);

// Doctor: Update patient status
router.put(
  '/:patientId',
  authMiddleware,
  roleMiddleware(['doctor', 'admin']),
  patientController.updatePatientStatus
);

module.exports = router;
