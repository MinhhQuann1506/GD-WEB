const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Gwo Dyi Duty VN Web App running at http://localhost:${PORT}`);
  });
}

module.exports = app;
