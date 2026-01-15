const Page = require('../models/Page');

exports.createPage = async (req, res) => {
  try {
    const { title, slug } = req.body;
    
    const page = await Page.create({
      title,
      slug,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { layout, components, title, isPublished } = req.body;

    const page = await Page.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      {
        layout,
        components,
        title,
        isPublished,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({
      success: true,
      page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPages = async (req, res) => {
  try {
    const pages = await Page.find({ createdBy: req.user._id })
      .select('title slug isPublished createdAt')
      .sort('-createdAt');

    res.json({
      success: true,
      pages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await Page.findOne({ slug, isPublished: true });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({
      success: true,
      page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await Page.findOneAndDelete({ _id: id, createdBy: req.user._id });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({
      success: true,
      message: 'Page deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};