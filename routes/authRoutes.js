const express = require('express');
const router = express.Router();

// POST /api/login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body || {};

    const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASSWORD || '123';

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      return res.status(200).json({
        success: true,
        token: 'admin-token-123',
        message: 'Logged in successfully as Admin',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
});

module.exports = router;
