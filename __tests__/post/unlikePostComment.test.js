require('dotenv').config();
const path = require('path');
const async = require('async');
const bcrypt = require('bcryptjs');
const { logger } = require(path.join(__dirname, '../../config/logger'));
// setups
const { app, request } = require(path.join(__dirname, '../setup/appSetup'));
const mongoDB = require(path.join(__dirname, '../setup/mongoSetup'));
require(path.join(__dirname, '../../config/passport'));
// jwt auth
const auth = require(path.join(__dirname, '../../middleware/jwtAuth.js'));
app.use(auth);
// routes
const postRoute = require(path.join(__dirname, '../__mocks__/postRoute'));
const userRoute = require(path.join(__dirname, '../../routes/userRoute'));
app.use('/post', postRoute);
app.use('/user', userRoute);
// user model
const User = require(path.join(__dirname, '../../models/user'));

describe('PUT /post/unlike/:postID/:commentID', () => {
  beforeAll(function () {
    // initialize DB
    mongoDB();

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('123', salt);

    User.create({
      username: 'spencer',
      password: hashedPassword,
      superUser: true,
    }).catch((error) => logger.error(`${error}`));
  });

  test('users can unlike comments', (done) => {
    async.waterfall([
      function getToken(cb) {
        request(app)
          .post('/user/login')
          .type('form')
          .send({ username: 'spencer', password: '123' })
          .then((res) => {
            const userID = res.body.user._id;
            const token = res.body.token;
            cb(null, token, userID);
          });
      },
      function createPost(token, userID, cb) {
        const title = 'authorized';
        const body = 'authorized';
        request(app)
          .post('/post')
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({ title, body })
          .then(() => cb(null, token, userID));
      },
      function getPostID(token, userID, cb) {
        request(app)
          .get('/post')
          .then((res) => {
            const postID = res.body[0]._id;
            cb(null, token, userID, postID);
          });
      },
      function commentPost(token, userID, postID, cb) {
        const comment = 'comment for the post';
        const post = postID;
        const user = userID;

        request(app)
          .post(`/post/comment/${postID}`)
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({ comment, post, user })
          .then(() => cb(null, token, userID, postID));
      },
      function getCommentID(token, userID, postID, cb) {
        request(app)
          .get('/post')
          .then((res) => {
            const commentID = res.body[0].comments[0]._id;
            cb(null, token, postID, commentID);
          });
      },
      function likeComment(token, postID, commentID, cb) {
        request(app)
          .put(`/post/like/${postID}/${commentID}`)
          .set('Authorization', `Bearer ${token}`)
          .then(() => cb(null, token, postID, commentID));
      },
      function unlikeComment(token, postID, commentID) {
        request(app)
          .put(`/post/unlike/${postID}/${commentID}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200, done);
      },
    ]);
  });
  test('users can unlike comments once', (done) => {
    async.waterfall([
      function getToken(cb) {
        request(app)
          .post('/user/login')
          .type('form')
          .send({ username: 'spencer', password: '123' })
          .then((res) => {
            const userID = res.body.user._id;
            const token = res.body.token;
            cb(null, token, userID);
          });
      },
      function createPost(token, userID, cb) {
        const title = 'authorized';
        const body = 'authorized';
        request(app)
          .post('/post')
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({ title, body })
          .then(() => cb(null, token, userID));
      },
      function getPostID(token, userID, cb) {
        request(app)
          .get('/post')
          .then((res) => {
            const postID = res.body[0]._id;
            cb(null, token, userID, postID);
          });
      },
      function commentPost(token, userID, postID, cb) {
        const comment = 'comment for the post';
        const post = postID;
        const user = userID;

        request(app)
          .post(`/post/comment/${postID}`)
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({ comment, post, user })
          .then(() => cb(null, token, userID, postID));
      },
      function getCommentID(token, userID, postID, cb) {
        request(app)
          .get('/post')
          .then((res) => {
            const commentID = res.body[0].comments[0];
            cb(null, token, postID, commentID);
          });
      },
      function likeComment(token, postID, commentID, cb) {
        request(app)
          .put(`/post/like/${postID}/${commentID}`)
          .set('Authorization', `Bearer ${token}`)
          .then(() => cb(null, token, postID, commentID));
      },
      function unlikeComment(token, postID, commentID, cb) {
        request(app)
          .put(`/post/unlike/${postID}/${commentID}`)
          .set('Authorization', `Bearer ${token}`)
          .then(() => cb(null, token, postID, commentID));
      },
      function unlikeCommentAgain(token, postID, commentID) {
        request(app)
          .put(`/post/unlike/${postID}/${commentID}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(400, done);
      },
    ]);
  });
  test('users must be authenticated to unlike comments', (done) => {
    async.waterfall([
      function getToken(cb) {
        request(app)
          .post('/user/login')
          .type('form')
          .send({ username: 'spencer', password: '123' })
          .then((res) => {
            const userID = res.body.user._id;
            const token = res.body.token;
            cb(null, token, userID);
          });
      },
      function createPost(token, userID, cb) {
        const title = 'authorized';
        const body = 'authorized';
        request(app)
          .post('/post')
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({ title, body })
          .then(() => cb(null, token, userID));
      },
      function getPostID(token, userID, cb) {
        request(app)
          .get('/post')
          .then((res) => {
            const postID = res.body[0]._id;
            cb(null, token, userID, postID);
          });
      },
      function commentPost(token, userID, postID, cb) {
        const comment = 'comment for the post';
        const post = postID;
        const user = userID;

        request(app)
          .post(`/post/comment/${postID}`)
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({ comment, post, user })
          .then(() => cb(null, token, userID, postID));
      },
      function getCommentID(token, userID, postID, cb) {
        request(app)
          .get('/post')
          .then((res) => {
            const commentID = res.body[0].comments[0];
            cb(null, token, postID, commentID);
          });
      },
      function likeComment(token, postID, commentID, cb) {
        request(app)
          .put(`/post/like/${postID}/${commentID}`)
          .set('Authorization', `Bearer ${token}`)
          .then(() => cb(null, postID, commentID));
      },
      function unlikeComment(postID, commentID) {
        request(app)
          .put(`/post/unlike/${postID}/${commentID}`)
          .expect(401, done);
      },
    ]);
  });
});
