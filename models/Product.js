const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    categorySlug: {
      type: String,
      default: null,   // NO default — must be set explicitly or left null
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      default: '',
    },
    specifications: {
      material: { type: String, default: 'Inox 304, Thép cacbon' },
      dimensions: { type: String, default: 'M3 - M24' },
      grade: { type: String, default: '4.8, 8.8, 10.9' },
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

module.exports = mongoose.model('Product', productSchema);
