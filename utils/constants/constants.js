const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const allowedCors = [
  'http://localhost:3000',
  'https://localhost:3000',
  'http://felipsewindchaser.nomoredomains.sbs',
  'https://felipsewindchaser.nomoredomains.sbs',
  'http://api.felipsewindchaser.nomoredomains.sbs',
  'https://api.felipsewindchaser.nomoredomains.sbs',
];
const regexUrl = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/;
module.exports = {
  limiter,
  allowedCors,
  regexUrl,
};
