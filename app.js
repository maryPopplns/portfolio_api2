const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');
const auth = require(path.join(__dirname, './middleware/jwtAuth'));

const miscRouter = require('./routes/miscRouter');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');

const app = express();

// database connection
require(path.join(__dirname, '/config/mongoDB'));

// TODO restrict the origin
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport config
require(path.join(__dirname, '/config/passport'));
// jwt auth
app.use(auth);

app.use('/', miscRouter);
app.use('/post', postRouter);
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
