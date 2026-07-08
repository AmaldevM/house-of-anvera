const Coupon = require('../models/Coupon.model');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
exports.validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderTotal } = req.body;
  if (!code) return res.status(400).json({ success: false, message: 'Coupon code is required' });

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    expiresAt: { $gt: Date.now() },
  });

  if (!coupon) return res.status(404).json({ success: false, message: 'Invalid or expired coupon' });
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
  }
  if (orderTotal < coupon.minOrderValue) {
    return res.status(400).json({
      success: false,
      message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`,
    });
  }

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (orderTotal * coupon.value) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.value;
  }

  res.json({
    success: true,
    coupon: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount: Math.round(discount),
    },
  });
});

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
// @access  Private/Admin
exports.getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.json({ success: true, coupons });
});

// @desc    Create coupon (admin)
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

// @desc    Update coupon (admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
exports.updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
  res.json({ success: true, coupon });
});

// @desc    Delete coupon (admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
  res.json({ success: true, message: 'Coupon deleted' });
});
