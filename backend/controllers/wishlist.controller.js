const User = require('../models/User.model');
const Product = require('../models/Product.model');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Add/remove product from wishlist (toggle)
// @route   POST /api/wishlist/:productId
// @access  Private
exports.toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  const index = user.wishlist.indexOf(productId);
  let action;
  if (index === -1) {
    user.wishlist.push(productId);
    action = 'added';
  } else {
    user.wishlist.splice(index, 1);
    action = 'removed';
  }
  await user.save();
  res.json({ success: true, message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist`, wishlist: user.wishlist });
});

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    match: { isActive: true },
    populate: { path: 'category', select: 'name slug' },
  });
  res.json({ success: true, wishlist: user.wishlist });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
  await user.save();
  res.json({ success: true, message: 'Product removed from wishlist', wishlist: user.wishlist });
});

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { wishlist: [] });
  res.json({ success: true, message: 'Wishlist cleared' });
});
