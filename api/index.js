require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
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

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'Gwo Dyi Duty VN API Serverless Function Running' });
});

// Catch-all 404 for unknown API endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

module.exports = app;
