const Newsletter = require('../models/Newsletter.model');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  const existing = await Newsletter.findOne({ email: email.toLowerCase() });
  if (existing) {
    if (existing.isActive) {
      return res.status(400).json({ success: false, message: 'Email already subscribed' });
    }
    // Reactivate
    existing.isActive = true;
    existing.subscribedAt = new Date();
    existing.unsubscribedAt = undefined;
    await existing.save();
    return res.json({ success: true, message: 'Successfully resubscribed to newsletter' });
  }

  await Newsletter.create({ email });
  res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter' });
});

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
exports.unsubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  const subscriber = await Newsletter.findOneAndUpdate(
    { email: email.toLowerCase() },
    { isActive: false, unsubscribedAt: new Date() },
    { new: true }
  );
  if (!subscriber) return res.status(404).json({ success: false, message: 'Email not found in our list' });
  res.json({ success: true, message: 'Successfully unsubscribed from newsletter' });
});

// @desc    Get all subscribers (admin)
// @route   GET /api/newsletter
// @access  Private/Admin
exports.getAllSubscribers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const filter = {};
  if (req.query.status === 'active') filter.isActive = true;
  if (req.query.status === 'inactive') filter.isActive = false;
  const total = await Newsletter.countDocuments(filter);
  const subscribers = await Newsletter.find(filter)
    .sort('-subscribedAt')
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ success: true, total, pages: Math.ceil(total / limit), subscribers });
});

// @desc    Delete subscriber (admin)
// @route   DELETE /api/newsletter/:id
// @access  Private/Admin
exports.deleteSubscriber = asyncHandler(async (req, res) => {
  await Newsletter.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Subscriber deleted' });
});
