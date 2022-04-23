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
const miscRoute = require(path.join(__dirname, '../../routes/miscRouter'));
const userRoute = require(path.join(__dirname, '../../routes/userRouter'));
app.use('/', miscRoute);
app.use('/user', userRoute);
// user model
const User = require(path.join(__dirname, '../../models/user'));

// mock server
const nock = require('nock');

describe('POST /grammar', () => {
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

  test('users can comment on posts', (done) => {
    nock('https://api.textgears.com').get(/.*/gi).reply(200);

    async.waterfall([
      function getToken(cb) {
        request(app)
          .post('/user/login')
          .type('form')
          .send({ username: 'spencer', password: '123' })
          .then((res) => {
            const token = res.body.token;
            cb(null, token);
          });
      },
      function createPost(token) {
        const body = 'authorized';
        request(app)
          .post('/grammar')
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .send({ body })
          .expect(200, done);
      },
    ]);
  });
});
