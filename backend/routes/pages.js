const express = require('express');
const router = express.Router();
const {
  createPage,
  updatePage,
  getPages,
  getPageBySlug,
  deletePage
} = require('../controllers/pageController');
const auth = require('../middleware/auth');

// Protected routes (require authentication)
router.post('/', auth, createPage);
router.put('/:id', auth, updatePage);
router.get('/my-pages', auth, getPages);
router.delete('/:id', auth, deletePage);

// Public route
router.get('/:slug', getPageBySlug);

module.exports = router;