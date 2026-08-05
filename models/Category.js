const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Category title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    tag: {
      type: String,
      default: 'Danh Mục',
    },
    description: {
      type: String,
      default: '',
    },
    specsOverview: {
      material: { type: String, default: '' },
      range: { type: String, default: '' },
    },
    imageUrl: {
      type: String,
      default: '',
    },
    cloudinaryId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);
