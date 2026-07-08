const Product = require('../models/Product.model');
const APIFeatures = require('../utils/apiFeatures');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all products (public, with filters)
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const resPerPage = parseInt(req.query.limit) || 12;
  const totalProducts = await Product.countDocuments({ isActive: true });
  const features = new APIFeatures(
    Product.find({ isActive: true }).populate('category', 'name slug').populate('collection', 'name slug'),
    req.query
  ).search().filter().sort().paginate(resPerPage);
  const products = await features.query;
  res.json({
    success: true,
    count: products.length,
    total: totalProducts,
    pages: Math.ceil(totalProducts / resPerPage),
    products,
  });
});

// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
exports.getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug')
    .populate('collection', 'name slug')
    .populate('reviews.user', 'name avatar');
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
});

// @desc    Get product by ID (admin)
// @route   GET /api/products/id/:id
// @access  Private/Admin
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('collection', 'name slug');
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .limit(8)
    .populate('category', 'name slug');
  res.json({ success: true, products });
});

// @desc    Get best sellers
// @route   GET /api/products/best-sellers
// @access  Public
exports.getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ isBestSeller: true, isActive: true })
    .limit(8)
    .populate('category', 'name slug');
  res.json({ success: true, products });
});

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
exports.getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isNewArrival: true, isActive: true })
    .limit(8)
    .populate('category', 'name slug');
  res.json({ success: true, products });
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  }).limit(4).populate('category', 'name slug');
  res.json({ success: true, products: related });
});

// @desc    Create product (admin)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
});

// @desc    Delete (soft-delete) product (admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, message: 'Product deleted successfully' });
});

// @desc    Add review to product
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res) => {
  const { rating, comment, images } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ success: false, message: 'Please provide rating and comment' });
  }
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
    images: images || [],
  });
  await product.save();
  res.status(201).json({ success: true, message: 'Review submitted for approval' });
});

// @desc    Approve or reject review (admin)
// @route   PUT /api/products/:productId/reviews/:reviewId
// @access  Private/Admin
exports.moderateReview = asyncHandler(async (req, res) => {
  const { isApproved } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  const review = product.reviews.id(req.params.reviewId);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  review.isApproved = isApproved;
  await product.save();
  res.json({ success: true, message: `Review ${isApproved ? 'approved' : 'rejected'}` });
});

// @desc    Get all products (admin, includes inactive)
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate('category', 'name')
    .populate('collection', 'name')
    .sort('-createdAt');
  res.json({ success: true, count: products.length, products });
});
