const Product = require('../models/Product.model');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all pending reviews (admin)
// @route   GET /api/reviews
// @access  Private/Admin
exports.getPendingReviews = asyncHandler(async (req, res) => {
  const products = await Product.find({ 'reviews.0': { $exists: true } })
    .select('name slug reviews')
    .populate('reviews.user', 'name avatar');
  const pendingReviews = [];
  products.forEach(product => {
    product.reviews
      .filter(r => !r.isApproved)
      .forEach(r => {
        pendingReviews.push({
          _id: r._id,
          product: { _id: product._id, name: product.name, slug: product.slug },
          user: r.user,
          name: r.name,
          rating: r.rating,
          comment: r.comment,
          images: r.images,
          createdAt: r.createdAt,
        });
      });
  });
  res.json({ success: true, count: pendingReviews.length, reviews: pendingReviews });
});

// @desc    Get all approved reviews (admin)
// @route   GET /api/reviews/approved
// @access  Private/Admin
exports.getApprovedReviews = asyncHandler(async (req, res) => {
  const products = await Product.find({ 'reviews.0': { $exists: true } })
    .select('name slug reviews')
    .populate('reviews.user', 'name avatar');
  const approvedReviews = [];
  products.forEach(product => {
    product.reviews
      .filter(r => r.isApproved)
      .forEach(r => {
        approvedReviews.push({
          _id: r._id,
          product: { _id: product._id, name: product.name, slug: product.slug },
          user: r.user,
          name: r.name,
          rating: r.rating,
          comment: r.comment,
          images: r.images,
          createdAt: r.createdAt,
        });
      });
  });
  res.json({ success: true, count: approvedReviews.length, reviews: approvedReviews });
});

// @desc    Approve a review (admin)
// @route   PUT /api/reviews/:productId/:reviewId/approve
// @access  Private/Admin
exports.approveReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  const review = product.reviews.id(req.params.reviewId);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  review.isApproved = true;
  await product.save();
  res.json({ success: true, message: 'Review approved' });
});

// @desc    Reject/delete a review (admin)
// @route   DELETE /api/reviews/:productId/:reviewId
// @access  Private/Admin
exports.deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  product.reviews = product.reviews.filter(r => r._id.toString() !== req.params.reviewId);
  await product.save();
  res.json({ success: true, message: 'Review deleted' });
});

// @desc    Get reviews for a specific product (public)
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId)
    .select('reviews rating numReviews')
    .populate('reviews.user', 'name avatar');
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  const approvedReviews = product.reviews.filter(r => r.isApproved);
  res.json({ success: true, rating: product.rating, numReviews: product.numReviews, reviews: approvedReviews });
});
