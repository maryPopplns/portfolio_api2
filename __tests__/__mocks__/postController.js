require('dotenv').config();
const path = require('path');
const async = require('async');
const axios = require('axios');
const { check } = require('express-validator');
const { isLoggedIn, isSuperUser } = require(path.join(
  __dirname,
  '../../controllers/auth'
));

const Post = require(path.join(__dirname, '../../models/post'));
const User = require(path.join(__dirname, '../../models/user'));
const Comment = require(path.join(__dirname, '../../models/comment'));

exports.commentPost = [
  isLoggedIn,
  check('comment').trim().escape(),
  function createComment(req, res, next) {
    const userID = req.user.id;
    const postID = req.params.postID;
    const userComment = req.body.comment;

    Comment.create({
      post: postID,
      user: userID,
      comment: userComment,
    })
      .then((result) => {
        req.commentID = result.id;
        next();
      })
      .catch((error) => next(error));
  },
  function (req, res, next) {
    const userID = req.user.id;
    const postID = req.params.postID;
    const commentID = req.commentID;

    async
      .parallel([
        function updateUser(done) {
          User.findByIdAndUpdate(
            userID,
            { $push: { comments: commentID } },
            { upsert: true, new: true }
          )
            .then(() => done(null))
            .catch((error) => done(error));
        },
        function updatePost(done) {
          Post.findByIdAndUpdate(
            postID,
            { $push: { comments: commentID } },
            { upsert: true, new: true }
          )
            .then(() => {
              done(null);
            })
            .catch((error) => done(error));
        },
      ])
      .then(() => {
        // send response, perform analysis on comment
        res.status(201).json({ message: 'comment added to post' });
        next();
      })
      .catch((error) => next(error));
  },
];
