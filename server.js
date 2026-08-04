const path = require('path');

// Phục vụ file tĩnh
app.use(express.static(path.join(__dirname, '.')));

// Route trang chủ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
