const jwt = require('jsonwebtoken');
const { unauthorizedAuth } = require('../errors/errorContent');
const ErrorHandler = require('../errors/errorHandler');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new ErrorHandler(unauthorizedAuth);
  }
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'top-secret',
    );
  } catch (err) {
    throw ErrorHandler(unauthorizedAuth);
  }
  req.user = payload;
  return next();
};
