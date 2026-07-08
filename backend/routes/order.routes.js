const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getAdminStats,
} = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Protected (user) routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
