require('dotenv').config();
const he = require('he');
const path = require('path');
const async = require('async');
const axios = require('axios').default;
const { check } = require('express-validator');
const { isLoggedIn, isSuperUser } = require(path.join(
  __dirname,
  '../middleware/auth'
));

const Post = require(path.join(__dirname, '../models/post'));
const User = require(path.join(__dirname, '../models/user'));
const Comment = require(path.join(__dirname, '../models/comment'));

exports.getPosts = function (req, res, next) {
  Post.find()
    .populate('comments')
    .lean()
    .then((allPosts) => {
      const filteredPosts = allPosts.map(
        ({ _id, date, title, body, category, showing, comments }) => {
          const decodedTitle = he.decode(title);
          const decodedBody = he.decode(body);
          const decodedCategory = he.decode(category);

          return {
            _id,
            showing,
            date,
            title: decodedTitle,
            body: decodedBody,
            category: decodedCategory,
          };
        }
      );
      const posts = filteredPosts;
      res.json(posts);
    })
    .catch((error) => next(error));
};

exports.createPost = [
  isLoggedIn,
  isSuperUser,
  check('title').trim().escape(),
  check('body').trim().escape(),
  check('category').trim().escape(),
  check('showing').trim().escape(),
  function savePost(req, res, next) {
    Post.create({
      title: req.body.title,
      body: req.body.body,
      category: req.body.category,
      showing: req.body.showing,
    })
      .then(() => res.status(201).json({ message: 'post created' }))
      .catch((error) => next(error));
  },
];

exports.editPost = [
  isLoggedIn,
  isSuperUser,
  check('title').trim().escape(),
  check('body').trim().escape(),
  check('category').trim().escape(),
  check('showing').trim().escape(),
  function editPost(req, res, next) {
    const postID = req.params.postID;
    const updatedPost = {
      title: req.body.title,
      body: req.body.body,
      category: req.body.category,
      showing: req.body.showing,
    };

    Post.findByIdAndUpdate(postID, updatedPost)
      .then(() => res.json({ message: 'post has been updated' }))
      .catch((error) => next(error));
  },
];

exports.deletePost = [
  isLoggedIn,
  isSuperUser,
  function getCommentIds(req, res, next) {
    Post.findById(req.params.postID)
      .populate('comments')
      .then(({ comments }) => {
        const commentIDs = comments.map((comment) => comment.id);
        const commentUserIDs = comments.map((comment) => comment.user);
        req.comments = commentIDs;
        req.commentUsers = commentUserIDs;

        next();
      })
      .catch(next);
  },
  function deletePostAndComments(req, res, next) {
    async
      .parallel([
        function deletePost(cb) {
          const postID = req.params.postID;
          Post.findByIdAndDelete(postID)
            .then(() => cb())
            .catch(next);
        },
        function deleteComments(cb) {
          Comment.deleteMany({
            _id: {
              $in: req.comments,
            },
          })
            .then(() => cb())
            .catch(next);
        },
      ])
      .then(() => res.json({ message: 'post has been deleted' }))
      .catch(next);
  },
];

exports.commentPost = [
  check('comment').trim().escape(),
  function sentimentAnalysis(req, res, next) {
    const params = {
      PrivateKey: process.env.TEXT_2_DATA_API,
      DocumentText: req.body.comment,
    };

    const data = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    axios
      .post('http://api.text2data.com/v3/analyze', data, config)
      .then(({ data }) => {
        req.data = data;
        const sentiment = data.DocSentimentResultString;
        // if the post is negative
        sentiment === 'negative' &&
          res.status(202).json({ message: 'comment has been recieved' });
        sentiment !== 'negative' && next();
      });
  },
  function createComment(req, res, next) {
    // TODO remove user from comment
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
      .then(() => res.status(201).json({ message: 'comment added to post' }))
      .catch((error) => next(error));
  },
];

exports.deletePostComment = [
  isLoggedIn,
  isSuperUser,
  function (req, res, next) {
    const commentID = req.params.commentID;
    const userID = req.user.id;
    const postID = req.params.postID;

    async
      .parallel([
        function deleteComment(done) {
          Comment.findByIdAndDelete(commentID)
            .then(() => done(null))
            .catch((error) => done(error));
        },
        function updateUser(done) {
          // TODO remove
          User.findByIdAndUpdate(
            userID,
            { $pullAll: { comments: [{ _id: commentID }] } },
            { upsert: true, new: true }
          )
            .then(() => done(null))
            .catch((error) => next(error));
        },
        function updatePost(done) {
          Post.findByIdAndUpdate(
            postID,
            { $pullAll: { comments: [{ _id: commentID }] } },
            { upsert: true, new: true }
          )
            .then(() => done(null))
            .catch((error) => next(error));
        },
      ])
      .then(() => res.json({ message: 'comment has been deleted' }))
      .catch((error) => next(error));
  },
];
