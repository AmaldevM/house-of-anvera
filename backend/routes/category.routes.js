const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminCategories,
} = require('../controllers/category.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getCategories);
router.get('/admin/all', protect, adminOnly, getAdminCategories);
router.get('/:slug', getCategoryBySlug);

// Admin routes
router.post('/', protect, adminOnly, createCategory);
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
