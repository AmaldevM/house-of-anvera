const Contact = require('../models/Contact.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendContactReplyEmail } = require('../utils/sendEmail');

// @desc    Submit contact form
// @route   POST /api/contacts
// @access  Public
exports.submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email and message are required' });
  }
  const contact = await Contact.create({ name, email, phone, subject, message });
  res.status(201).json({ success: true, message: 'Thank you for contacting us. We will get back to you soon.' });
});

// @desc    Get all contacts (admin)
// @route   GET /api/contacts
// @access  Private/Admin
exports.getAllContacts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const total = await Contact.countDocuments(filter);
  const contacts = await Contact.find(filter)
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ success: true, total, pages: Math.ceil(total / limit), contacts });
});

// @desc    Get single contact (admin)
// @route   GET /api/contacts/:id
// @access  Private/Admin
exports.getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { $set: { status: 'read' } },
    { new: true }
  );
  if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
  res.json({ success: true, contact });
});

// @desc    Reply to contact (admin)
// @route   PUT /api/contacts/:id/reply
// @access  Private/Admin
exports.replyContact = asyncHandler(async (req, res) => {
  const { reply } = req.body;
  if (!reply) return res.status(400).json({ success: false, message: 'Reply message is required' });
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { adminReply: reply, status: 'replied', repliedAt: new Date() },
    { new: true }
  );
  if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
  await sendContactReplyEmail(contact.email, contact.name, contact.subject || 'Your Inquiry', reply);
  res.json({ success: true, message: 'Reply sent successfully', contact });
});

// @desc    Update contact status (admin)
// @route   PUT /api/contacts/:id/status
// @access  Private/Admin
exports.updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const contact = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
  res.json({ success: true, contact });
});

// @desc    Delete contact (admin)
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
exports.deleteContact = asyncHandler(async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Contact deleted' });
});
