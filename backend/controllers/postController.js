const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags } = req.body;
    
    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      author: req.user._id,
      featuredImage: req.file ? `/uploads/${req.file.filename}` : null
    });

    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isPublished: true })
      .populate('author', 'username')
      .select('title slug excerpt featuredImage category tags createdAt')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ isPublished: true });

    res.json({
      success: true,
      posts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug, isPublished: true })
      .populate('author', 'username');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .select('title slug isPublished category createdAt')
      .sort('-createdAt');

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.title) {
      updateData.slug = updateData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    if (req.file) {
      updateData.featuredImage = `/uploads/${req.file.filename}`;
    }

    const post = await Post.findOneAndUpdate(
      { _id: id, author: req.user._id },
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOneAndDelete({ _id: id, author: req.user._id });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};