const Category = require('../models/Category.model');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .populate('parent', 'name slug')
    .sort('sortOrder name');
  res.json({ success: true, categories });
});

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
exports.getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true })
    .populate('parent', 'name slug');
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, category });
});

// @desc    Create category (admin)
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
});

// @desc    Update category (admin)
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, category });
});

// @desc    Delete category (admin)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, message: 'Category deleted' });
});

// @desc    Get all categories including inactive (admin)
// @route   GET /api/admin/categories
// @access  Private/Admin
exports.getAdminCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find()
    .populate('parent', 'name slug')
    .sort('sortOrder name');
  res.json({ success: true, categories });
});
