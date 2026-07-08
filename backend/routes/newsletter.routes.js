const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getAllSubscribers,
  deleteSubscriber,
} = require('../controllers/newsletter.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin routes
router.get('/', protect, adminOnly, getAllSubscribers);
router.delete('/:id', protect, adminOnly, deleteSubscriber);

module.exports = router;
