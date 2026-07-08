const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: String,
  banner: { url: String, publicId: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  scheduledAt: Date,
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

collectionSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Collection', collectionSchema);
