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
      material:     { type: String, default: 'Inox 304, Thép cacbon' },
      dimensions:   { type: String, default: 'M3 - M24' },
      unitWeight:   { type: Number, default: 0 },  // trọng lượng 1 con hàng (gram)
      manufacturer: { type: String, default: 'GWO DYI DUTY VN Co., Ltd' },
      customWork:   { type: String, default: 'Có (Bản vẽ CAD/PDF, mẫu sản phẩm)' },
      warranty:     { type: String, default: 'Cam kết đổi mới với sản phẩm lỗi dung sai' },
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
