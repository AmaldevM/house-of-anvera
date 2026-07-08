const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  getProductById,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  moderateReview,
  getAdminProducts,
} = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/admin/all', protect, adminOnly, getAdminProducts);
router.get('/id/:id', protect, adminOnly, getProductById);
router.get('/:slug', getProductBySlug);
router.get('/:id/related', getRelatedProducts);

// Protected (user) routes
router.post('/:id/reviews', protect, addReview);

// Admin routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.put('/:productId/reviews/:reviewId', protect, adminOnly, moderateReview);

module.exports = router;
