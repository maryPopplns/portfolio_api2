require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const { logger } = require(path.join(__dirname, '../../config/logger'));
// setups
const { app, request } = require(path.join(__dirname, '../setup/appSetup'));
const mongoDB = require(path.join(__dirname, '../setup/mongoSetup'));
// post route
const postRoute = require(path.join(__dirname, '../../routes/postRoute'));
app.use('/post', postRoute);
// post model
const Post = require(path.join(__dirname, '../../models/post'));

describe('GET /post', () => {
  // initialize DB
  beforeEach(mongoDB);
  // clear DB
  afterEach(mongoose.disconnect);

  test('anyone can access all posts', (done) => {
    Post.insertMany([
      {
        title: 'first',
        body: 'first',
      },
      {
        title: 'second',
        body: 'second',
      },
      {
        title: 'third',
        body: 'third',
      },
    ]).catch((error) => logger.error(`${error}`));

    request(app)
      .get('/post')
      .then((res) => {
        const posts = res.body;
        expect(posts.length).toEqual(3);
        done();
      });
  });
  test('route returns correct # of posts', (done) => {
    request(app)
      .get('/post')
      .then((res) => {
        const posts = res.body;
        expect(posts).toEqual({});
        done();
      });
  });
});
