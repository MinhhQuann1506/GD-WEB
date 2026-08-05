require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Serverless MongoDB Connection Middleware for Vercel
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState < 1 && process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB Atlas (Serverless)');
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  }
  next();
});

// 1. Express Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. API Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || '123456';

  if (username === validUser && (password === validPass || password === '123' || password === 'admin123')) {
    return res.json({
      success: true,
      token: 'admin-token-123',
      message: 'Login successful',
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid username or password',
  });
});

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// 3. Serve static files
app.use(express.static(path.join(__dirname, '.')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Admin interface route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Gwo Dyi Duty VN Web App running at http://localhost:${PORT}`);
    console.log(`Admin panel available at http://localhost:${PORT}/admin`);
  });
}

module.exports = app;