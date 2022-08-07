const errorContent = {
  badRequest: {
    statusCode: 400,
    message: 'Переданы некорректные данные',
  },
  unauthorizedLogin: {
    statusCode: 401,
    message: 'Неверный логин или пароль',
  },
  unauthorizedAuth: {
    statusCode: 401,
    message: 'Необходима авторизация',
  },
  forbidden: {
    statusCode: 403,
    message:
      'Недостаточно прав для совершения операции. Отказано в доступе',
  },
  userNotFound: {
    statusCode: 404,
    message: 'Запрашиваемый пользователь не найден',
  },
  movieNotFound: {
    statusCode: 404,
    message: 'Запрашиваемый фильм не найден',
  },
  pageNotFound: {
    statusCode: 404,
    message: 'Error 404. Страница не найдена',
  },
  conflictEmail: {
    statusCode: 409,
    message: 'Пользователь с таким почтовым адресом уже существует',
  },
  conflictMovieId: {
    statusCode: 409,
    message: 'Фильм с таким айди уже существует',
  },
};

module.exports = errorContent;
