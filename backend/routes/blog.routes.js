const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  getAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blog.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getBlogs);
router.get('/admin/all', protect, adminOnly, getAdminBlogs);
router.get('/:slug', getBlogBySlug);

// Admin routes
router.post('/', protect, adminOnly, createBlog);
router.put('/:id', protect, adminOnly, updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

module.exports = router;
