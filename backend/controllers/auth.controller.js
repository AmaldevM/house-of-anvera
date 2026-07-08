const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');
const { sendOTPEmail, sendPasswordResetEmail } = require('../utils/sendEmail');
const asyncHandler = require('../utils/asyncHandler');
const crypto = require('crypto');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
  }
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  const user = await User.create({ name, email, password, phone, otp, otpExpiry });
  await sendOTPEmail(email, otp, name);
  res.status(201).json({ success: true, message: 'OTP sent to your email. Please verify.' });
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, otp, otpExpiry: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
  const token = generateToken(user._id, user.role);
  res.json({
    success: true,
    message: 'Email verified successfully',
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (user.isVerified) return res.status(400).json({ success: false, message: 'Email already verified' });
  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  await sendOTPEmail(email, otp, user.name);
  res.json({ success: true, message: 'OTP resent to your email' });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
  if (!user.isVerified) return res.status(401).json({ success: false, message: 'Please verify your email first' });
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });
  const token = generateToken(user._id, user.role);
  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, user });
});

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (phone) updates.phone = phone;
  if (avatar) updates.avatar = avatar;
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, user });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide current and new password' });
  }
  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password changed successfully' });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: 'No user with that email' });
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  await sendPasswordResetEmail(email, user.name, resetUrl);
  res.json({ success: true, message: 'Password reset link sent to your email' });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'Please provide token and new password' });
  }
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();
  const jwtToken = generateToken(user._id, user.role);
  res.json({ success: true, message: 'Password reset successfully', token: jwtToken });
});

// @desc    Add address
// @route   POST /api/auth/addresses
// @access  Private
exports.addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) {
    user.addresses.forEach(addr => { addr.isDefault = false; });
  }
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, addresses: user.addresses });
});

// @desc    Update address
// @route   PUT /api/auth/addresses/:addressId
// @access  Private
exports.updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const addr = user.addresses.id(req.params.addressId);
  if (!addr) return res.status(404).json({ success: false, message: 'Address not found' });
  if (req.body.isDefault) {
    user.addresses.forEach(a => { a.isDefault = false; });
  }
  Object.assign(addr, req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

// @desc    Delete address
// @route   DELETE /api/auth/addresses/:addressId
// @access  Private
exports.deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});
