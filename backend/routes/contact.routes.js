const express = require('express');
const router = express.Router();
const {
  submitContact,
  getAllContacts,
  getContactById,
  replyContact,
  updateContactStatus,
  deleteContact,
} = require('../controllers/contact.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public routes
router.post('/', submitContact);

// Admin routes
router.get('/', protect, adminOnly, getAllContacts);
router.get('/:id', protect, adminOnly, getContactById);
router.put('/:id/reply', protect, adminOnly, replyContact);
router.put('/:id/status', protect, adminOnly, updateContactStatus);
router.delete('/:id', protect, adminOnly, deleteContact);

module.exports = router;
