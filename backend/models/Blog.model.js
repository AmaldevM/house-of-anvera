const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  content: { type: String, required: true },
  excerpt: String,
  coverImage: { url: String, publicId: String },
  images: [{ url: String, publicId: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: {
    type: String,
    enum: ['jewelry-care', 'fashion-tips', 'wedding', 'gift-ideas', 'trends', 'other'],
    default: 'other',
  },
  tags: [String],
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  seoTitle: String,
  seoDescription: String,
  seoKeywords: String,
  views: { type: Number, default: 0 },
}, { timestamps: true });

blogSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
