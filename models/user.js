const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const ErrorHandler = require('../errors/errorHandler');
const { unauthorizedLogin } = require('../errors/errorContent');

function validateEmail(email) {
  return validator.isEmail(email);
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'необходимо указать почтовый адрес'],
    validate: [validateEmail, 'неправильно указан почтовый адрес или пароль'],
  },
  password: {
    type: String,
    required: [true, 'необходимо указать пароль'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'необходимо заполнить поле имя пользователя'],
    minlength: [2, 'длина поля должна быть не менее 2 символов'],
    maxlength: [30, 'длина поля должна быть не более 30 символов'],
  },
});

userSchema.statics.findUserByCredentials = function checkUser(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorHandler(unauthorizedLogin);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new ErrorHandler(unauthorizedLogin);
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
