const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movieControllers');

const regexUrl = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/;

router.get('/', getMovies);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().regex(regexUrl),
      trailerLink: Joi.string().required().regex(regexUrl),
      thumbnail: Joi.string().required().regex(regexUrl),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      movieId: Joi.string().required(),
    }),
  }),
  createMovie,
);
router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required(),
    }),
  }),
  deleteMovieById,
);

module.exports = router;
