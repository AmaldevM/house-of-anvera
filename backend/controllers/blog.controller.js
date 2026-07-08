const Blog = require('../models/Blog.model');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get published blogs (public)
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const filter = { isPublished: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.tag) filter.tags = req.query.tag;
  if (req.query.keyword) {
    filter.$or = [
      { title: { $regex: req.query.keyword, $options: 'i' } },
      { excerpt: { $regex: req.query.keyword, $options: 'i' } },
    ];
  }
  const total = await Blog.countDocuments(filter);
  const blogs = await Blog.find(filter)
    .populate('author', 'name avatar')
    .select('-content')
    .sort('-publishedAt')
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ success: true, total, pages: Math.ceil(total / limit), blogs });
});

// @desc    Get blog by slug (public)
// @route   GET /api/blogs/:slug
// @access  Public
exports.getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug, isPublished: true },
    { $inc: { views: 1 } },
    { new: true }
  ).populate('author', 'name avatar');
  if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
  res.json({ success: true, blog });
});

// @desc    Get all blogs (admin)
// @route   GET /api/admin/blogs
// @access  Private/Admin
exports.getAdminBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find()
    .populate('author', 'name')
    .sort('-createdAt');
  res.json({ success: true, blogs });
});

// @desc    Create blog (admin)
// @route   POST /api/blogs
// @access  Private/Admin
exports.createBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.create({ ...req.body, author: req.user._id });
  res.status(201).json({ success: true, blog });
});

// @desc    Update blog (admin)
// @route   PUT /api/blogs/:id
// @access  Private/Admin
exports.updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
  res.json({ success: true, blog });
});

// @desc    Delete blog (admin)
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
exports.deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
  res.json({ success: true, message: 'Blog deleted' });
});
