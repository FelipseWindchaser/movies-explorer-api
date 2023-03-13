const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const appRoutes = require('./routes');
const { limiter, allowedCors } = require('./utils/constants/constants');

const { DB_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  autoIndex: true,
});
app.use(helmet());
app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: allowedCors,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(limiter);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use('/', appRoutes);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'На сервере произошла ошибка' } = err;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
