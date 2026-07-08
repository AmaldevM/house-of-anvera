const express = require('express');
const router = express.Router();
const {
  getUPIDetails,
  verifyUPIPayment,
  adminConfirmPayment,
  confirmCOD,
} = require('../controllers/payment.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Customer routes
router.post('/upi-details', protect, getUPIDetails);
router.post('/verify-upi', protect, verifyUPIPayment);
router.post('/confirm-cod', protect, confirmCOD);

// Admin route to manually confirm/reject UPI payment
router.put('/admin/confirm/:orderId', protect, adminOnly, adminConfirmPayment);

module.exports = router;
