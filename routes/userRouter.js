const express = require('express');
const router = express.Router();
const path = require('path');
const { loginUser } = require(path.join(
  __dirname,
  '../controllers/userController'
));

router.post('/login', loginUser);

module.exports = router;
