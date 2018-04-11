const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('categories');
});

router.get('/add', function(req, res, next) {
  res.render('add-category');
});

module.exports = router;
