const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/userRoute');

const app = express();

// database connection
require(path.join(__dirname, '/config/mongodb'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport config
require(path.join(__dirname, '/config/passport'));

app.use('/', indexRouter);
app.use('/user', userRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // TODO create 404
});

// error handler
app.use(function (error, req, res, next) {
  res.status(error.status || 500).json({ error: `${error.message}` });
});

module.exports = app;
