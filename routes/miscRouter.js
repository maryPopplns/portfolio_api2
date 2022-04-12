const express = require('express');
const router = express.Router();
const path = require('path');
const { client, contact, grammar } = require(path.join(
  __dirname,
  '../controllers/miscController'
));

router.get('/client', client);
router.post('/contact', contact);
router.post('/grammar', grammar);

module.exports = router;
