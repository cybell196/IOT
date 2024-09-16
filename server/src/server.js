const express = require('express');
const app = express();
const connection = require('./database');

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).send('Có lỗi xảy ra');
    } else {
      res.json(results);
    }
  });
});

app.listen(3000, () => {
  console.log('Server đang chạy trên cổng 3000');
});
