const express = require('express');
const router = express.Router();
const path = require('path');
const { loginUser, createUser } = require(path.join(
  __dirname,
  '../controllers/userController'
));

router.post('/login', loginUser);
router.post('/create', createUser);

module.exports = router;
