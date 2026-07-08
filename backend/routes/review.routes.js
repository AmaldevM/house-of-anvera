const express = require('express');
const router = express.Router();
const {
  getPendingReviews,
  getApprovedReviews,
  approveReview,
  deleteReview,
  getProductReviews,
} = require('../controllers/review.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public routes
router.get('/product/:productId', getProductReviews);

// Admin routes
router.get('/', protect, adminOnly, getPendingReviews);
router.get('/approved', protect, adminOnly, getApprovedReviews);
router.put('/:productId/:reviewId/approve', protect, adminOnly, approveReview);
router.delete('/:productId/:reviewId', protect, adminOnly, deleteReview);

module.exports = router;
