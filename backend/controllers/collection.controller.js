const Collection = require('../models/Collection.model');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all active collections
// @route   GET /api/collections
// @access  Public
exports.getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({ isActive: true })
    .populate('products', 'name slug images price discountPrice')
    .sort('sortOrder -createdAt');
  res.json({ success: true, collections });
});

// @desc    Get featured collections
// @route   GET /api/collections/featured
// @access  Public
exports.getFeaturedCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({ isActive: true, isFeatured: true })
    .populate('products', 'name slug images price discountPrice')
    .limit(6)
    .sort('sortOrder');
  res.json({ success: true, collections });
});

// @desc    Get single collection by slug
// @route   GET /api/collections/:slug
// @access  Public
exports.getCollectionBySlug = asyncHandler(async (req, res) => {
  const collection = await Collection.findOne({ slug: req.params.slug, isActive: true })
    .populate({
      path: 'products',
      match: { isActive: true },
      populate: { path: 'category', select: 'name slug' },
    });
  if (!collection) return res.status(404).json({ success: false, message: 'Collection not found' });
  res.json({ success: true, collection });
});

// @desc    Create collection (admin)
// @route   POST /api/collections
// @access  Private/Admin
exports.createCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.create(req.body);
  res.status(201).json({ success: true, collection });
});

// @desc    Update collection (admin)
// @route   PUT /api/collections/:id
// @access  Private/Admin
exports.updateCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!collection) return res.status(404).json({ success: false, message: 'Collection not found' });
  res.json({ success: true, collection });
});

// @desc    Delete collection (admin)
// @route   DELETE /api/collections/:id
// @access  Private/Admin
exports.deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!collection) return res.status(404).json({ success: false, message: 'Collection not found' });
  res.json({ success: true, message: 'Collection deleted' });
});

// @desc    Get all collections (admin)
// @route   GET /api/admin/collections
// @access  Private/Admin
exports.getAdminCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find()
    .populate('products', 'name slug images')
    .sort('-createdAt');
  res.json({ success: true, collections });
});
