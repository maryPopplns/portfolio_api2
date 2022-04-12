require('dotenv').config();
const path = require('path');
const axios = require('axios').default;
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');
const { logger } = require(path.join(__dirname, '../config/logger'));
const { isLoggedIn, isSuperUser } = require(path.join(
  __dirname,
  '../middleware/auth'
));

exports.client = function (req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
};

exports.contact = [
  check('email').trim().escape().isEmail(),
  check('message').trim().escape(),
  function emailValidation(req, res, next) {
    const result = validationResult(req);
    const errors = result.errors[0];
    // incorrect email format
    errors && res.status(400).json({ message: 'incorrect email format' });
    !errors && next();
  },
  function sendEmail(req, res, next) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 465,
      service: 'yahoo',
      secure: false,
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: req.body.email,
      text: req.body.message,
    };
    transporter.sendMail(mailOptions, function (error) {
      error && res.status(500).json({ message: `${error}` });
      !error && res.json({ message: 'email successfully sent' });
    });
  },
];

exports.grammar = [
  isLoggedIn,
  isSuperUser,
  check('body').trim().escape(),
  function (req, res, next) {
    const body = req.body.body;

    const baseUrl = 'https://api.textgears.com/grammar?';
    const splitBody = 'text=' + body.split(' ').join('+');
    const language = '&language=en-US';

    const config = {
      url: baseUrl + splitBody + language,
      headers: {
        Authorization: process.env.TEXT_GEARS_API,
      },
    };

    axios(config)
      .then(({ data }) => {
        res.json(data.response);
      })
      .catch(next);
  },
];
