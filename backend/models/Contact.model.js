const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: String,
  subject: String,
  message: { type: String, required: true },
  status: { type: String, enum: ['inbox', 'read', 'replied', 'archived'], default: 'inbox' },
  adminReply: String,
  repliedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
