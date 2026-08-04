const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Phục vụ file tĩnh (CSS, JS, Images, assets)
app.use(express.static(path.join(__dirname, '.')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Gwo Dyi Duty VN Web App running at http://localhost:${PORT}`);
  });
}

module.exports = app;
