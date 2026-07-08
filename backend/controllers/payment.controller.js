const crypto = require('crypto');
const asyncHandler = require('../utils/asyncHandler');
const Order = require('../models/Order.model');

// @desc    Get UPI payment details (QR + deep link)
// @route   POST /api/payment/upi-details
// @access  Private
exports.getUPIDetails = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;

  if (!orderId || !amount) {
    return res.status(400).json({ success: false, message: 'orderId and amount are required' });
  }

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const upiId = process.env.UPI_ID || 'hackathon039@oksbi';
  const upiName = encodeURIComponent(process.env.UPI_NAME || 'House of Anvera');
  const amountFixed = parseFloat(amount).toFixed(2);
  const note = encodeURIComponent(`Order #${orderId.slice(-8).toUpperCase()}`);

  // UPI deep link (works with GPay, PhonePe, Paytm, any UPI app)
  const upiLink = `upi://pay?pa=${upiId}&pn=${upiName}&am=${amountFixed}&cu=INR&tn=${note}`;

  // QR code via Google Charts API (no npm needed)
  const qrData = encodeURIComponent(upiLink);
  const qrImageUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${qrData}&choe=UTF-8`;

  // GPay specific link
  const gpayLink = `gpay://upi/pay?pa=${upiId}&pn=${upiName}&am=${amountFixed}&cu=INR&tn=${note}`;

  res.json({
    success: true,
    upiId,
    upiName: process.env.UPI_NAME || 'House of Anvera',
    amount: amountFixed,
    upiLink,
    gpayLink,
    qrImageUrl,
    orderId,
  });
});

// @desc    Verify UPI payment by UTR number submitted by customer
// @route   POST /api/payment/verify-upi
// @access  Private
exports.verifyUPIPayment = asyncHandler(async (req, res) => {
  const { orderId, utrNumber } = req.body;

  if (!orderId || !utrNumber) {
    return res.status(400).json({ success: false, message: 'orderId and UTR number are required' });
  }

  if (utrNumber.length < 10) {
    return res.status(400).json({ success: false, message: 'Invalid UTR number' });
  }

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  // Mark as pending verification (admin will confirm from bank statement)
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      paymentStatus: 'pending',
      utrNumber,
      paymentNotes: `UPI UTR submitted: ${utrNumber}`,
    },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Payment details submitted. Your order will be confirmed within 1-2 hours after verification.',
    order: updatedOrder,
  });
});

// @desc    Admin: Confirm/reject UPI payment
// @route   PUT /api/payment/admin/confirm/:orderId
// @access  Private (Admin)
exports.adminConfirmPayment = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'paid' or 'failed'
  const { orderId } = req.params;

  if (!['paid', 'failed'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status must be paid or failed' });
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { paymentStatus: status },
    { new: true }
  );

  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  res.json({ success: true, message: `Payment marked as ${status}`, order });
});

// @desc    Confirm COD order
// @route   POST /api/payment/confirm-cod
// @access  Private
exports.confirmCOD = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  if (order.paymentMethod !== 'cod') {
    return res.status(400).json({ success: false, message: 'Order is not a COD order' });
  }

  res.json({ success: true, message: 'COD order confirmed', order });
});
