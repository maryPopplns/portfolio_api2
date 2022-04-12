require('dotenv').config();
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { check } = require('express-validator');
const { logger } = require(path.join(__dirname, '../config/logger'));
const { isLoggedIn, isSuperUser } = require(path.join(
  __dirname,
  '../middleware/auth'
));

const User = require(path.join(__dirname, '../models/user'));

// TODO clean up comments on all pages.

exports.createUser = [
  check('username').trim().escape(),
  check('password').trim().escape(),
  function checkForUser(req, res, next) {
    // check if user exists
    User.findOne({ username: req.body.username })
      .then((userFound) => {
        userFound
          ? res.status(409).json({ message: 'same name exists' })
          : next();
      })
      .catch((error) => next(error));
  },
  function createUser(req, res, next) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // create/save user
    User.create({
      username: req.body.username,
      password: hashedPassword,
    })
      .then(() => res.status(201).json({ message: 'user created' }))
      .catch((error) => next(error));
  },
];

const time = {
  day: Math.floor(Date.now() / 1000) + 360 * 24,
  ten: Math.floor(Date.now() / 1000) + 360 * 240,
};

// login user
exports.loginUser = [
  check('username').trim().escape(),
  check('password').trim().escape(),
  function checkForUser(req, res, next) {
    passport.authenticate(
      'local',
      { session: false },
      function (error, user, info) {
        // error
        error && next(error);
        // !user
        !user && res.status(401).json({ message: info.message });
        // user found | attach user to req object
        req.user = user;
        user && next();
      }
    )(req, res, next);
  },
  function sendJWT(req, res, next) {
    req.login(req.user, { session: false }, (error) => {
      // error
      error && next(error);
      // create token
      const token = jwt.sign(
        {
          data: req.user.toJSON(),
          exp: process.env.ENV === 'dev' ? time.ten : time.day,
        },
        process.env.JWT_SECRET
      );
      // send token/user
      res.json({ user: req.user, token });
    });
  },
];
