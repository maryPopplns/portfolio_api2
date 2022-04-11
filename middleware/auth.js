exports.isLoggedIn = function (req, res, next) {
  req.user && next();
  !req.user && res.status(401).json({ messsage: 'unauthorized' });
};

exports.isSuperUser = function (req, res, next) {
  const isSuperUser = req.user.superUser;
  isSuperUser && next();
  !isSuperUser && res.status(403).json({ message: 'forbidden' });
};
