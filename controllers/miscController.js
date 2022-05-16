require('dotenv').config();
const path = require('path');
const axios = require('axios').default;
const { check, validationResult } = require('express-validator');
const { logger } = require(path.join(__dirname, '../config/logger'));

exports.client = function (req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
};

exports.grammar = [
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
