const express = require('express');
const router = express.Router();
const path = require('path');
const { loginUser, test } = require(path.join(
  __dirname,
  '../controllers/userController'
));

router.post('/login', loginUser);
router.post('/test', test);

module.exports = router;
