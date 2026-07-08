const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Auth rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts, please try again later.',
});
app.use('/api/auth/', authLimiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/collections', require('./routes/collection.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/wishlist', require('./routes/wishlist.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/coupons', require('./routes/coupon.routes'));
app.use('/api/blogs', require('./routes/blog.routes'));
app.use('/api/contacts', require('./routes/contact.routes'));
app.use('/api/newsletter', require('./routes/newsletter.routes'));
app.use('/api/payment', require('./routes/payment.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'House of Anvera API is running', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(require('./middleware/error.middleware'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
