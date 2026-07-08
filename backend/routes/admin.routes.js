const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/admin.controller');
const { getAdminStats } = require('../controllers/order.controller');
const { getAdminProducts } = require('../controllers/product.controller');
const { getAdminCategories } = require('../controllers/category.controller');
const { getAdminCollections } = require('../controllers/collection.controller');
const { getAdminBlogs } = require('../controllers/blog.controller');

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// Dashboard stats
router.get('/stats', getAdminStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Product management (consolidated)
router.get('/products', getAdminProducts);

// Category management (consolidated)
router.get('/categories', getAdminCategories);

// Collection management (consolidated)
router.get('/collections', getAdminCollections);

// Blog management (consolidated)
router.get('/blogs', getAdminBlogs);

module.exports = router;
