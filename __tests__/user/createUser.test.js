const path = require('path');
const { logger } = require(path.join(__dirname, '../../config/logger'));
// setups
const { app, request } = require(path.join(__dirname, '../setup/appSetup'));
const mongoDB = require(path.join(__dirname, '../setup/mongoSetup'));
// user route
const userRoute = require(path.join(__dirname, '../../routes/userRoute'));
app.use('/user', userRoute);
// user model
const User = require(path.join(__dirname, '../../models/user'));

describe('POST /user/create', () => {
  // initialize DB
  beforeAll(mongoDB);

  test('able to create users', (done) => {
    request(app)
      .post('/user/create')
      .type('form')
      .send({ username: 'michael', password: '123' })
      .expect('Content-Type', /json/)
      .expect(201, done);
  });
  test('all users have unique usernames', (done) => {
    // save user to DB
    User.create({
      username: 'spencer',
      password: '123',
    }).catch(() => {
      logger.error('error creating setup user');
      done();
    });
    // create a user w/ same username
    request(app)
      .post('/user/create')
      .type('form')
      .send({ username: 'spencer', password: '123' })
      .expect('Content-Type', /json/)
      .expect(409);

    // testing a second method of creating user twice
    request(app)
      .post('/user/create')
      .type('form')
      .send({ username: 'jack', password: '123' })
      .then(() => {
        request(app)
          .post('/user/create')
          .type('form')
          .send({ username: 'jack', password: '123' })
          .expect(409, done);
      });
  });
});
