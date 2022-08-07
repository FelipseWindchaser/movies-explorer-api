const {
  badRequest, forbidden, movieNotFound, conflictMovieId,
} = require('../utils/constants/errorContent');
const ErrorHandler = require('../errors/errorHandler');
const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({ owner: _id })
    .populate('owner')
    .then((movie) => res.send(movie.reverse()))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { _id } = req.user;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.find({ owner: _id })
    .populate('owner')
    .then((movie) => {
      if (movie.some((item) => item.movieId.toString() === movieId)) {
        throw new ErrorHandler(conflictMovieId);
      }
      Movie.create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailerLink,
        nameRU,
        nameEN,
        thumbnail,
        movieId,
        owner: _id,
      })
        .then((item) => {
          Movie.findById(item._id)
            .populate('owner')
            .then((createdMovie) => res.send(createdMovie))
            .catch(next);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const error = new ErrorHandler(badRequest);
            return next(error);
          }
          if (err.code === 11000) {
            const error = new ErrorHandler(conflictMovieId);
            return next(error);
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new ErrorHandler(movieNotFound);
      } else if (req.user._id !== movie.owner.toString()) {
        throw new ErrorHandler(forbidden);
      } else {
        return movie.remove()
          .then(() => res.send({ message: 'Фильм успешно удален' }));
      }
    })
    .catch(next);
};
