const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const { cloudinary, uploadSingleImage } = require('../config/cloudinary');

// GET /api/categories - Fetch all Tier 1 categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    console.error('GET /api/categories Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/categories/:id - Fetch single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error(`GET /api/categories/${req.params.id} Error:`, error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/categories - Create Tier 1 Category
router.post('/', uploadSingleImage('image'), async (req, res) => {
  try {
    const { title, tag, description, specsMaterial, specsRange } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Category title is required.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    let imageUrl = '';
    let cloudinaryId = '';

    if (req.file) {
      imageUrl = req.file.path || req.file.secure_url || '';
      cloudinaryId = req.file.filename || req.file.public_id || '';
    }

    const category = await Category.create({
      title,
      slug,
      tag: tag || 'Danh Mục',
      description: description || '',
      specsOverview: {
        material: specsMaterial || 'Inox 304, Thép cacbon',
        range: specsRange || 'Quy cách đa dạng',
      },
      imageUrl,
      cloudinaryId,
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('POST /api/categories Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/categories/:id - Update Tier 1 Category
router.put('/:id', uploadSingleImage('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, tag, description, specsMaterial, specsRange } = req.body;

    let category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    let imageUrl = category.imageUrl;
    let cloudinaryId = category.cloudinaryId;

    if (req.file) {
      if (category.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(category.cloudinaryId);
        } catch (cloudErr) {
          console.error('Error deleting old image from Cloudinary:', cloudErr);
        }
      }
      imageUrl = req.file.path || req.file.secure_url || '';
      cloudinaryId = req.file.filename || req.file.public_id || '';
    }

    category.title = title !== undefined ? title : category.title;
    category.tag = tag !== undefined ? tag : category.tag;
    category.description = description !== undefined ? description : category.description;
    
    category.specsOverview = {
      material: specsMaterial !== undefined ? specsMaterial : (category.specsOverview?.material || ''),
      range: specsRange !== undefined ? specsRange : (category.specsOverview?.range || ''),
    };

    category.imageUrl = imageUrl;
    category.cloudinaryId = cloudinaryId;

    await category.save();

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error(`PUT /api/categories/${req.params.id} Error:`, error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/categories/:id - Delete Category and optionally its sub-products
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (category.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(category.cloudinaryId);
      } catch (cloudErr) {
        console.error('Error deleting image from Cloudinary:', cloudErr);
      }
    }

    // Delete sub-products linked to this category
    await Product.deleteMany({ categoryId: id });
    await Category.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Category and its sub-products deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/categories/${req.params.id} Error:`, error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
