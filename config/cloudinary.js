const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary SDK using process.env safely
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

// Configure Multer storage to stream directly to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gwo_dyi_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Safe upload wrapper middleware to handle Multer / Cloudinary upload errors cleanly
const uploadSingleImage = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        console.error(`Multer/Cloudinary Upload Error on field '${fieldName}':`, err);
        return res.status(500).json({ error: err.message || 'Image upload to Cloudinary failed' });
      }
      next();
    });
  };
};

module.exports = {
  cloudinary,
  upload,
  uploadSingleImage,
};
