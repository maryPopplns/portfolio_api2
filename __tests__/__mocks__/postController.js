require('dotenv').config();
const path = require('path');
const { check } = require('express-validator');

const Post = require(path.join(__dirname, '../../models/post'));
const Comment = require(path.join(__dirname, '../../models/comment'));

exports.commentPost = [
  check('comment').trim().escape(),
  function createComment(req, res, next) {
    const postID = req.params.postID;
    const userComment = req.body.comment;

    Comment.create({
      post: postID,
      comment: userComment,
    })
      .then((result) => {
        req.commentID = result.id;
        next();
      })
      .catch((error) => next(error));
  },
  function updatePost(req, res, next) {
    const postID = req.params.postID;
    const commentID = req.commentID;

    Post.findByIdAndUpdate(
      postID,
      { $push: { comments: commentID } },
      { upsert: true, new: true }
    )
      .then(() => {
        res.status(201).json({ message: 'comment added to post' });
      })
      .catch((error) => next(error));
  },
];
