const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const Coupon = require('../models/Coupon.model');
const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendOrderConfirmationEmail, sendShippingUpdateEmail } = require('../utils/sendEmail');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, couponCode, notes } = req.body;
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items' });
  }

  // Verify products and calculate totals
  let itemsTotal = 0;
  const verifiedItems = [];
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
    }
    const price = product.discountPrice || product.price;
    itemsTotal += price * item.quantity;
    verifiedItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      price,
      quantity: item.quantity,
    });
  }

  // Apply coupon
  let couponDiscount = 0;
  let couponId = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: Date.now() },
    });
    if (coupon) {
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
      }
      if (itemsTotal >= coupon.minOrderValue) {
        if (coupon.type === 'percentage') {
          couponDiscount = (itemsTotal * coupon.value) / 100;
          if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
        } else {
          couponDiscount = coupon.value;
        }
        couponId = coupon._id;
        coupon.usedCount += 1;
        await coupon.save();
      }
    }
  }

  const shippingCost = itemsTotal > 2000 ? 0 : 99;
  const taxable = Math.max(0, itemsTotal - couponDiscount);
  const tax = Math.round(taxable * 0.03);
  const total = taxable + shippingCost + tax;

  const order = await Order.create({
    user: req.user._id,
    orderItems: verifiedItems,
    shippingAddress,
    paymentMethod,
    itemsTotal,
    coupon: couponId,
    couponDiscount,
    shippingCost,
    tax,
    total,
    notes,
    paymentStatus: 'pending',
  });

  // Reduce stock
  for (const item of verifiedItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  // Send confirmation email
  const user = await User.findById(req.user._id);
  try {
    await sendOrderConfirmationEmail(user.email, user.name, {
      _id: order._id,
      products: verifiedItems,
      total: order.total,
      paymentMethod: order.paymentMethod,
    });
  } catch (emailErr) {
    console.error('Order email error:', emailErr.message);
  }

  res.status(201).json({ success: true, order });
});

// @desc    Get user's own orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt')
    .populate('orderItems.product', 'name images slug');
  res.json({ success: true, orders });
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images slug')
    .populate('coupon', 'code type value');
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
  }
  res.json({ success: true, order });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const filter = {};
  if (req.query.status) filter.shippingStatus = req.query.status;
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ success: true, total, pages: Math.ceil(total / limit), orders });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { shippingStatus, trackingNumber, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (shippingStatus) order.shippingStatus = shippingStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (shippingStatus === 'delivered') order.deliveredAt = new Date();
  if (shippingStatus === 'cancelled') order.cancelledAt = new Date();
  await order.save();
  if (shippingStatus === 'shipped') {
    try {
      await sendShippingUpdateEmail(order.user.email, order.user.name, order);
    } catch (emailErr) {
      console.error('Shipping email error:', emailErr.message);
    }
  }
  res.json({ success: true, order });
});

// @desc    Cancel own order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  if (!['pending', 'packed'].includes(order.shippingStatus)) {
    return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
  }
  order.shippingStatus = 'cancelled';
  order.cancelledAt = new Date();
  await order.save();
  // Restore stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }
  res.json({ success: true, message: 'Order cancelled', order });
});

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ shippingStatus: 'pending' });
  const deliveredOrders = await Order.countDocuments({ shippingStatus: 'delivered' });
  const cancelledOrders = await Order.countDocuments({ shippingStatus: 'cancelled' });

  const revenueData = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);
  const totalRevenue = revenueData[0]?.total || 0;

  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        paymentStatus: 'paid',
        createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalProducts = await Product.countDocuments({ isActive: true });
  const lowStockProducts = await Product.find({ stock: { $lt: 5 }, isActive: true }).select('name stock SKU');

  const topProducts = await Order.aggregate([
    { $unwind: '$orderItems' },
    { $group: { _id: '$orderItems.product', name: { $first: '$orderItems.name' }, totalSold: { $sum: '$orderItems.quantity' }, revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  res.json({
    success: true,
    stats: { totalOrders, pendingOrders, deliveredOrders, cancelledOrders, totalRevenue, totalUsers, totalProducts },
    monthlyRevenue,
    lowStockProducts,
    topProducts,
  });
});
