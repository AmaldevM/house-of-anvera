const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.keyword) {
    filter.$or = [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { email: { $regex: req.query.keyword, $options: 'i' } },
    ];
  }
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ success: true, total, pages: Math.ceil(total / limit), users });
});

// @desc    Get single user (admin)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('wishlist', 'name slug images');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user });
});

// @desc    Update user role or status (admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  const { role, isVerified } = req.body;
  const updates = {};
  if (role) updates.role = role;
  if (isVerified !== undefined) updates.isVerified = isVerified;
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user });
});

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (user.role === 'admin') {
    return res.status(400).json({ success: false, message: 'Cannot delete an admin user' });
  }
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted successfully' });
});
