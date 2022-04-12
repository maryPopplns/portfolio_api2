const path = require('path');
const bcrypt = require('bcryptjs');
const { logger } = require(path.join(__dirname, '../../config/logger'));
// setups
const { app, request } = require(path.join(__dirname, '../setup/appSetup'));
const mongoDB = require(path.join(__dirname, '../setup/mongoSetup'));
require(path.join(__dirname, '../../config/passport'));
// user route
const userRoute = require(path.join(__dirname, '../../routes/userRoute'));
app.use('/user', userRoute);
// user model
const User = require(path.join(__dirname, '../../models/user'));

describe('POST /user/login', () => {
  beforeAll(function createUser() {
    // initialize DB
    mongoDB();

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('123', salt);

    // create/save user
    User.create({
      username: 'spencer',
      password: hashedPassword,
    }).catch((error) => logger.error(`${error}`));
  });

  test('users can login with correct username/password', (done) => {
    // log user in with same username/password
    request(app)
      .post('/user/login')
      .type('form')
      .send({ username: 'spencer', password: '123' })
      .expect(200, done);
  });
  test('incorrect username produces error', (done) => {
    // log user in with same username/password
    request(app)
      .post('/user/login')
      .type('form')
      .send({ username: 'spencer1', password: '123' })
      .then((res) => {
        const usernameErrorMessage = {
          message: 'incorrect username',
        };
        const response = res.body;

        expect(response).toEqual(usernameErrorMessage);
        done();
      })
      .catch((error) => done(error));
  });
  test('incorrect password produces error', (done) => {
    // log user in with same username/password
    request(app)
      .post('/user/login')
      .type('form')
      .send({ username: 'spencer', password: '1234' })
      .expect('Content-Type', /json/)
      .then((res) => {
        const passwordErrorMessage = {
          message: 'incorrect password',
        };
        const response = res.body;

        expect(response).toEqual(passwordErrorMessage);
        done();
      })
      .catch((error) => done(error));
  });
});
