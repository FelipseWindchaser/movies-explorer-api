const mongoose = require('mongoose');

const regexUrl = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/;
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'необходимо указать название страны'],
  },
  director: {
    type: String,
    required: [true, 'необходимо указать имя режиссера'],
  },
  duration: {
    type: Number,
    required: [true, 'необходимо указать длительность фильма'],
  },
  year: {
    type: String,
    required: [true, 'необходимо указать год выпуска фильма'],
  },
  description: {
    type: String,
    required: [true, 'необходимо добавить описание'],
  },
  image: {
    type: String,
    required: [true, 'необходимо указать ссылку на картинку'],
    validate: {
      validator(v) {
        return regexUrl.test(v);
      },
      message: 'неправильный формат ссылки',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'необходимо указать ссылку на трейлер фильма'],
    validate: {
      validator(v) {
        return regexUrl.test(v);
      },
      message: 'Неправильный формат ссылки',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'необходимо указать ссылку на картинку'],
    validate: {
      validator(v) {
        return regexUrl.test(v);
      },
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: [true, 'необходимо указать id фильма'],
    unique: true,
  },
  nameRU: {
    type: String,
    required: [true, 'необходимо указать название фильма на русском языке'],
  },
  nameEN: {
    type: String,
    required: [true, 'необходимо указать название фильма на английском языке'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
