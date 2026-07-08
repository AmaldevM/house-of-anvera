const express = require('express');
const router = express.Router();
const {
  uploadImage,
  uploadMultipleImages,
  uploadVideo,
  deleteMedia,
} = require('../controllers/upload.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadImage: uploadImageMiddleware, uploadVideo: uploadVideoMiddleware } = require('../middleware/upload.middleware');

// All upload routes require admin
router.post('/image', protect, adminOnly, uploadImageMiddleware.single('image'), uploadImage);
router.post('/images', protect, adminOnly, uploadImageMiddleware.array('images', 10), uploadMultipleImages);
router.post('/video', protect, adminOnly, uploadVideoMiddleware.single('video'), uploadVideo);
router.delete('/', protect, adminOnly, deleteMedia);

module.exports = router;
