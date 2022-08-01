const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userNotFound, conflictEmail, badRequest } = require('../errors/errorContent');
const ErrorHandler = require('../errors/errorHandler');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    email,
    password: hash,
    name,
  })
    .then((user) => {
      User.findById(user._id).then((data) => res.send(data));
    })
    .catch((err) => {
      if (err.code === 11000) {
        const error = new ErrorHandler(conflictEmail);
        return next(error);
      }
      if (err.name === 'ValidationError') {
        const error = new ErrorHandler(badRequest);
        return next(error);
      }
      return next(err);
    }));
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById({ _id })
    .then((user) => {
      if (!user) {
        throw new ErrorHandler(userNotFound);
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports.refreshProfile = (req, res, next) => {
  const { _id } = req.user;
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    _id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new ErrorHandler(userNotFound);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ErrorHandler(badRequest);
        return next(error);
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const { _id } = user;
      const token = jwt.sign(
        { _id },
        NODE_ENV === 'production' ? JWT_SECRET : 'top-secret',
        { expiresIn: '7d' },
      );
      User.findById(user._id).then((data) => {
        res
          .cookie('jwt', token, {
            maxAge: 86400 * 1000 * 7,
            httpOnly: true,
          })
          .send(data);
      });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res
    .cookie('jwt', '', {
      maxAge: -1,
      httpOnly: true,
    })
    .send({ message: 'Вы вышли из системы' });
};
