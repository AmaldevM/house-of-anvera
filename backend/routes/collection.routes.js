const express = require('express');
const router = express.Router();
const {
  getCollections,
  getFeaturedCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
  getAdminCollections,
} = require('../controllers/collection.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getCollections);
router.get('/featured', getFeaturedCollections);
router.get('/admin/all', protect, adminOnly, getAdminCollections);
router.get('/:slug', getCollectionBySlug);

// Admin routes
router.post('/', protect, adminOnly, createCollection);
router.put('/:id', protect, adminOnly, updateCollection);
router.delete('/:id', protect, adminOnly, deleteCollection);

module.exports = router;
