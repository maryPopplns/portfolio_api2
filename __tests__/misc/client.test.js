const path = require('path');
const { app, request } = require(path.join(__dirname, '../setup/appSetup'));

const miscRoute = require(path.join(__dirname, '../../routes/miscRoute'));
app.use('/', miscRoute);

describe('GET /client', () => {
  test('serves html', (done) => {
    request(app)
      .get('/client')
      .expect('Content-Type', /text\/html/, done);
  });
  test('successful response code', (done) => {
    request(app).get('/client').expect(200, done);
  });
});
