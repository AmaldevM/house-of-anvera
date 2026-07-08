const express = require('express');
const router = express.Router();
const {
  toggleWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getWishlist);
router.post('/:productId', protect, toggleWishlist);
router.delete('/', protect, clearWishlist);
router.delete('/:productId', protect, removeFromWishlist);

module.exports = router;
