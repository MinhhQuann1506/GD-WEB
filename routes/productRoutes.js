const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { cloudinary, uploadSingleImage } = require('../config/cloudinary');

// GET /api/products - Fetch products (supports optional ?categoryId= filtering)
router.get('/', async (req, res) => {
  try {
    const { categoryId, categorySlug } = req.query;
    let query = {};
    if (categoryId) {
      query.categoryId = categoryId;
    } else if (categorySlug) {
      query.categorySlug = categorySlug;
    }

    const products = await Product.find(query).populate('categoryId').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error('GET /api/products Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/:id - Fetch single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(`GET /api/products/${req.params.id} Error:`, error);
    res.status(500).json({ error: error.message });
  }
});

const mongoose = require('mongoose');
const Category = require('../models/Category');

// Helper function to resolve categoryId safely
async function resolveValidCategoryId(catIdInput) {
  if (!catIdInput) return null;
  if (mongoose.Types.ObjectId.isValid(catIdInput)) {
    return catIdInput;
  }
  // If it's a legacy string key (like "legacy-screws") or slug/title, attempt to find a matching Category document by slug or title
  const existingCat = await Category.findOne({
    $or: [{ slug: catIdInput }, { title: catIdInput }]
  });
  if (existingCat && mongoose.Types.ObjectId.isValid(existingCat._id)) {
    return existingCat._id;
  }
  // Return null if not a valid ObjectId and no matching document found, preventing CastError
  return null;
}

// POST /api/products - Add Tier 2 product under category
router.post('/', uploadSingleImage('image'), async (req, res) => {
  try {
    let { name, price, description, categoryId, categorySlug, specsMaterial, specsDimensions, unitWeight, specsManufacturer, specsCustomWork, specsWarranty } = req.body;

    if (!name || price === undefined || price === null || price === '') {
      return res.status(400).json({ success: false, error: 'Product name and price are required.' });
    }

    // Resolve categoryId: handle both real MongoDB ObjectIds and legacy string IDs
    const LEGACY_SLUG_MAP = {
      'legacy-screws': 'screws',
      'legacy-bolts':  'bolts',
      'legacy-nuts':   'nuts',
    };

    let validCategoryId = null;
    let resolvedSlug = categorySlug || null;

    if (categoryId) {
      if (LEGACY_SLUG_MAP[categoryId]) {
        // Legacy ID — store as categorySlug, no ObjectId
        resolvedSlug = LEGACY_SLUG_MAP[categoryId];
        validCategoryId = null;
      } else {
        // Real MongoDB ObjectId or slug/title lookup
        validCategoryId = await resolveValidCategoryId(categoryId);
      }
    }

    let imageUrl = '';
    let cloudinaryId = '';

    if (req.file) {
      imageUrl = req.file.path || req.file.secure_url || '';
      cloudinaryId = req.file.filename || req.file.public_id || '';
    }

    const product = await Product.create({
      name,
      price: Number(price),
      categoryId: validCategoryId,
      categorySlug: resolvedSlug,   // explicitly set (may be null for DB categories)
      description: description || '',
      specifications: {
        material:     specsMaterial     || 'Inox 304, Thép cacbon',
        dimensions:   specsDimensions   || 'Tiêu chuẩn',
        unitWeight:   Number(unitWeight) || 0,
        manufacturer: specsManufacturer || 'GWO DYI DUTY VN Co., Ltd',
        customWork:   specsCustomWork   || 'Có (Bản vẽ CAD/PDF, mẫu sản phẩm)',
        warranty:     specsWarranty     || 'Cam kết đổi mới với sản phẩm lỗi dung sai',
      },
      imageUrl,
      cloudinaryId,
    });

    console.log(`[DEBUG] Product saved: name="${product.name}" | categoryId="${product.categoryId}" | categorySlug="${product.categorySlug}"`);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('POST /api/products Error:', error);
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', uploadSingleImage('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, categoryId, categorySlug, specsMaterial, specsDimensions, unitWeight, specsManufacturer, specsCustomWork, specsWarranty } = req.body;

    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    let imageUrl = product.imageUrl;
    let cloudinaryId = product.cloudinaryId;

    if (req.file) {
      if (product.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(product.cloudinaryId);
        } catch (cloudErr) {
          console.error('Error deleting old image from Cloudinary:', cloudErr);
        }
      }
      imageUrl = req.file.path || req.file.secure_url || '';
      cloudinaryId = req.file.filename || req.file.public_id || '';
    }

    product.name = name !== undefined ? name : product.name;
    product.price = price !== undefined ? Number(price) : product.price;

    if (categoryId !== undefined) {
      product.categoryId = await resolveValidCategoryId(categoryId);
    }
    if (categorySlug !== undefined) product.categorySlug = categorySlug;
    product.description = description !== undefined ? description : product.description;

    if (!product.specifications) {
      product.specifications = {};
    }
    if (specsMaterial !== undefined)     product.specifications.material     = specsMaterial;
    if (specsDimensions !== undefined)   product.specifications.dimensions   = specsDimensions;
    if (unitWeight !== undefined)        product.specifications.unitWeight   = Number(unitWeight) || 0;
    if (specsManufacturer !== undefined) product.specifications.manufacturer = specsManufacturer;
    if (specsCustomWork !== undefined)   product.specifications.customWork   = specsCustomWork;
    if (specsWarranty !== undefined)     product.specifications.warranty     = specsWarranty;

    product.markModified('specifications');

    product.imageUrl = imageUrl;
    product.cloudinaryId = cloudinaryId;

    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(`PUT /api/products/${req.params.id} Error:`, error);
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/products/:id - Delete product and Cloudinary image
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(product.cloudinaryId);
      } catch (cloudErr) {
        console.error('Error deleting image from Cloudinary:', cloudErr);
      }
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/products/${req.params.id} Error:`, error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
