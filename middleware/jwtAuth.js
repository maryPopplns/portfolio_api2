const passport = require('passport');

module.exports = function (req, res, next) {
  passport.authenticate('jwt', { session: false }, function (error, user) {
    error && next(error);
    user && (req.user = user);
    next();
  })(req, res);
};
