const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  images: [String],
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true },
  shortDescription: String,
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  images: [{
    url: String,
    publicId: String,
    alt: String,
  }],
  video: { url: String, publicId: String },
  stock: { type: Number, required: true, default: 0 },
  SKU: { type: String, unique: true, sparse: true },
  material: String,
  stone: String,
  weight: String,
  color: String,
  dimensions: String,
  careInstructions: String,
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  tags: [String],
  seoTitle: String,
  seoDescription: String,
  seoKeywords: String,
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  if (this.reviews.length > 0) {
    const approvedReviews = this.reviews.filter(r => r.isApproved);
    if (approvedReviews.length > 0) {
      this.rating = approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length;
      this.numReviews = approvedReviews.length;
    }
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
