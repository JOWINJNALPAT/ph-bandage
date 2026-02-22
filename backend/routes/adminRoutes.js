const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Admin only routes
router.get(
  '/users',
  authMiddleware,
  roleMiddleware(['admin']),
  adminController.getAllUsers
);

router.post(
  '/users',
  authMiddleware,
  roleMiddleware(['admin']),
  adminController.createUser
);

router.put(
  '/users/:userId',
  authMiddleware,
  roleMiddleware(['admin']),
  adminController.updateUserStatus
);

router.get(
  '/analytics',
  authMiddleware,
  roleMiddleware(['admin']),
  adminController.getAnalytics
);

module.exports = router;
