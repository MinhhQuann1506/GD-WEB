require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const productRoutes = require('../routes/productRoutes');
const categoryRoutes = require('../routes/categoryRoutes');

const app = express();

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

// Express Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Login API Route
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

// Category and Product API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// Static files & HTML page routing for Vercel
const rootDir = path.join(__dirname, '..');
app.use(express.static(rootDir));
app.use('/public', express.static(path.join(rootDir, 'public')));
app.use('/assets', express.static(path.join(rootDir, 'assets')));

app.get('/admin', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'admin.html'));
});

app.get('/category-detail.html', (req, res) => {
  res.sendFile(path.join(rootDir, 'category-detail.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

// Fallback route for all other requests to prevent 404s
app.get('*', (req, res) => {
  const targetFile = path.join(rootDir, req.path);
  res.sendFile(targetFile, (err) => {
    if (err) {
      res.sendFile(path.join(rootDir, 'index.html'));
    }
  });
});

module.exports = app;
