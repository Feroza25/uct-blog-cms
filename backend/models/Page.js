const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  layout: {
    type: Array,
    default: []
  },
  components: [{
    id: String,
    type: String,
    content: String,
    position: {
      x: Number,
      y: Number
    },
    size: {
      width: String,
      height: String
    },
    styles: Object
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Page', PageSchema);