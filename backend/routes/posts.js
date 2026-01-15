const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostBySlug,
  getUserPosts,
  updatePost,
  deletePost
} = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../utils/upload');

// Public routes
router.get('/', getPosts);
router.get('/:slug', getPostBySlug);

// Protected routes
router.post('/', auth, upload.single('featuredImage'), createPost);
router.get('/user/my-posts', auth, getUserPosts);
router.put('/:id', auth, upload.single('featuredImage'), updatePost);
router.delete('/:id', auth, deletePost);

module.exports = router;