const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'cod'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  // UPI payment fields
  utrNumber: String,          // Customer submits after paying
  paymentNotes: String,       // Internal notes
  // Legacy Razorpay fields (kept for migration compatibility)
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  shippingStatus: {
    type: String,
    enum: ['pending', 'packed', 'shipped', 'delivered', 'cancelled', 'refund_requested', 'refunded'],
    default: 'pending',
  },
  trackingNumber: String,
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  couponDiscount: { type: Number, default: 0 },
  itemsTotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  notes: String,
  deliveredAt: Date,
  cancelledAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
