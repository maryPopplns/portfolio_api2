const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { logger } = require(path.join(__dirname, '../config/logger'));
const User = require(path.join(__dirname, '../models/user'));
const Post = require(path.join(__dirname, '../models/post'));
const Comment = require(path.join(__dirname, '../models/comment'));

require(path.join(__dirname, '../config/mongodb'));
const closeConnection = () => mongoose.connection.close();

function createUser() {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('123', salt);

  // create user
  User.insertMany([
    {
      username: 'spencer',
      password: hashedPassword,
      superUser: true,
    },
    {
      username: 'test',
      password: hashedPassword,
    },
  ])
    .catch((error) => logger.error(`${error}`))
    .finally(() => closeConnection());
}

function createPost() {
  Post.insertMany([
    {
      title: 'title1',
      body: 'body1',
    },
    {
      title: 'title2',
      body: 'body2',
    },
  ])
    .catch((error) => logger.error(`${error}`))
    .finally(() => closeConnection());
}

function createComment() {
  Comment.create({
    comment: 'title',
    user: '623e5757135c58fdafb6590a',
  })
    .then((result) => logger.info(result))
    .catch((error) => logger.error(`${error}`))
    .finally(() => {
      closeConnection();
    });
}

createUser();
// createPost();
// createComment();
