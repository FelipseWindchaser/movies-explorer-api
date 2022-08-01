const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { login, createUser, logout } = require('../controllers/userControllers');
const ErrorHandler = require('../errors/errorHandler');
const { pageNotFound } = require('../errors/errorContent');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);
router.get('/signout', logout);
router.use('/users', auth, require('./userRoutes'));
router.use('/movies', auth, require('./movieRoutes'));

router.use('*', auth, () => {
  throw new ErrorHandler(pageNotFound);
});

module.exports = router;
