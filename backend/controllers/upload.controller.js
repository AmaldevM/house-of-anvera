const cloudinary = require('../config/cloudinary');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private/Admin
exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const folder = req.query.folder || 'house-of-anvera/products';
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, quality: 'auto', fetch_format: 'auto' },
      (error, result) => { if (error) reject(error); else resolve(result); }
    );
    stream.end(req.file.buffer);
  });
  res.json({ success: true, url: result.secure_url, publicId: result.public_id });
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private/Admin
exports.uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  const folder = req.query.folder || 'house-of-anvera/products';
  const uploadPromises = req.files.map(file => new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, quality: 'auto', fetch_format: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(file.buffer);
  }));
  const results = await Promise.all(uploadPromises);
  res.json({ success: true, images: results });
});

// @desc    Upload video
// @route   POST /api/upload/video
// @access  Private/Admin
exports.uploadVideo = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'house-of-anvera/videos', resource_type: 'video', quality: 'auto' },
      (error, result) => { if (error) reject(error); else resolve(result); }
    );
    stream.end(req.file.buffer);
  });
  res.json({ success: true, url: result.secure_url, publicId: result.public_id });
});

// @desc    Delete media from Cloudinary
// @route   DELETE /api/upload
// @access  Private/Admin
exports.deleteMedia = asyncHandler(async (req, res) => {
  const { publicId, resourceType } = req.body;
  if (!publicId) return res.status(400).json({ success: false, message: 'publicId is required' });
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType || 'image' });
  res.json({ success: true, message: 'Media deleted' });
});
